"use client";

// Mock ported verbatim from ~/Desktop/tenantory/demo.html.
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

    /* ===== Topbar (matches pricing.html) ===== */
    .topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100;
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
    .btn-lg { padding: 15px 28px; font-size: 15px; }
    .btn-xl { padding: 18px 34px; font-size: 16px; border-radius: 100px; font-weight: 700; }

    /* ===== Hero ===== */
    .hero {
      padding: 80px 32px 60px; text-align: center;
      background: radial-gradient(ellipse at 50% 0%, var(--blue-softer), transparent 60%);
    }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--pink-bg); color: #c21a6a;
      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 {
      font-size: clamp(36px, 5.6vw, 60px);
      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;
      color: var(--text);
      max-width: 860px; margin: 0 auto 20px;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: var(--text-muted);
      max-width: 620px; margin: 0 auto 34px; line-height: 1.55;
    }
    .hero-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .hero-meta {
      margin-top: 22px; display: flex; gap: 22px; justify-content: center;
      font-size: 13px; color: var(--text-faint); flex-wrap: wrap;
    }
    .hero-meta span { display: inline-flex; align-items: center; gap: 6px; }
    .hero-meta svg { width: 14px; height: 14px; color: var(--green); }

    /* ===== Tour layout ===== */
    .tour {
      max-width: 1280px; margin: 0 auto; padding: 40px 32px 80px;
      display: grid; grid-template-columns: 240px 1fr; gap: 48px;
      align-items: flex-start;
    }
    .rail {
      position: sticky; top: 96px;
      display: flex; flex-direction: column; gap: 6px;
      padding: 8px 0;
    }
    .rail-title {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      letter-spacing: 0.14em; text-transform: uppercase;
      padding: 6px 12px 12px;
    }
    .rail-pill {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 10px;
      font-size: 13.5px; font-weight: 600; color: var(--text-muted);
      cursor: pointer; border: 1px solid transparent;
      transition: all 0.18s ease; text-align: left; width: 100%;
      line-height: 1.3;
    }
    .rail-pill:hover { background: var(--surface-alt); color: var(--text); }
    .rail-num {
      flex-shrink: 0;
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--surface-alt); color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; border: 1px solid var(--border);
      transition: all 0.18s ease;
    }
    .rail-pill.active {
      background: var(--blue-softer); color: var(--navy);
      border-color: rgba(18,81,173,0.15);
    }
    .rail-pill.active .rail-num {
      background: var(--blue); color: #fff; border-color: var(--blue);
    }
    .rail-pill.done .rail-num {
      background: var(--green-bg); color: var(--green-dark); border-color: transparent;
    }

    .scenes { display: flex; flex-direction: column; gap: 56px; }
    .scene {
      opacity: 0; transform: translateY(18px);
      transition: opacity 0.6s ease, transform 0.6s ease;
      scroll-margin-top: 96px;
    }
    .scene.in-view { opacity: 1; transform: none; }

    .scene-head { margin-bottom: 18px; }
    .scene-num {
      display: inline-flex; align-items: center; gap: 10px;
      font-size: 12px; font-weight: 700; color: var(--blue);
      letter-spacing: 0.14em; text-transform: uppercase;
      margin-bottom: 10px;
    }
    .scene-num-dot {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--blue); color: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; letter-spacing: 0;
    }
    .scene-title {
      font-size: clamp(26px, 3vw, 34px); font-weight: 800;
      letter-spacing: -0.025em; color: var(--text); margin-bottom: 8px;
    }
    .scene-desc { font-size: 16px; color: var(--text-muted); max-width: 640px; }

    /* ===== Browser frame ===== */
    .frame {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      box-shadow: var(--shadow-lg);
      margin-top: 22px; position: relative;
    }
    .frame-bar {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 16px; border-bottom: 1px solid var(--border);
      background: var(--surface-subtle);
    }
    .frame-dots { display: flex; gap: 6px; }
    .frame-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--border-strong); }
    .frame-dot.r { background: #ff6159; }
    .frame-dot.y { background: #ffbd2e; }
    .frame-dot.g { background: #28c941; }
    .frame-url {
      flex: 1; background: var(--surface); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 12px; font-size: 12px; color: var(--text-muted);
      font-variant-numeric: tabular-nums;
      display: flex; align-items: center; gap: 6px;
    }
    .frame-url svg { width: 11px; height: 11px; color: var(--green-dark); flex-shrink: 0; }

    .frame-body { padding: 22px; background: var(--surface-subtle); position: relative; min-height: 360px; }

    /* ===== Callouts ===== */
    .callout {
      position: absolute; z-index: 3;
      background: #14204a; color: #fff;
      padding: 9px 13px; border-radius: 10px;
      font-size: 12.5px; font-weight: 600; line-height: 1.35;
      box-shadow: 0 12px 30px rgba(20,32,74,0.25);
      max-width: 220px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .callout::before {
      content: ""; position: absolute; width: 10px; height: 10px;
      background: #14204a; transform: rotate(45deg);
    }
    .callout.left::before { left: -4px; top: 50%; margin-top: -5px; border-left: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .callout.right::before { right: -4px; top: 50%; margin-top: -5px; }
    .callout.top::before { top: -4px; left: 50%; margin-left: -5px; }
    .callout.bottom::before { bottom: -4px; left: 50%; margin-left: -5px; }
    .callout strong { color: var(--pink); font-weight: 700; display: block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }

    /* SVG line overlay for call-outs */
    .frame-lines { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
    .frame-lines path { stroke: var(--pink); stroke-width: 1.5; fill: none; stroke-dasharray: 4 3; opacity: 0.7; }
    .frame-lines circle { fill: var(--pink); }

    /* ===== Next scene button ===== */
    .scene-next {
      display: inline-flex; align-items: center; gap: 8px;
      margin-top: 18px; padding: 12px 22px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border-strong);
      font-size: 14px; font-weight: 600; color: var(--text);
      cursor: pointer; transition: all 0.15s ease;
    }
    .scene-next:hover {
      background: var(--navy); color: #fff; border-color: var(--navy);
      transform: translateY(-1px); box-shadow: var(--shadow);
    }
    .scene-next svg { width: 14px; height: 14px; transition: transform 0.15s ease; }
    .scene-next:hover svg { transform: translateX(3px); }

    /* ===== Mockup components ===== */
    .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 14px; }
    .kpi {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 14px;
    }
    .kpi-label { font-size: 10.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
    .kpi-value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    .kpi-delta { font-size: 11px; color: var(--green-dark); font-weight: 700; margin-top: 4px; display: inline-flex; align-items: center; gap: 3px; }
    .kpi-delta.neg { color: var(--red); }
    .kpi-delta svg { width: 10px; height: 10px; }

    .panel {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px;
    }
    .panel-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
    }
    .panel-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .panel-link { font-size: 11px; color: var(--blue); font-weight: 600; }

    .rentroll { font-size: 12.5px; }
    .rentroll-row {
      display: grid; grid-template-columns: 1.5fr 1fr 0.7fr 0.8fr; gap: 10px;
      padding: 9px 0; border-bottom: 1px solid var(--border);
      align-items: center;
    }
    .rentroll-row:last-child { border-bottom: none; }
    .rentroll-row.head {
      font-size: 10.5px; font-weight: 700; color: var(--text-muted);
      letter-spacing: 0.08em; text-transform: uppercase;
      padding-top: 2px;
    }
    .rentroll-name { font-weight: 600; color: var(--text); }
    .rentroll-name small { display: block; color: var(--text-faint); font-weight: 500; font-size: 11px; margin-top: 1px; }
    .pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px;
      letter-spacing: 0.02em;
    }
    .pill-green { background: var(--green-bg); color: var(--green-dark); }
    .pill-red { background: rgba(214,69,69,0.12); color: var(--red); }
    .pill-gold { background: rgba(245,166,35,0.14); color: #a66c0a; }
    .pill-blue { background: var(--blue-pale); color: var(--blue); }
    .pill-muted { background: var(--surface-alt); color: var(--text-muted); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    /* Payment flow */
    .pay-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      max-width: 440px; margin: 10px auto;
      box-shadow: var(--shadow-sm);
    }
    .pay-amount { text-align: center; padding: 6px 0 14px; }
    .pay-amount-label { font-size: 11px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .pay-amount-val { font-size: 40px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); font-variant-numeric: tabular-nums; margin-top: 4px; }
    .pay-meta { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .pay-method {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius);
      margin-bottom: 10px;
    }
    .pay-method.active { border-color: var(--blue); background: var(--blue-softer); }
    .pay-method-label { font-size: 13px; font-weight: 600; color: var(--text); }
    .pay-method-label small { display: block; color: var(--text-muted); font-weight: 500; font-size: 11px; }
    .pay-method-fee { font-size: 12px; font-weight: 700; color: var(--green-dark); }
    .pay-autopay {
      display: flex; align-items: center; gap: 10px; margin: 14px 0;
      padding: 10px 12px; border-radius: var(--radius);
      background: var(--blue-softer); border: 1px solid rgba(18,81,173,0.18);
      font-size: 12.5px; color: var(--navy);
    }
    .switch {
      width: 32px; height: 18px; border-radius: 100px;
      background: var(--blue); position: relative; flex-shrink: 0;
    }
    .switch::after {
      content: ""; position: absolute; top: 2px; right: 2px;
      width: 14px; height: 14px; border-radius: 50%; background: #fff;
    }
    .pay-btn {
      display: block; width: 100%;
      background: var(--blue); color: #fff;
      padding: 12px; border-radius: 100px;
      font-weight: 700; font-size: 14px; text-align: center;
    }

    /* Kanban applications */
    .kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .kan-col {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 12px;
    }
    .kan-title {
      font-size: 11px; font-weight: 800; color: var(--text-muted);
      letter-spacing: 0.1em; text-transform: uppercase;
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 10px;
    }
    .kan-count {
      font-size: 10px; background: var(--surface-alt); color: var(--text);
      padding: 2px 7px; border-radius: 100px; font-weight: 700;
    }
    .app-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 10px 11px; margin-bottom: 8px;
      box-shadow: var(--shadow-sm);
    }
    .app-card.highlight {
      border-color: var(--pink); box-shadow: 0 6px 18px rgba(255,73,152,0.18);
    }
    .app-name { font-size: 12.5px; font-weight: 700; color: var(--text); }
    .app-prop { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
    .app-score-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);
    }
    .ai-score {
      display: inline-flex; align-items: center; gap: 5px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      color: #fff; font-size: 11px; font-weight: 800;
      padding: 3px 9px; border-radius: 100px; letter-spacing: 0.02em;
    }
    .ai-score svg { width: 9px; height: 9px; }
    .doc-status { display: inline-flex; gap: 3px; align-items: center; font-size: 10.5px; color: var(--green-dark); font-weight: 700; }
    .doc-status svg { width: 10px; height: 10px; }

    /* Maintenance split */
    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .split-pane {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
    }
    .split-pane-label {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 10.5px; font-weight: 800; color: var(--text-muted);
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;
    }
    .split-pane-label .dot { width: 7px; height: 7px; }
    .mnt-ticket {
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: 8px; padding: 10px 12px;
    }
    .mnt-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
    .mnt-body { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; line-height: 1.45; }
    .mnt-photos { display: flex; gap: 5px; margin-bottom: 8px; }
    .mnt-photo {
      width: 42px; height: 42px; border-radius: 6px;
      background: linear-gradient(135deg, #c9d1dd, #8a93a5);
      border: 1px solid var(--border);
    }
    .mnt-meta { font-size: 11px; color: var(--text-faint); }
    .mnt-assign {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 10px 12px; margin-top: 8px;
      display: flex; align-items: center; gap: 10px;
    }
    .avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-bright), var(--navy));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0;
    }
    .avatar.vendor { background: linear-gradient(135deg, #f5a623, #e09110); }

    /* Lease signing */
    .lease-doc {
      background: #fff; border: 1px solid var(--border);
      border-radius: var(--radius); padding: 22px 26px;
      max-width: 540px; margin: 0 auto;
      box-shadow: var(--shadow);
      position: relative;
    }
    .lease-h { font-size: 14px; font-weight: 800; text-align: center; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text); margin-bottom: 4px; }
    .lease-sub { font-size: 11px; text-align: center; color: var(--text-muted); margin-bottom: 16px; }
    .lease-line {
      height: 7px; border-radius: 3px; background: var(--surface-alt);
      margin-bottom: 7px;
    }
    .lease-line.short { width: 58%; }
    .lease-line.mid { width: 80%; }
    .lease-sig-block {
      margin-top: 18px; padding-top: 14px; border-top: 2px dashed var(--border-strong);
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .lease-sig-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .lease-sig-field {
      height: 34px; border: 1.5px solid var(--blue); border-radius: 6px;
      background: var(--blue-softer);
      margin-top: 5px; display: flex; align-items: center; padding: 0 10px;
      font-family: 'Caveat', 'Brush Script MT', cursive; font-size: 22px;
      color: var(--navy); font-weight: 500; letter-spacing: 0.01em;
    }
    .lease-sig-field.empty {
      border-style: dashed; background: transparent; color: var(--text-faint);
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .lease-cursor {
      display: inline-block; width: 1.5px; height: 22px; background: var(--navy);
      animation: blink 1s step-start infinite; margin-left: 1px;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* Investor report */
    .report-doc {
      background: #fff; border: 1px solid var(--border);
      border-radius: var(--radius); padding: 22px 26px;
      box-shadow: var(--shadow);
      max-width: 520px; margin: 0 auto;
    }
    .report-brand {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 12px; border-bottom: 2px solid var(--navy);
      margin-bottom: 16px;
    }
    .report-logo {
      display: flex; align-items: center; gap: 8px;
      font-weight: 800; font-size: 13px; color: var(--navy);
    }
    .report-logo-mark {
      width: 22px; height: 22px; border-radius: 5px;
      background: linear-gradient(135deg, var(--navy), var(--blue-bright));
    }
    .report-period { font-size: 11px; color: var(--text-muted); font-weight: 600; }
    .report-title { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; color: var(--text); }
    .report-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
    .report-kpi {
      padding: 10px 12px; background: var(--surface-subtle);
      border: 1px solid var(--border); border-radius: 6px;
    }
    .report-kpi-l { font-size: 9.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .report-kpi-v { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin-top: 2px; }
    .report-chart {
      height: 80px; background: var(--blue-softer); border-radius: 6px;
      position: relative; overflow: hidden; border: 1px solid var(--border);
    }
    .report-chart svg { width: 100%; height: 100%; }

    /* Tax pack */
    .tax-wrap {
      display: grid; grid-template-columns: 300px 1fr; gap: 16px;
      align-items: flex-start;
    }
    .tax-action {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 18px;
    }
    .tax-doc-stack { position: relative; min-height: 280px; }
    .tax-doc {
      position: absolute; left: 50%; top: 0;
      width: 240px; background: #fff;
      border: 1px solid var(--border); border-radius: 6px;
      box-shadow: var(--shadow);
      padding: 14px 14px;
      transform-origin: top center;
    }
    .tax-doc-h { font-size: 11px; font-weight: 800; color: var(--navy); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
    .tax-doc-sub { font-size: 10px; color: var(--text-muted); margin-bottom: 10px; }
    .tax-doc-row {
      display: flex; justify-content: space-between;
      font-size: 10.5px; color: var(--text);
      padding: 4px 0; border-bottom: 1px solid var(--border);
    }
    .tax-doc-row:last-child { border-bottom: none; font-weight: 700; }

    /* Brand comparison */
    .brand-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .brand-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      background: var(--surface);
    }
    .brand-card-head {
      padding: 12px 14px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      font-size: 11px; font-variant-numeric: tabular-nums;
      background: var(--surface-subtle); color: var(--text-muted);
    }
    .brand-card-head .lock { display: inline-flex; align-items: center; gap: 5px; }
    .brand-card-head svg { width: 10px; height: 10px; }
    .brand-card-body { padding: 16px; min-height: 180px; display: flex; flex-direction: column; gap: 10px; }
    .brand-logo-row { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
    .brand-mark {
      width: 28px; height: 28px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .brand-mark.tenantory { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }
    .brand-mark.workspace { background: linear-gradient(135deg, #0f9b6a, #1ea97c); }
    .brand-mark svg { width: 14px; height: 14px; }
    .brand-name { font-size: 13px; font-weight: 800; color: var(--text); }
    .brand-domain { font-size: 11px; color: var(--text-faint); font-variant-numeric: tabular-nums; margin-left: auto; }
    .brand-hero { font-size: 14px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
    .brand-ctas { display: flex; gap: 6px; margin-top: auto; padding-top: 10px; }
    .brand-ctas .mini-btn {
      padding: 6px 12px; border-radius: 100px; font-size: 10.5px; font-weight: 700;
    }
    .mini-btn.p1 { background: var(--blue); color: #fff; }
    .mini-btn.p2 { background: #0f9b6a; color: #fff; }
    .mini-btn.ghost { background: var(--surface); border: 1px solid var(--border); color: var(--text); }

    /* ===== Final CTA ===== */
    .final-cta {
      max-width: 1000px; margin: 40px auto 0; padding: 0 32px;
    }
    .cta-card {
      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));
      color: #fff; border-radius: var(--radius-xl);
      padding: 56px 40px; text-align: center;
      position: relative; overflow: hidden;
    }
    .cta-card::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, var(--pink-bg), transparent 70%);
    }
    .cta-card h2 {
      font-size: clamp(26px, 3vw, 36px); font-weight: 800;
      letter-spacing: -0.025em; margin-bottom: 12px;
      color: #fff; position: relative; z-index: 1;
    }
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.82); max-width: 540px; margin: 0 auto 26px; position: relative; z-index: 1; }
    .cta-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 14px; position: relative; z-index: 1; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 20px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 960px) {
      .tour { grid-template-columns: 1fr; gap: 24px; padding: 24px 20px 48px; }
      .rail {
        position: static;
        flex-direction: row; flex-wrap: wrap; gap: 6px;
        padding: 0; overflow-x: auto;
      }
      .rail-title { display: none; }
      .rail-pill { flex: 1 0 auto; }
      .kpi-row { grid-template-columns: repeat(2,1fr); }
      .kanban { grid-template-columns: 1fr; }
      .split, .brand-compare, .tax-wrap { grid-template-columns: 1fr; }
      .tax-doc { position: static; width: 100%; margin-bottom: 10px; transform: none !important; }
      .tax-doc-stack { min-height: 0; }
      .callout { position: static !important; max-width: none; margin-top: 10px; }
      .callout::before { display: none; }
      .frame-lines { display: none; }
    }
    @media (max-width: 640px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 56px 20px 40px; }
      .rentroll-row { grid-template-columns: 1.5fr 0.8fr 0.8fr; }
      .rentroll-row > :nth-child(3) { display: none; }
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
      <a class="tb-nav-item active" href="demo.html">Demo</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16 10 8"/></svg>
      Self-guided tour &middot; 8 scenes &middot; ~2 min
    </div>
    <h1>See Tenantory in <em>2 minutes</em>.</h1>
    <p class="hero-sub">No signup, no sales call, no email gate. Click through the actual product — the flows you&rsquo;ll use every week.</p>
    <div class="hero-actions">
      <a href="#scene-1" class="btn btn-primary btn-xl">
        Start the tour
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a href="onboarding.html" class="btn btn-ghost btn-xl">Skip — start free trial</a>
    </div>
    <div class="hero-meta">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>No account required</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>No email to watch this</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Real product, not a video</span>
    </div>
  </section>

  <!-- Tour -->
  <section class="tour" id="tour">

    <!-- Sticky rail -->
    <aside class="rail" id="rail">
      <div class="rail-title">The tour</div>
      <button class="rail-pill" data-target="scene-1"><span class="rail-num">1</span>Dashboard at a glance</button>
      <button class="rail-pill" data-target="scene-2"><span class="rail-num">2</span>A tenant pays rent</button>
      <button class="rail-pill" data-target="scene-3"><span class="rail-num">3</span>An application arrives</button>
      <button class="rail-pill" data-target="scene-4"><span class="rail-num">4</span>Maintenance, end-to-end</button>
      <button class="rail-pill" data-target="scene-5"><span class="rail-num">5</span>Lease e-signed</button>
      <button class="rail-pill" data-target="scene-6"><span class="rail-num">6</span>Monthly investor report</button>
      <button class="rail-pill" data-target="scene-7"><span class="rail-num">7</span>Month-end tax pack</button>
      <button class="rail-pill" data-target="scene-8"><span class="rail-num">8</span>Your tenants see your brand</button>
    </aside>

    <!-- Scenes -->
    <div class="scenes">

      <!-- Scene 1: Dashboard -->
      <article class="scene" id="scene-1" data-next="scene-2">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">1</span>Scene 01</div>
          <h2 class="scene-title">Dashboard at a glance</h2>
          <p class="scene-desc">Open Tenantory. Every number you care about — this week, this month, right now.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.tenantory.com/dashboard</div>
          </div>
          <div class="frame-body">
            <div class="kpi-row">
              <div class="kpi" id="s1-k1">
                <div class="kpi-label">Collected (MTD)</div>
                <div class="kpi-value">$24,180</div>
                <div class="kpi-delta">+8.2% vs last mo</div>
              </div>
              <div class="kpi" id="s1-k2">
                <div class="kpi-label">Occupancy</div>
                <div class="kpi-value">96%</div>
                <div class="kpi-delta">23 / 24 units</div>
              </div>
              <div class="kpi" id="s1-k3">
                <div class="kpi-label">Late today</div>
                <div class="kpi-value">1</div>
                <div class="kpi-delta neg">$1,450 outstanding</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Vacant</div>
                <div class="kpi-value">1</div>
                <div class="kpi-delta">18 days on market</div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-head">
                <div class="panel-title">Rent roll &middot; April</div>
                <span class="panel-link">View all 24 units</span>
              </div>
              <div class="rentroll">
                <div class="rentroll-row head"><div>Unit</div><div>Tenant</div><div>Due</div><div>Status</div></div>
                <div class="rentroll-row"><div class="rentroll-name">908 Lee Dr NW <small>Unit A</small></div><div>M. Patterson</div><div>$1,450</div><div><span class="pill pill-green"><span class="dot"></span>Paid</span></div></div>
                <div class="rentroll-row"><div class="rentroll-name">3026 Turf Ave <small>Main</small></div><div>J. Alvarez</div><div>$1,675</div><div><span class="pill pill-green"><span class="dot"></span>Paid</span></div></div>
                <div class="rentroll-row"><div class="rentroll-name">412 Pratt St SE <small>Unit 2</small></div><div>R. Thompson</div><div>$1,450</div><div><span class="pill pill-red"><span class="dot"></span>Late 3d</span></div></div>
                <div class="rentroll-row"><div class="rentroll-name">88 Holmes Pl <small>Unit 4</small></div><div>K. Nguyen</div><div>$1,200</div><div><span class="pill pill-green"><span class="dot"></span>Paid</span></div></div>
                <div class="rentroll-row"><div class="rentroll-name">705 Oak Park <small>Unit B</small></div><div>&mdash;</div><div>$1,395</div><div><span class="pill pill-muted"><span class="dot"></span>Vacant</span></div></div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 230,40 C 280,10 340,10 380,40"/>
              <circle cx="228" cy="42" r="3"/>
              <path d="M 420,40 C 460,10 520,10 560,40"/>
              <circle cx="418" cy="42" r="3"/>
              <path d="M 640,180 C 690,200 720,240 720,260"/>
              <circle cx="638" cy="178" r="3"/>
            </svg>

            <div class="callout top" style="top: 56px; left: 58%; transform: translateX(-50%);">
              <strong>KPI</strong>96% occupancy — live across all properties
            </div>
            <div class="callout top" style="top: 56px; left: 18%;">
              <strong>Cash in</strong>$24,180 collected this month
            </div>
            <div class="callout right" style="top: 230px; right: 22px;">
              <strong>Flagged</strong>One late payment — you&rsquo;ll know before a tenant does
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-2">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 2: Pay rent -->
      <article class="scene" id="scene-2" data-next="scene-3">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">2</span>Scene 02</div>
          <h2 class="scene-title">A tenant pays rent.</h2>
          <p class="scene-desc">Your tenant logs into the portal, two taps, done — and your books update themselves.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>pay.lee-three.com/april</div>
          </div>
          <div class="frame-body" style="min-height: 440px; background: linear-gradient(180deg, var(--surface-subtle), var(--surface));">
            <div class="pay-card">
              <div class="pay-amount">
                <div class="pay-amount-label">April rent &middot; 908 Lee Dr NW</div>
                <div class="pay-amount-val">$1,450.00</div>
                <div class="pay-meta">Due Apr 1 &middot; Paid on time, every time</div>
              </div>
              <div class="pay-method active">
                <div>
                  <div class="pay-method-label">Checking &bull;&bull;&bull;&bull; 4821 <small>Regions Bank</small></div>
                </div>
                <div class="pay-method-fee">ACH &middot; $0 fee</div>
              </div>
              <div class="pay-method">
                <div>
                  <div class="pay-method-label">Visa &bull;&bull;&bull;&bull; 2340 <small>Backup card</small></div>
                </div>
                <div class="pay-method-fee" style="color: var(--text-muted);">2.95%</div>
              </div>
              <div class="pay-autopay">
                <div class="switch"></div>
                <div><strong style="color: var(--navy); font-weight: 700;">Autopay on</strong> &middot; draft 1st of each month</div>
              </div>
              <button class="pay-btn">Pay $1,450.00 now</button>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 540,160 C 620,160 680,180 700,220"/>
              <circle cx="538" cy="160" r="3"/>
              <path d="M 560,290 C 640,290 690,310 700,340"/>
              <circle cx="558" cy="290" r="3"/>
              <path d="M 240,160 C 160,150 110,180 90,220"/>
              <circle cx="242" cy="160" r="3"/>
            </svg>

            <div class="callout right" style="top: 150px; right: 24px;">
              <strong>Fees</strong>ACH is free for tenants. Always.
            </div>
            <div class="callout right" style="top: 310px; right: 24px;">
              <strong>Default</strong>Autopay is the default, not the upsell.
            </div>
            <div class="callout left" style="top: 210px; left: 24px;">
              <strong>Auto-posted</strong>Reconciled to the right ledger the second it clears.
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-3">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 3: Applications -->
      <article class="scene" id="scene-3" data-next="scene-4">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">3</span>Scene 03</div>
          <h2 class="scene-title">An application arrives.</h2>
          <p class="scene-desc">Every applicant is scored before you read a word — so you spend time on the ones worth calling.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.tenantory.com/applications</div>
          </div>
          <div class="frame-body">
            <div class="kanban">
              <div class="kan-col">
                <div class="kan-title">New <span class="kan-count">4</span></div>
                <div class="app-card highlight">
                  <div class="app-name">Maya Okafor</div>
                  <div class="app-prop">705 Oak Park &middot; Unit B</div>
                  <div class="app-score-row">
                    <span class="ai-score"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/></svg>94 AI</span>
                    <span class="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>5 / 5 docs</span>
                  </div>
                </div>
                <div class="app-card">
                  <div class="app-name">Jordan Reeves</div>
                  <div class="app-prop">705 Oak Park &middot; Unit B</div>
                  <div class="app-score-row">
                    <span class="ai-score" style="background: linear-gradient(135deg, #f5a623, #e09110);">71 AI</span>
                    <span class="doc-status" style="color: var(--gold);">3 / 5 docs</span>
                  </div>
                </div>
                <div class="app-card">
                  <div class="app-name">Tyler Brooks</div>
                  <div class="app-prop">412 Pratt St &middot; Unit 3</div>
                  <div class="app-score-row">
                    <span class="ai-score" style="background: linear-gradient(135deg, #d64545, #a83737);">48 AI</span>
                    <span class="doc-status" style="color: var(--red);">2 / 5 docs</span>
                  </div>
                </div>
              </div>
              <div class="kan-col">
                <div class="kan-title">Screening <span class="kan-count">2</span></div>
                <div class="app-card">
                  <div class="app-name">Priya Shah</div>
                  <div class="app-prop">412 Pratt St &middot; Unit 3</div>
                  <div class="app-score-row">
                    <span class="ai-score">88 AI</span>
                    <span class="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Credit: 742</span>
                  </div>
                </div>
                <div class="app-card">
                  <div class="app-name">Dev Ramirez</div>
                  <div class="app-prop">88 Holmes Pl &middot; Unit 1</div>
                  <div class="app-score-row">
                    <span class="ai-score">81 AI</span>
                    <span class="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>BG: pending</span>
                  </div>
                </div>
              </div>
              <div class="kan-col">
                <div class="kan-title">Offer <span class="kan-count">1</span></div>
                <div class="app-card">
                  <div class="app-name">Alex Chen</div>
                  <div class="app-prop">3026 Turf Ave &middot; Unit B</div>
                  <div class="app-score-row">
                    <span class="pill pill-blue"><span class="dot"></span>Lease sent</span>
                    <span class="doc-status">Offer sent 2d</span>
                  </div>
                </div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 220,130 C 280,80 340,70 400,80"/>
              <circle cx="218" cy="130" r="3"/>
              <path d="M 130,170 C 80,200 70,240 90,290"/>
              <circle cx="132" cy="168" r="3"/>
              <path d="M 220,170 C 300,220 400,260 520,290"/>
              <circle cx="218" cy="168" r="3"/>
            </svg>

            <div class="callout top" style="top: 42px; left: 48%;">
              <strong>AI pre-score</strong>Income, credit, history &mdash; weighed for you
            </div>
            <div class="callout left" style="top: 278px; left: 24px;">
              <strong>Docs</strong>Completeness checked at a glance
            </div>
            <div class="callout bottom" style="bottom: 22px; left: 58%;">
              <strong>One click</strong>Run background + credit without leaving the card
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-4">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 4: Maintenance -->
      <article class="scene" id="scene-4" data-next="scene-5">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">4</span>Scene 04</div>
          <h2 class="scene-title">Maintenance, end-to-end.</h2>
          <p class="scene-desc">Tenant reports it. Vendor accepts it. You never touch an email thread.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.tenantory.com/maintenance/T-2641</div>
          </div>
          <div class="frame-body" style="min-height: 420px;">
            <div class="split">
              <div class="split-pane">
                <div class="split-pane-label"><span class="dot" style="color: var(--blue);"></span>Tenant view &middot; portal.lee-three.com</div>
                <div class="mnt-ticket">
                  <div class="mnt-title">Kitchen sink is leaking under the cabinet</div>
                  <div class="mnt-body">Started this morning. Placed a bucket under it. Water smells clean, not sewage.</div>
                  <div class="mnt-photos"><div class="mnt-photo"></div><div class="mnt-photo"></div><div class="mnt-photo"></div></div>
                  <div class="mnt-meta">Submitted 9:14 AM &middot; 908 Lee Dr NW, Unit A &middot; Priority: Normal</div>
                </div>
                <div style="margin-top: 10px; font-size: 11.5px; color: var(--text-muted);">Auto-routed to <strong style="color: var(--text);">Huntsville Plumbing Co.</strong> (primary plumbing vendor)</div>
              </div>
              <div class="split-pane">
                <div class="split-pane-label"><span class="dot" style="color: var(--gold);"></span>Vendor view &middot; vendor.tenantory.com</div>
                <div class="mnt-ticket">
                  <div class="mnt-title">Dispatch #T-2641 &middot; Plumbing</div>
                  <div class="mnt-body">908 Lee Dr NW, Huntsville AL &middot; Gate code 4821 &middot; Tenant prefers afternoon.</div>
                  <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <span class="mini-btn p1">Accept &amp; schedule</span>
                    <span class="mini-btn ghost">Decline</span>
                  </div>
                </div>
                <div class="mnt-assign">
                  <div class="avatar vendor">HP</div>
                  <div style="flex: 1;">
                    <div style="font-size: 12.5px; font-weight: 700;">Huntsville Plumbing Co.</div>
                    <div style="font-size: 11px; color: var(--text-muted);">Avg response 14 min &middot; 96 jobs completed</div>
                  </div>
                  <span class="pill pill-green"><span class="dot"></span>Assigned</span>
                </div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 380,220 C 400,180 420,180 440,220"/>
              <circle cx="378" cy="222" r="3"/>
              <circle cx="442" cy="222" r="3"/>
            </svg>

            <div class="callout left" style="top: 105px; left: 24px;">
              <strong>Tenant</strong>Submits with photos, priority, right unit
            </div>
            <div class="callout right" style="top: 105px; right: 24px;">
              <strong>Vendor</strong>Auto-assigned based on category + priority
            </div>
            <div class="callout bottom" style="bottom: 30px; left: 50%; transform: translateX(-50%);">
              <strong>You</strong>Stay out of the email chain &mdash; you only see exceptions
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-5">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 5: Lease sign -->
      <article class="scene" id="scene-5" data-next="scene-6">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">5</span>Scene 05</div>
          <h2 class="scene-title">Lease e-signed.</h2>
          <p class="scene-desc">No DocuSign account, no printed PDF, no scanner. Tenant types their name — and it&rsquo;s filed.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>sign.lee-three.com/lease/2641-okafor</div>
          </div>
          <div class="frame-body" style="min-height: 440px; background: linear-gradient(180deg, #f0f3f8, var(--surface-subtle));">
            <div class="lease-doc">
              <div class="lease-h">Residential Lease Agreement</div>
              <div class="lease-sub">908 Lee Dr NW, Unit A &middot; 12-month term &middot; May 1, 2026</div>
              <div class="lease-line mid"></div>
              <div class="lease-line"></div>
              <div class="lease-line short"></div>
              <div class="lease-line"></div>
              <div class="lease-line mid"></div>
              <div class="lease-sig-block">
                <div>
                  <div class="lease-sig-label">Tenant signature</div>
                  <div class="lease-sig-field">Maya Okafor<span class="lease-cursor"></span></div>
                </div>
                <div>
                  <div class="lease-sig-label">Landlord signature</div>
                  <div class="lease-sig-field empty">Pending &middot; H. Cooper</div>
                </div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 260,340 C 200,340 120,330 90,310"/>
              <circle cx="262" cy="340" r="3"/>
              <path d="M 540,340 C 620,340 680,330 720,310"/>
              <circle cx="538" cy="340" r="3"/>
              <path d="M 400,100 C 400,60 500,40 620,60"/>
              <circle cx="400" cy="100" r="3"/>
            </svg>

            <div class="callout left" style="top: 300px; left: 24px;">
              <strong>Typed sig</strong>Legally binding &middot; ESIGN Act + UETA compliant
            </div>
            <div class="callout right" style="top: 300px; right: 24px;">
              <strong>No DocuSign</strong>Unlimited e-sign on every plan
            </div>
            <div class="callout right" style="top: 60px; right: 24px;">
              <strong>Auto-filed</strong>Saved to tenant&rsquo;s documents on sign
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-6">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 6: Investor report -->
      <article class="scene" id="scene-6" data-next="scene-7">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">6</span>Scene 06</div>
          <h2 class="scene-title">Monthly investor report.</h2>
          <p class="scene-desc">The 1st of the month, every LP on your list gets a branded PDF in their inbox. You didn&rsquo;t lift a finger.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.tenantory.com/reports/investor-april-2026.pdf</div>
          </div>
          <div class="frame-body" style="min-height: 440px; background: linear-gradient(180deg, #e8ecf3, #f0f3f8);">
            <div class="report-doc">
              <div class="report-brand">
                <div class="report-logo">
                  <div class="report-logo-mark"></div>
                  The Lee Three LLC
                </div>
                <div class="report-period">Q2 &middot; April 2026</div>
              </div>
              <div class="report-title">Monthly performance &middot; portfolio summary</div>
              <div class="report-kpis">
                <div class="report-kpi"><div class="report-kpi-l">NOI</div><div class="report-kpi-v">$18,420</div></div>
                <div class="report-kpi"><div class="report-kpi-l">Occupancy</div><div class="report-kpi-v">96%</div></div>
                <div class="report-kpi"><div class="report-kpi-l">CoC return</div><div class="report-kpi-v">11.8%</div></div>
              </div>
              <div class="report-chart">
                <svg viewBox="0 0 400 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#1665D8" stop-opacity="0.35"/>
                      <stop offset="100%" stop-color="#1665D8" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M 0,60 L 40,52 L 80,48 L 120,42 L 160,36 L 200,30 L 240,32 L 280,24 L 320,20 L 360,14 L 400,10 L 400,80 L 0,80 Z" fill="url(#chartFill)"/>
                  <path d="M 0,60 L 40,52 L 80,48 L 120,42 L 160,36 L 200,30 L 240,32 L 280,24 L 320,20 L 360,14 L 400,10" fill="none" stroke="#1665D8" stroke-width="2"/>
                </svg>
              </div>
              <div style="margin-top: 14px; font-size: 10.5px; color: var(--text-muted); line-height: 1.5;">
                Delivered April 1 at 6:00 AM CT to 4 investors &middot; 3.2 MB PDF &middot; IRR updated through period close
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 260,80 C 200,60 140,60 90,80"/>
              <circle cx="262" cy="80" r="3"/>
              <path d="M 560,110 C 640,90 700,100 720,130"/>
              <circle cx="558" cy="110" r="3"/>
              <path d="M 560,390 C 640,390 700,370 720,340"/>
              <circle cx="558" cy="390" r="3"/>
            </svg>

            <div class="callout left" style="top: 70px; left: 24px;">
              <strong>Auto-sent</strong>Generated and mailed on the 1st
            </div>
            <div class="callout right" style="top: 100px; right: 24px;">
              <strong>Branded</strong>Your logo, your LLC, your colors
            </div>
            <div class="callout right" style="top: 380px; right: 24px;">
              <strong>Every LP</strong>Each investor configured once, delivered forever
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-7">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 7: Tax pack -->
      <article class="scene" id="scene-7" data-next="scene-8">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">7</span>Scene 07</div>
          <h2 class="scene-title">Month-end tax pack, one click.</h2>
          <p class="scene-desc">Every property, every receipt, every depreciation entry — in a Schedule E your CPA will thank you for.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.tenantory.com/reports/schedule-e</div>
          </div>
          <div class="frame-body" style="min-height: 420px;">
            <div class="tax-wrap">
              <div class="tax-action">
                <div style="font-size: 11px; font-weight: 800; color: var(--blue); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">Schedule E &middot; 2026 tax year</div>
                <div style="font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px;">Export full tax pack</div>
                <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 18px;">One PDF. All 7 properties. Income, expenses, depreciation, receipts attached.</div>
                <button class="pay-btn" style="background: var(--pink);">Generate PDF &middot; 24 units</button>
                <div style="margin-top: 14px; font-size: 11.5px; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--green-dark);"><polyline points="20 6 9 17 4 12"/></svg>
                  QuickBooks optional &middot; not required
                </div>
              </div>
              <div class="tax-doc-stack">
                <div class="tax-doc" style="transform: translateX(-60%) rotate(-4deg);">
                  <div class="tax-doc-h">Form 1040 Schedule E</div>
                  <div class="tax-doc-sub">908 Lee Dr NW &middot; 2026</div>
                  <div class="tax-doc-row"><span>Rents received</span><span>$17,400</span></div>
                  <div class="tax-doc-row"><span>Repairs</span><span>$1,184</span></div>
                  <div class="tax-doc-row"><span>Mgmt fees</span><span>$0</span></div>
                  <div class="tax-doc-row"><span>Depreciation</span><span>$6,218</span></div>
                  <div class="tax-doc-row"><span>Net income</span><span>$9,998</span></div>
                </div>
                <div class="tax-doc" style="transform: translateX(-50%) rotate(0deg); top: 20px;">
                  <div class="tax-doc-h">Form 1040 Schedule E</div>
                  <div class="tax-doc-sub">3026 Turf Ave &middot; 2026</div>
                  <div class="tax-doc-row"><span>Rents received</span><span>$20,100</span></div>
                  <div class="tax-doc-row"><span>Repairs</span><span>$847</span></div>
                  <div class="tax-doc-row"><span>Mgmt fees</span><span>$0</span></div>
                  <div class="tax-doc-row"><span>Depreciation</span><span>$7,445</span></div>
                  <div class="tax-doc-row"><span>Net income</span><span>$11,808</span></div>
                </div>
                <div class="tax-doc" style="transform: translateX(-40%) rotate(4deg); top: 40px;">
                  <div class="tax-doc-h">Summary &middot; 7 props</div>
                  <div class="tax-doc-sub">Portfolio total &middot; 2026</div>
                  <div class="tax-doc-row"><span>Gross rents</span><span>$148,200</span></div>
                  <div class="tax-doc-row"><span>Expenses</span><span>$42,180</span></div>
                  <div class="tax-doc-row"><span>Depreciation</span><span>$38,405</span></div>
                  <div class="tax-doc-row"><span>Taxable net</span><span>$67,615</span></div>
                </div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 580,130 C 640,110 690,120 720,140"/>
              <circle cx="578" cy="130" r="3"/>
            </svg>

            <div class="callout top" style="top: 16px; left: 62%;">
              <strong>One PDF</strong>Every property on one pack &mdash; no spreadsheet sorcery
            </div>
            <div class="callout bottom" style="bottom: 18px; left: 18%;">
              <strong>Your CPA</strong>Ready for e-file &middot; no rework
            </div>
            <div class="callout right" style="top: 160px; right: 24px;">
              <strong>No QB</strong>Accounting is built in, not bolted on
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="scene-8">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

      <!-- Scene 8: Branding -->
      <article class="scene" id="scene-8" data-next="final">
        <div class="scene-head">
          <div class="scene-num"><span class="scene-num-dot">8</span>Scene 08</div>
          <h2 class="scene-title">Your tenants see your brand.</h2>
          <p class="scene-desc">Tenantory is invisible to your renters. The portal, the domain, the emails — all yours.</p>
        </div>
        <div class="frame">
          <div class="frame-bar">
            <div class="frame-dots"><span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span></div>
            <div class="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>two tenant portals &middot; side by side</div>
          </div>
          <div class="frame-body" style="min-height: 360px;">
            <div class="brand-compare">
              <div class="brand-card">
                <div class="brand-card-head">
                  <span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> portal.tenantory.com</span>
                  <span>Starter plan</span>
                </div>
                <div class="brand-card-body">
                  <div class="brand-logo-row">
                    <div class="brand-mark tenantory">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
                    </div>
                    <div class="brand-name">Tenantory</div>
                    <div class="brand-domain">portal.tenantory.com</div>
                  </div>
                  <div class="brand-hero">Welcome back, Maya.</div>
                  <div style="font-size: 12px; color: var(--text-muted);">April rent &middot; $1,450 &middot; Due in 6 days</div>
                  <div style="height: 6px; background: var(--blue); border-radius: 3px; width: 72%;"></div>
                  <div style="font-size: 11px; color: var(--text-faint); margin-top: auto;">Powered by Tenantory</div>
                  <div class="brand-ctas"><span class="mini-btn p1">Pay now</span><span class="mini-btn ghost">Request maintenance</span></div>
                </div>
              </div>
              <div class="brand-card" style="border-color: var(--green); box-shadow: 0 10px 30px rgba(30,169,124,0.15);">
                <div class="brand-card-head" style="background: rgba(30,169,124,0.05);">
                  <span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--green-dark);"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> portal.lee-three.com</span>
                  <span style="color: var(--green-dark); font-weight: 700;">Workspace plan</span>
                </div>
                <div class="brand-card-body">
                  <div class="brand-logo-row">
                    <div class="brand-mark workspace">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>
                    </div>
                    <div class="brand-name">The Lee Three</div>
                    <div class="brand-domain">portal.lee-three.com</div>
                  </div>
                  <div class="brand-hero">Welcome back, Maya.</div>
                  <div style="font-size: 12px; color: var(--text-muted);">April rent &middot; $1,450 &middot; Due in 6 days</div>
                  <div style="height: 6px; background: #0f9b6a; border-radius: 3px; width: 72%;"></div>
                  <div style="font-size: 11px; color: var(--text-faint); margin-top: auto;">A service of The Lee Three LLC</div>
                  <div class="brand-ctas"><span class="mini-btn p2">Pay now</span><span class="mini-btn ghost">Request maintenance</span></div>
                </div>
              </div>
            </div>

            <svg class="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 640,80 C 700,60 720,40 720,20"/>
              <circle cx="638" cy="80" r="3"/>
            </svg>

            <div class="callout top" style="top: 14px; right: 10%;">
              <strong>Your brand</strong>Logo, domain, color, sender email &mdash; all yours
            </div>
          </div>
        </div>
        <button class="scene-next" data-next="final">See what's next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      </article>

    </div>
  </section>

  <!-- Final CTA -->
  <section class="final-cta" id="final">
    <div class="cta-card">
      <h2>Ready for the real thing?</h2>
      <p>Start your 14-day free trial. No credit card. Move your whole portfolio in under an hour — or we&rsquo;ll do it for you.</p>
      <div class="cta-actions">
        <a class="btn btn-pink btn-xl" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-xl" href="mailto:hello@tenantory.com?subject=Book%20a%20call">Book a 20-min call</a>
      </div>
      <div class="cta-note">No card required &middot; Cancel anytime &middot; Keep your data on export</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="demo.html">Demo</a>
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
