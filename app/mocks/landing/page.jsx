"use client";

// Mock ported verbatim from ~/Desktop/tenantory/landing.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: #1a1f36;
      background: #ffffff;
      line-height: 1.55;
      font-size: 16px;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    img, svg { display: block; max-width: 100%; }
    input, select { font-family: inherit; font-size: inherit; }

    :root {
      --navy: #2F3E83;
      --navy-dark: #1e2a5e;
      --blue: #1251AD;
      --blue-bright: #1665D8;
      --blue-pale: rgb(241, 245, 255);
      --pink: #FF4998;
      --pink-bg: rgba(237, 185, 236, 0.3);
      --text: #1a1f36;
      --text-muted: #5a6478;
      --text-faint: #8a93a5;
      --surface: #ffffff;
      --surface-alt: #f7f9fc;
      --border: #e3e8ef;
      --border-strong: #c9d1dd;
      --gold: #f5a623;
      --green: #1ea97c;
      --green-dark: #138a60;
      --red: #d64545;
      --radius-sm: 8px;
      --radius: 12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-sm: 0 1px 3px rgba(26,31,54,0.06);
      --shadow: 0 6px 24px rgba(26,31,54,0.08);
      --shadow-lg: 0 20px 60px rgba(26,31,54,0.12);
      --max: 1200px;
    }

    .wrap { max-width: var(--max); margin: 0 auto; padding: 0 24px; }
    section { padding: 88px 0; }
    @media (max-width: 860px) {
      section { padding: 56px 0; }
      .wrap { padding: 0 20px; }
    }

    h1, h2, h3, h4 { color: var(--text); font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
    h1 { font-size: clamp(38px, 5.8vw, 66px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }
    h2 { font-size: clamp(30px, 3.8vw, 48px); letter-spacing: -0.03em; }
    h3 { font-size: 20px; }
    h4 { font-size: 17px; font-weight: 600; }
    p { color: var(--text-muted); }
    .lead { font-size: clamp(17px, 1.7vw, 20px); color: var(--text-muted); line-height: 1.55; font-weight: 400; }

    .eyebrow {
      display: inline-block;
      font-size: 13px;
      font-weight: 700;
      color: var(--blue);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin-bottom: 16px;
    }
    .eyebrow-dark { color: rgba(255,255,255,0.7); }
    .eyebrow-pink { color: var(--pink); }

    .section-head { text-align: center; max-width: 820px; margin: 0 auto 56px; }
    .section-head .lead { margin-top: 16px; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 24px; border-radius: 100px;
      font-weight: 600; font-size: 15px;
      transition: all .2s ease; white-space: nowrap;
    }
    .btn-primary {
      background: var(--blue); color: #fff;
    }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: var(--shadow); }
    .btn-ghost {
      color: var(--navy); border: 1.5px solid var(--border-strong); background: #fff;
    }
    .btn-ghost:hover { border-color: var(--navy); color: var(--navy); }
    .btn-lg { padding: 16px 28px; font-size: 16px; }
    .btn-white { background: #fff; color: var(--navy); }
    .btn-white:hover { background: #f0f4ff; }
    .btn-gold { background: var(--gold); color: #fff; }
    .btn-gold:hover { background: #e09110; }
    .chevron-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--blue); font-weight: 600; font-size: 15px;
    }
    .chevron-link:hover { color: var(--navy); }
    .chevron-link svg { width: 16px; height: 16px; transition: transform .2s ease; }
    .chevron-link:hover svg { transform: translateX(3px); }

    .new-pill {
      display: inline-block;
      background: var(--pink-bg); color: var(--pink);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 3px 8px; border-radius: 4px;
      margin-left: 6px; vertical-align: middle;
    }

    .hours-pill {
      display: inline-block;
      background: rgba(30,169,124,0.12); color: var(--green-dark);
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.02em;
      padding: 4px 10px; border-radius: 100px;
    }

    /* ===== Top utility ===== */
    .top-bar {
      background: var(--navy-dark); color: #fff;
      padding: 10px 0; font-size: 13px; text-align: center;
    }
    .top-bar strong { color: var(--pink); font-weight: 700; }
    .top-bar a { text-decoration: underline; margin-left: 6px; color: rgba(255,255,255,0.9); }

    /* ===== Nav ===== */
    .nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255,255,255,0.95); backdrop-filter: saturate(180%) blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 72px; gap: 40px;
    }
    .logo {
      display: flex; align-items: center; gap: 10px;
      font-weight: 800; font-size: 22px; letter-spacing: -0.02em;
      color: var(--navy);
    }
    .logo-mark {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--navy);
      display: flex; align-items: center; justify-content: center;
    }
    .logo-mark svg { width: 18px; height: 18px; color: #fff; }
    .nav-links { display: flex; align-items: center; gap: 28px; flex: 1; }
    .nav-links > a { font-size: 14px; color: var(--text); font-weight: 500; }
    .nav-links > a:hover { color: var(--blue); }
    .nav-cta { display: flex; align-items: center; gap: 16px; }
    @media (max-width: 1000px) {
      .nav-links { display: none; }
    }

    /* ===== Hero ===== */
    .hero {
      padding: 80px 0 56px;
      background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);
    }
    .hero-grid {
      display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center;
    }
    .hero h1 { margin-bottom: 20px; }
    .hero h1 em { font-style: normal; color: var(--blue); }
    .hero h1 u {
      text-decoration: none;
      display: inline-block;
      padding: 0 6px 4px;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='2' seed='4'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23FF4998' fill-opacity='0.42' filter='url(%23r)'/></svg>");
      background-repeat: no-repeat;
      background-position: 0 55%;
      background-size: 100% 60%;
    }
    .hero p.lead { margin-bottom: 32px; max-width: 580px; }
    .hero-form {
      display: flex; gap: 8px; max-width: 520px;
      background: #fff; padding: 6px; border-radius: 100px;
      box-shadow: var(--shadow); border: 1px solid var(--border);
      margin-bottom: 14px;
    }
    .hero-form input {
      flex: 1; border: none; outline: none;
      padding: 12px 20px; font-size: 15px; background: transparent;
    }
    .hero-form button {
      background: var(--blue); color: #fff;
      padding: 12px 24px; border-radius: 100px;
      font-weight: 600; font-size: 14px; transition: all .2s ease;
    }
    .hero-form button:hover { background: var(--navy); }
    .hero-microcopy { font-size: 13px; color: var(--text-faint); margin-bottom: 28px; padding-left: 20px; }
    .hero-microcopy strong { color: var(--pink); }

    /* Founder credibility block */
    .founder-block {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; background: #fff;
      border: 1px solid var(--border); border-radius: 14px;
      max-width: 520px; box-shadow: var(--shadow-sm);
    }
    .founder-avatar {
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--blue));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 20px; flex-shrink: 0;
      border: 2px solid #fff; box-shadow: var(--shadow-sm);
    }
    .founder-text { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    .founder-text strong { color: var(--text); font-weight: 700; }

    /* Device stack (desktop + floating phone) */
    .device-stack {
      position: relative;
      padding: 20px 0 40px 60px;
      min-height: 520px;
    }
    .device-desktop {
      position: relative;
      background: #fff;
      border-radius: 14px;
      border: 1px solid var(--border);
      box-shadow: 0 30px 80px rgba(26,31,54,0.18), 0 8px 24px rgba(26,31,54,0.08);
      overflow: hidden;
      margin-left: auto;
      width: 100%;
      max-width: 620px;
    }
    .device-desktop-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; background: #f1f3f7;
      border-bottom: 1px solid var(--border);
    }
    .device-desktop-bar .dot { width: 10px; height: 10px; border-radius: 50%; }
    .device-desktop-bar .dot.r { background: #ff5f57; }
    .device-desktop-bar .dot.y { background: #febc2e; }
    .device-desktop-bar .dot.g { background: #28c840; }
    .device-desktop-url {
      margin-left: 10px; padding: 4px 12px;
      background: #fff; border-radius: 6px;
      font-size: 11px; color: var(--text-faint);
      border: 1px solid var(--border);
      flex: 1; max-width: 220px;
    }
    .device-desktop-body { padding: 18px; }
    .dd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
    .dd-stat { padding: 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-alt); }
    .dd-stat-label { font-size: 10px; color: var(--text-faint); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
    .dd-stat-val { font-size: 19px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
    .dd-stat-delta { font-size: 10px; color: var(--green); font-weight: 600; margin-top: 3px; }
    .dd-rows { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .dd-row { display: grid; grid-template-columns: 1.6fr 1fr 80px; gap: 10px; padding: 10px 12px; font-size: 12px; border-bottom: 1px solid var(--border); align-items: center; }
    .dd-row:last-child { border-bottom: none; }
    .dd-row-head { background: var(--surface-alt); color: var(--text-faint); font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }

    /* Phone frame floating in front */
    .device-phone {
      position: absolute;
      left: 0; bottom: 0;
      width: 200px;
      background: #1a1f36;
      border-radius: 28px;
      padding: 8px;
      box-shadow: 0 30px 80px rgba(26,31,54,0.28), 0 10px 30px rgba(26,31,54,0.15);
      z-index: 2;
    }
    .device-phone-screen {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      border-radius: 22px;
      padding: 20px 14px 16px;
      color: #fff;
      position: relative;
      overflow: hidden;
    }
    .device-phone-notch {
      position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
      width: 60px; height: 14px; background: #1a1f36; border-radius: 10px;
    }
    .dp-brand-top {
      margin-top: 14px;
      font-size: 10px; font-weight: 800;
      color: var(--pink);
      text-transform: uppercase; letter-spacing: 0.14em;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 14px;
    }
    .dp-welcome { font-size: 15px; font-weight: 700; margin-bottom: 14px; letter-spacing: -0.01em; }
    .dp-card {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 10px;
    }
    .dp-card-label { font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 6px; }
    .dp-card-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .dp-card-sub { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px; }
    .dp-btn {
      display: block; width: 100%; text-align: center;
      background: var(--pink); color: #fff;
      padding: 10px; border-radius: 100px;
      font-size: 12px; font-weight: 700;
      margin-top: 8px;
    }
    .dp-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .dp-row:last-child { border-bottom: none; }
    .dp-row span:first-child { color: rgba(255,255,255,0.75); }
    .dp-row strong { color: #fff; font-weight: 700; }
    .dp-brand {
      font-size: 9px; color: rgba(255,255,255,0.55);
      text-align: center; margin-top: 10px;
      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;
    }
    .dp-brand strong { color: #fff; font-weight: 800; }

    /* Floating overlay badge */
    .device-overlay {
      position: absolute;
      bottom: 10px; right: -10px;
      background: #fff; border-radius: 14px; padding: 14px 18px;
      box-shadow: var(--shadow-lg); border: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
      z-index: 3;
    }
    .device-overlay-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(30,169,124,0.15); color: var(--green-dark);
      display: flex; align-items: center; justify-content: center;
    }
    .device-overlay-text strong { display: block; font-size: 18px; color: var(--text); font-weight: 800; line-height: 1; }
    .device-overlay-text span { font-size: 12px; color: var(--text-muted); }

    @media (max-width: 960px) {
      .device-stack { padding: 0; min-height: 0; }
      .device-desktop { max-width: 100%; }
      .device-phone { position: relative; left: auto; bottom: auto; width: 180px; margin: -40px auto 0; }
      .device-overlay { position: relative; bottom: auto; right: auto; margin: 20px auto 0; max-width: max-content; }
    }

    .pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }
    .pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }
    .pill-green { background: rgba(30,169,124,0.12); color: var(--green); }
    .pill-red { background: rgba(214,69,69,0.12); color: var(--red); }
    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }
      .hero-form { margin-left: auto; margin-right: auto; }
      .hero-microcopy { padding-left: 0; }
      .founder-block { margin-left: auto; margin-right: auto; text-align: left; }
      .hero p.lead { margin-left: auto; margin-right: auto; }
    }
    @media (max-width: 520px) {
      .hero-form { flex-direction: column; padding: 12px; border-radius: 16px; }
      .hero-form input { text-align: center; padding: 10px; }
      .hero-form button { width: 100%; }
    }

    /* ===== Social proof / testimonials ===== */
    .proof { background: #fff; padding: 72px 0; border-bottom: 1px solid var(--border); }
    .proof-head { text-align: center; margin-bottom: 40px; }
    .proof-eyebrow {
      display: inline-block; font-size: 12px; font-weight: 700;
      color: var(--text-faint); text-transform: uppercase;
      letter-spacing: 0.16em; margin-bottom: 8px;
    }
    .proof-stats {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
      max-width: 900px; margin: 0 auto 56px;
      padding: 28px 32px;
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }
    .proof-stat { text-align: center; }
    .proof-stat-num {
      font-size: clamp(28px, 3vw, 38px); font-weight: 800;
      color: var(--navy); letter-spacing: -0.02em; line-height: 1;
    }
    .proof-stat-label {
      font-size: 12px; color: var(--text-muted); font-weight: 500;
      margin-top: 6px;
    }
    .testimonial-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
      max-width: 1100px; margin: 0 auto;
    }
    .testimonial {
      background: #fff; border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px;
      display: flex; flex-direction: column;
      box-shadow: var(--shadow-sm);
    }
    .testimonial-stars {
      display: flex; gap: 2px; color: var(--gold);
      margin-bottom: 14px; font-size: 14px;
    }
    .testimonial-quote {
      font-size: 15px; line-height: 1.6; color: var(--text);
      font-weight: 500; margin-bottom: 18px; flex: 1;
    }
    .testimonial-quote strong {
      background: linear-gradient(180deg, transparent 60%, rgba(30,169,124,0.25) 60%);
      font-weight: 700;
    }
    .testimonial-foot { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border); }
    .testimonial-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--navy), var(--blue));
      color: #fff; font-weight: 700; font-size: 15px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .testimonial-foot-text { font-size: 13px; line-height: 1.3; }
    .testimonial-foot-text strong { display: block; color: var(--text); font-weight: 700; }
    .testimonial-foot-text span { color: var(--text-muted); }
    .testimonial.featured { border: 2px solid var(--blue); box-shadow: 0 12px 40px rgba(18,81,173,0.12); }
    .testimonial-case-badge {
      display: inline-block; background: var(--blue-pale); color: var(--blue);
      font-size: 10px; font-weight: 800; padding: 4px 10px;
      border-radius: 100px; letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 12px;
    }
    .testimonial-metrics {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
      margin: 14px 0 18px;
      padding: 14px; background: var(--surface-alt);
      border-radius: 10px;
    }
    .testimonial-metric { text-align: center; }
    .testimonial-metric-num { font-size: 18px; font-weight: 800; color: var(--navy); line-height: 1; }
    .testimonial-metric-label { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    @media (max-width: 860px) {
      .proof-stats { grid-template-columns: repeat(2, 1fr); }
      .testimonial-grid { grid-template-columns: 1fr; }
    }

    /* ===== Time Back anchor section ===== */
    .time-back {
      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy) 100%);
      color: #fff;
    }
    .time-back h2 { color: #fff; }
    .time-back .lead { color: rgba(255,255,255,0.75); }
    .time-back .section-head p { color: rgba(255,255,255,0.75); }
    .time-back-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      margin-bottom: 56px;
    }
    .time-back-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius);
      padding: 20px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .time-back-card-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: rgba(255,73,152,0.15); color: var(--pink);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .time-back-card-icon svg { width: 18px; height: 18px; }
    .time-back-card-text {
      flex: 1; font-size: 14px; font-weight: 500;
      color: rgba(255,255,255,0.9);
    }
    .time-back-card-hours {
      font-size: 12px; font-weight: 700;
      color: var(--green); background: rgba(30,169,124,0.15);
      padding: 4px 10px; border-radius: 100px;
      white-space: nowrap;
    }
    .time-back-total {
      text-align: center; padding: 48px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-xl);
      max-width: 760px; margin: 0 auto;
    }
    .time-back-total-label {
      font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.65);
      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;
    }
    .time-back-total-number {
      font-weight: 900;
      letter-spacing: -0.04em; line-height: 1;
      margin-bottom: 12px;
      display: flex; align-items: baseline; justify-content: center; gap: 10px;
    }
    .time-back-total-number .num {
      font-size: clamp(64px, 10vw, 120px);
      background: linear-gradient(180deg, #fff 0%, var(--pink) 200%);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .time-back-total-number .unit {
      font-size: clamp(20px, 2.4vw, 30px);
      font-weight: 700; color: rgba(255,255,255,0.85);
      letter-spacing: 0;
    }
    .time-back-total-sub {
      font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 24px;
    }
    .time-back-total-sub strong { color: var(--pink); font-weight: 700; }
    @media (max-width: 860px) { .time-back-grid { grid-template-columns: 1fr; } }

    /* ===== Problem (Stop doing X) ===== */
    .problem {
      background: var(--surface-alt);
    }
    .problem-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
      max-width: 900px; margin: 0 auto;
    }
    .problem-item {
      display: flex; align-items: center; gap: 16px;
      background: #fff; padding: 20px;
      border: 1px solid var(--border); border-radius: var(--radius);
    }
    .problem-x {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(214,69,69,0.12); color: var(--red);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .problem-x svg { width: 18px; height: 18px; }
    .problem-item-text { font-size: 16px; font-weight: 600; color: var(--text); }
    @media (max-width: 720px) { .problem-grid { grid-template-columns: 1fr; } }

    /* ===== Portfolios ===== */
    .portfolios { background: #fff; }
    .portfolio-tabs {
      display: flex; justify-content: center; gap: 8px;
      flex-wrap: wrap; margin-bottom: 48px;
    }
    .portfolio-tab {
      padding: 10px 20px; border-radius: 100px;
      border: 1.5px solid var(--border);
      background: #fff; color: var(--text);
      font-weight: 600; font-size: 14px;
      transition: all .2s ease;
    }
    .portfolio-tab:hover { border-color: var(--blue); color: var(--blue); }
    .portfolio-tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }
    .portfolio-panel { display: none; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
    .portfolio-panel.active { display: grid; }
    .portfolio-panel h3 { font-size: 28px; margin-bottom: 12px; }
    .portfolio-panel p { font-size: 16px; margin-bottom: 20px; }
    .portfolio-panel ul { list-style: none; padding: 0; margin-bottom: 24px; }
    .portfolio-panel li {
      display: flex; gap: 10px; align-items: flex-start;
      padding: 6px 0; font-size: 14px; color: var(--text);
    }
    .portfolio-panel li svg { width: 18px; height: 18px; color: var(--green); flex-shrink: 0; margin-top: 2px; }
    .portfolio-visual {
      aspect-ratio: 4/3; border-radius: var(--radius-lg);
      background: linear-gradient(135deg, var(--blue-pale), #fff);
      border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
      color: var(--blue); font-weight: 600;
    }
    .portfolio-visual svg { width: 80px; height: 80px; opacity: 0.3; }
    @media (max-width: 860px) { .portfolio-panel.active { grid-template-columns: 1fr; } }

    /* ===== Tenant view section ===== */
    .tenant-view { background: var(--surface-alt); }
    .tenant-view-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    }
    .tenant-view-copy h2 { margin-bottom: 16px; }
    .tenant-view-copy p { font-size: 17px; margin-bottom: 24px; max-width: 480px; }
    .tenant-view-list { list-style: none; padding: 0; margin-bottom: 28px; }
    .tenant-view-list li {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 10px 0; font-size: 15px; color: var(--text); font-weight: 500;
    }
    .tenant-view-list li svg { width: 20px; height: 20px; color: var(--green); flex-shrink: 0; margin-top: 2px; }
    .tenant-view-quote {
      background: #fff; border-left: 4px solid var(--pink);
      padding: 16px 20px; border-radius: 0 10px 10px 0;
      font-size: 14px; color: var(--text-muted); font-style: italic;
    }
    .tenant-view-quote strong { color: var(--text); font-style: normal; font-weight: 700; }
    .tenant-screens {
      position: relative; display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      gap: 18px; min-height: 480px;
    }
    .tenant-screen-phone {
      background: #1a1f36; border-radius: 36px; padding: 10px;
      box-shadow: 0 30px 80px rgba(26,31,54,0.25);
      width: 260px;
    }
    .tenant-screen-inside {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      border-radius: 28px; padding: 26px 20px 20px;
      color: #fff; position: relative; overflow: hidden;
    }
    .tenant-screen-inside::before {
      content: ""; position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
      width: 80px; height: 18px; background: #1a1f36; border-radius: 12px;
    }
    .ts-header { text-align: center; margin-top: 14px; margin-bottom: 22px; }
    .ts-logo {
      width: 40px; height: 40px; margin: 0 auto 10px;
      background: var(--pink); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; color: #fff;
    }
    .ts-brand { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
    .ts-card {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px; padding: 16px; margin-bottom: 12px;
    }
    .ts-card-head { font-size: 11px; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 6px; }
    .ts-card-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
    .ts-card-sub { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px; }
    .ts-btn {
      display: block; width: 100%; text-align: center;
      background: var(--pink); color: #fff;
      padding: 12px; border-radius: 100px;
      font-size: 13px; font-weight: 700;
      margin-top: 10px;
    }
    .ts-list li {
      display: flex; justify-content: space-between;
      font-size: 12px; padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      list-style: none;
    }
    .ts-list li:last-child { border-bottom: none; }
    .ts-list li span:first-child { color: rgba(255,255,255,0.7); }
    .ts-list li strong { color: #fff; font-weight: 700; }
    .ts-footer {
      text-align: center; font-size: 10px;
      color: rgba(255,255,255,0.55); margin-top: 14px;
      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;
    }
    .tenant-screen-tag {
      background: #fff; padding: 8px 14px; border-radius: 100px;
      box-shadow: var(--shadow);
      font-size: 12px; font-weight: 700; color: var(--text);
      display: inline-flex; align-items: center; gap: 6px;
    }
    .tenant-screen-tag svg { width: 14px; height: 14px; color: var(--green); }
    @media (max-width: 860px) {
      .tenant-view-grid { grid-template-columns: 1fr; gap: 32px; }
    }

    /* ===== NEW features ===== */
    .new-features {
      background: linear-gradient(180deg, #fff 0%, var(--surface-alt) 100%);
    }
    .new-features-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }
    .new-feature-card {
      background: #fff; border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px;
      transition: all .2s ease;
    }
    .new-feature-card:hover {
      transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--blue);
    }
    .new-feature-visual {
      aspect-ratio: 16/10; border-radius: var(--radius);
      background: linear-gradient(135deg, var(--navy), var(--blue));
      margin-bottom: 20px; display: flex; align-items: center; justify-content: center;
    }
    .new-feature-visual svg { width: 64px; height: 64px; color: rgba(255,255,255,0.9); }
    .new-feature-card h3 { margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .new-feature-card p { font-size: 14px; margin-bottom: 16px; }
    @media (max-width: 860px) { .new-features-grid { grid-template-columns: 1fr; } }

    /* ===== Feature rows ===== */
    .feature-rows { background: #fff; }
    .feature-rows .section-head { margin-bottom: 80px; }
    .feature-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center;
      margin-bottom: 96px;
    }
    .feature-row:last-child { margin-bottom: 0; }
    .feature-row.reverse .feature-row-copy { order: 2; }
    .feature-row.reverse .feature-row-visual { order: 1; }
    .feature-row h3 { font-size: 32px; margin-bottom: 14px; letter-spacing: -0.025em; }
    .feature-row p { font-size: 16px; margin-bottom: 24px; max-width: 480px; }
    .feature-row ul { list-style: none; padding: 0; margin-bottom: 28px; }
    .feature-row li {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 8px 0; font-size: 15px; color: var(--text); font-weight: 500;
    }
    .feature-row li svg { width: 20px; height: 20px; color: var(--green); flex-shrink: 0; margin-top: 1px; }
    .feature-row-visual {
      aspect-ratio: 4/3; border-radius: var(--radius-lg);
      background: var(--surface-alt); border: 1px solid var(--border);
      box-shadow: var(--shadow); padding: 24px; position: relative;
    }
    .fv-header { display: flex; gap: 6px; margin-bottom: 18px; }
    .fv-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); }
    .fv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .fv-card {
      background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 12px;
    }
    .fv-card-label { font-size: 10px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
    .fv-card-val { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    .fv-card-sub { font-size: 11px; color: var(--green); font-weight: 600; margin-top: 2px; }
    .fv-chart {
      margin-top: 14px; padding: 14px; background: #fff;
      border: 1px solid var(--border); border-radius: 8px;
      display: flex; align-items: flex-end; gap: 6px; height: 120px;
    }
    .fv-bar { flex: 1; background: var(--blue); border-radius: 4px 4px 0 0; }
    @media (max-width: 860px) {
      .feature-row { grid-template-columns: 1fr; gap: 32px; margin-bottom: 64px; }
      .feature-row.reverse .feature-row-copy { order: 1; }
      .feature-row.reverse .feature-row-visual { order: 2; }
    }

    /* ===== Founder story ===== */
    .founder-story {
      background: var(--navy);
      color: #fff;
      padding: 96px 0;
    }
    .founder-story-inner {
      max-width: 820px; margin: 0 auto; text-align: center;
    }
    .founder-story h2 { color: #fff; margin-bottom: 28px; }
    .founder-story-avatar {
      width: 96px; height: 96px; border-radius: 50%;
      background: linear-gradient(135deg, var(--pink), var(--gold));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 800; font-size: 32px;
      margin: 0 auto 24px;
      border: 4px solid rgba(255,255,255,0.1);
    }
    .founder-story p {
      color: rgba(255,255,255,0.85);
      font-size: 18px; line-height: 1.7;
      margin-bottom: 18px;
    }
    .founder-story-sig {
      margin-top: 32px; font-size: 16px;
      color: rgba(255,255,255,0.65);
    }
    .founder-story-sig strong { color: #fff; }

    /* ===== Guarantee ===== */
    .guarantee {
      background: linear-gradient(180deg, #fff 0%, var(--surface-alt) 100%);
    }
    .guarantee-card {
      max-width: 820px; margin: 0 auto; background: #fff;
      border: 1px solid var(--border); border-radius: var(--radius-xl);
      padding: 56px 48px; text-align: center;
      box-shadow: var(--shadow-lg);
      position: relative; overflow: hidden;
    }
    .guarantee-card::before {
      content: ""; position: absolute; top: 0; left: 0; right: 0;
      height: 6px; background: linear-gradient(90deg, var(--blue), var(--pink));
    }
    .guarantee-icon {
      width: 72px; height: 72px; margin: 0 auto 24px;
      background: var(--blue-pale); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--blue);
    }
    .guarantee-icon svg { width: 36px; height: 36px; }
    .guarantee h2 { margin-bottom: 16px; }
    .guarantee-lead { font-size: 20px; color: var(--text); margin-bottom: 16px; font-weight: 600; }
    .guarantee-body { font-size: 16px; color: var(--text-muted); max-width: 660px; margin: 0 auto 28px; line-height: 1.65; }
    .guarantee-highlight {
      display: inline-block;
      font-weight: 700;
      color: var(--text);
      padding: 0 6px 3px;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r3'><feTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='2' seed='11'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23F5A623' fill-opacity='0.5' filter='url(%23r3)'/></svg>");
      background-repeat: no-repeat;
      background-position: 0 60%;
      background-size: 100% 65%;
    }
    .guarantee-stack {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      max-width: 640px; margin: 0 auto;
    }
    .guarantee-stack-item {
      padding: 14px;
      text-align: center;
      background: var(--surface-alt);
      border-radius: var(--radius);
    }
    .guarantee-stack-item strong {
      display: block; color: var(--blue); font-size: 18px; font-weight: 800;
    }
    .guarantee-stack-item span {
      font-size: 12px; color: var(--text-muted);
    }
    @media (max-width: 640px) { .guarantee-stack { grid-template-columns: 1fr; } }

    /* ===== 90 days timeline ===== */
    .timeline {
      background: #fff;
    }
    .timeline-grid {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px;
      position: relative;
    }
    .timeline-grid::before {
      content: ""; position: absolute; top: 40px; left: 10%; right: 10%;
      height: 2px; background: linear-gradient(90deg, var(--blue), var(--pink));
      z-index: 0;
    }
    .timeline-item {
      position: relative; z-index: 1;
      text-align: center; padding: 0 8px;
    }
    .timeline-marker {
      width: 80px; height: 80px; margin: 0 auto 20px;
      background: #fff; border: 3px solid var(--blue);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--blue); font-weight: 800; font-size: 13px;
      text-align: center; line-height: 1.1;
      box-shadow: 0 0 0 6px rgba(18,81,173,0.06);
    }
    .timeline-item:last-child .timeline-marker {
      border-color: var(--pink); color: var(--pink);
      box-shadow: 0 0 0 6px rgba(255,73,152,0.1);
    }
    .timeline-item h4 {
      font-size: 15px; color: var(--navy);
      margin-bottom: 8px; font-weight: 700;
    }
    .timeline-item p {
      font-size: 13px; line-height: 1.5;
      color: var(--text-muted);
    }
    @media (max-width: 860px) {
      .timeline-grid { grid-template-columns: 1fr; gap: 40px; }
      .timeline-grid::before { display: none; }
      .timeline-item { border-left: 2px solid var(--blue); padding-left: 24px; text-align: left; }
      .timeline-marker { margin: 0 0 12px 0; }
    }

    /* ===== Math / Anchor ===== */
    .math { background: #fff; }
    .math-compare {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      max-width: 960px; margin: 0 auto 40px;
    }
    .math-col {
      border-radius: var(--radius-xl); padding: 36px 32px;
      display: flex; flex-direction: column;
    }
    .math-col-before {
      background: var(--surface-alt);
      border: 1px solid var(--border);
    }
    .math-col-after {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: #fff; position: relative;
      box-shadow: 0 20px 60px rgba(18,81,173,0.2);
    }
    .math-col-after::before {
      content: "WINNER"; position: absolute; top: -12px; right: 24px;
      background: var(--pink); color: #fff; padding: 6px 14px;
      border-radius: 100px; font-size: 11px; font-weight: 800;
      letter-spacing: 0.12em;
    }
    .math-col h3 {
      font-size: 14px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.14em;
      margin-bottom: 20px;
    }
    .math-col-before h3 { color: var(--red); }
    .math-col-after h3 { color: var(--pink); }
    .math-col ul {
      list-style: none; padding: 0; flex: 1;
      display: flex; flex-direction: column; gap: 10px;
      margin-bottom: 28px;
    }
    .math-col-before li {
      display: grid; grid-template-columns: 1fr auto; gap: 12px;
      font-size: 14px; color: var(--text-muted);
      padding-bottom: 10px; border-bottom: 1px solid var(--border);
    }
    .math-col-before li:last-child { border-bottom: none; }
    .math-col-before li span:last-child {
      font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums;
    }
    .math-col-after li {
      display: flex; gap: 10px; align-items: flex-start;
      font-size: 14px; color: rgba(255,255,255,0.85);
      padding: 4px 0;
    }
    .math-col-after li svg {
      width: 18px; height: 18px; color: var(--pink); flex-shrink: 0; margin-top: 2px;
    }
    .math-total {
      padding: 20px 0; border-top: 2px solid;
      font-size: 18px; font-weight: 700;
      display: flex; justify-content: space-between; align-items: center;
    }
    .math-col-before .math-total { border-color: var(--red); color: var(--red); }
    .math-col-after .math-total { border-color: rgba(255,255,255,0.2); color: #fff; }
    .math-total-num { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }
    .math-total-num small { font-size: 50%; font-weight: 600; opacity: 0.7; }

    .math-savings {
      text-align: center; max-width: 760px; margin: 0 auto;
      padding: 48px; background: linear-gradient(135deg, rgba(245,166,35,0.08), rgba(255,73,152,0.1));
      border: 1px dashed var(--gold); border-radius: var(--radius-xl);
    }
    .math-savings-label {
      font-size: 13px; font-weight: 700; color: var(--gold);
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 12px;
    }
    .math-savings-number {
      font-size: clamp(64px, 9vw, 112px); font-weight: 900;
      letter-spacing: -0.04em; line-height: 1;
      color: var(--navy); margin-bottom: 12px;
    }
    .math-savings-number small { font-size: 30%; font-weight: 700; color: var(--text-muted); }
    .math-savings-sub {
      font-size: 18px; color: var(--text);
    }
    .math-savings-sub strong {
      color: var(--gold); font-weight: 800; font-size: 22px;
    }
    @media (max-width: 860px) {
      .math-compare { grid-template-columns: 1fr; }
    }

    /* ===== Compare table ===== */
    .compare { background: var(--surface-alt); }
    .compare-wrap {
      max-width: 1000px; margin: 0 auto;
      background: #fff; border-radius: var(--radius-xl);
      border: 1px solid var(--border); overflow: hidden;
      box-shadow: var(--shadow);
    }
    .compare-table {
      width: 100%; border-collapse: collapse;
      font-size: 14px;
    }
    .compare-table thead th {
      padding: 20px 16px; text-align: center;
      font-size: 13px; font-weight: 700;
      background: var(--surface-alt);
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .compare-table thead th:first-child {
      text-align: left; color: var(--text-faint);
    }
    .compare-table thead th.us {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: #fff; position: relative;
    }
    .compare-table thead th.us::after {
      content: "BEST VALUE"; position: absolute; top: 6px; left: 50%;
      transform: translateX(-50%); font-size: 9px; color: var(--pink);
      letter-spacing: 0.14em; font-weight: 800;
    }
    .compare-table tbody td {
      padding: 14px 16px; text-align: center;
      border-bottom: 1px solid var(--border);
      color: var(--text);
    }
    .compare-table tbody td:first-child {
      text-align: left; color: var(--text);
      font-weight: 600;
    }
    .compare-table tbody tr:last-child td { border-bottom: none; }
    .compare-table .yes { color: var(--green); font-weight: 700; }
    .compare-table .no { color: var(--red); opacity: 0.6; }
    .compare-table .us-col { background: rgba(18,81,173,0.03); }
    .compare-table tfoot td {
      padding: 18px 16px; background: var(--surface-alt);
      font-weight: 700; font-size: 15px;
      text-align: center; color: var(--text);
    }
    .compare-table tfoot td:first-child { text-align: left; color: var(--text-faint); text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
    .compare-table tfoot td.us-price { background: var(--navy); color: #fff; font-size: 20px; letter-spacing: -0.02em; }
    @media (max-width: 720px) {
      .compare-table { font-size: 12px; }
      .compare-table thead th, .compare-table tbody td, .compare-table tfoot td { padding: 10px 8px; }
    }

    /* ===== Pricing ===== */
    .pricing { background: var(--surface-alt); }
    .price-toggle {
      display: inline-flex; background: #fff;
      border: 1px solid var(--border); border-radius: 100px;
      padding: 4px; margin-bottom: 16px;
    }
    .price-toggle button {
      padding: 10px 24px; border-radius: 100px;
      font-size: 14px; font-weight: 600; color: var(--text-muted);
      transition: all .2s ease;
    }
    .price-toggle button.active { background: var(--navy); color: #fff; }
    .price-save-badge {
      display: inline-block; background: var(--pink-bg); color: var(--pink);
      padding: 4px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-left: 10px; vertical-align: middle;
    }
    .price-controls { text-align: center; margin-bottom: 48px; }
    .pricing-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
      align-items: stretch;
    }
    .price-card {
      background: #fff; border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 28px 22px;
      position: relative; display: flex; flex-direction: column;
    }
    .price-card.featured {
      border: 2px solid var(--blue);
      box-shadow: 0 24px 60px rgba(18,81,173,0.18);
      transform: translateY(-8px);
    }
    .price-card.enterprise {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .price-card.enterprise .price-name { color: var(--gold); }
    .price-card.enterprise .price-tag .amt { color: #fff; }
    .price-card.enterprise .price-tag .per { color: rgba(255,255,255,0.7); }
    .price-card.enterprise .price-anchor,
    .price-card.enterprise .price-tagline,
    .price-card.enterprise .price-billing { color: rgba(255,255,255,0.75); }
    .price-card.enterprise .price-features-head { color: rgba(255,255,255,0.55); }
    .price-card.enterprise .price-features li { color: rgba(255,255,255,0.92); }
    .price-card.enterprise .price-features li strong { color: var(--gold); }
    .price-card.enterprise .price-features li svg { color: var(--gold); }
    .price-badge {
      position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
      background: var(--blue); color: #fff; padding: 7px 16px;
      border-radius: 100px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .price-name {
      font-size: 13px; font-weight: 700; color: var(--navy);
      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;
    }
    .price-tag { margin-bottom: 8px; display: flex; align-items: baseline; gap: 6px; }
    .price-tag .amt { font-size: 42px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1; }
    .price-tag .per { font-size: 15px; color: var(--text-muted); font-weight: 500; }
    .price-anchor { font-size: 13px; color: var(--text-faint); margin-bottom: 8px; }
    .price-anchor strike { color: var(--text-faint); }
    .price-anchor strong { color: var(--gold); font-weight: 700; }
    .price-billing {
      font-size: 12px; color: var(--text-faint);
      margin-bottom: 8px; min-height: 18px;
      font-weight: 500;
    }
    .price-billing strong { color: var(--green); font-weight: 700; }
    .billing-monthly { display: none; }
    body.yearly .billing-yearly { display: inline; }
    body.yearly .billing-monthly { display: none; }
    body.monthly .billing-monthly { display: inline; }
    body.monthly .billing-yearly { display: none; }
    .price-was {
      display: block;
      font-size: 13px; color: var(--text-faint);
      font-weight: 500;
      margin-bottom: 2px;
      text-decoration: line-through;
      line-height: 1;
    }
    .price-tagline { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; min-height: 40px; }
    .price-cta { margin-bottom: 28px; }
    .price-cta .btn { width: 100%; }
    .price-features-head {
      font-size: 12px; font-weight: 700; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;
    }
    .price-features {
      list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;
    }
    .price-features li {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 14px; color: var(--text);
    }
    .price-features li svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; margin-top: 3px; }
    .price-features li strong { font-weight: 700; color: var(--navy); }

    .price-bonus {
      margin-top: 24px; padding: 20px;
      background: linear-gradient(135deg, rgba(245,166,35,0.08), rgba(255,73,152,0.08));
      border: 1px dashed var(--gold); border-radius: var(--radius);
    }
    .price-bonus-head {
      font-size: 11px; font-weight: 800; color: var(--gold);
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px;
    }
    .price-bonus ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
    .price-bonus li {
      display: grid; grid-template-columns: 1fr auto; gap: 10px;
      font-size: 13px; color: var(--text); align-items: start;
    }
    .price-bonus li strong { color: var(--text); font-weight: 600; }
    .price-bonus li em {
      font-style: normal; color: var(--gold); font-weight: 700;
      font-size: 12px; white-space: nowrap;
    }
    .price-bonus-total {
      margin-top: 14px; padding-top: 14px;
      border-top: 1px dashed rgba(245,166,35,0.4);
      display: flex; justify-content: space-between; font-size: 14px;
    }
    .price-bonus-total strong { color: var(--gold); font-weight: 800; font-size: 16px; }

    .price-enterprise {
      margin-top: 48px;
      background: var(--navy-dark); color: #fff;
      border-radius: var(--radius-xl); padding: 40px 48px;
      display: flex; align-items: center; justify-content: space-between; gap: 24px;
    }
    .price-enterprise h3 { color: #fff; margin-bottom: 6px; }
    .price-enterprise p { color: rgba(255,255,255,0.7); }
    @media (max-width: 960px) {
      .pricing-grid { grid-template-columns: 1fr; }
      .price-card.featured { transform: none; }
      .price-enterprise { flex-direction: column; text-align: center; }
    }
    @media (min-width: 700px) and (max-width: 1100px) {
      .pricing-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    }

    /* ===== Support ===== */
    .support { background: #fff; }
    .support-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
      margin-bottom: 48px;
    }
    .support-item {
      text-align: center; padding: 24px;
      background: var(--surface-alt); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .support-item-icon {
      width: 48px; height: 48px; margin: 0 auto 16px;
      background: var(--blue-pale); color: var(--blue);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
    }
    .support-item-icon svg { width: 24px; height: 24px; }
    .support-item h4 { margin-bottom: 6px; font-weight: 600; font-size: 16px; }
    .support-item p { font-size: 13px; }
    @media (max-width: 860px) { .support-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 520px) { .support-grid { grid-template-columns: 1fr; } }

    /* ===== FAQ ===== */
    .faq { background: var(--surface-alt); }
    .faq-tabs {
      display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; flex-wrap: wrap;
    }
    .faq-tab {
      padding: 10px 20px; border-radius: 100px;
      border: 1.5px solid var(--border); background: #fff;
      color: var(--text); font-weight: 600; font-size: 14px;
      transition: all .2s ease;
    }
    .faq-tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }
    .faq-tab:not(.active):hover { border-color: var(--blue); color: var(--blue); }
    .faq-panel { display: none; max-width: 820px; margin: 0 auto; }
    .faq-panel.active { display: block; }
    .faq-item {
      border-bottom: 1px solid var(--border); padding: 20px 0;
    }
    .faq-q {
      display: flex; justify-content: space-between; align-items: center;
      cursor: pointer; list-style: none;
      font-weight: 600; font-size: 17px; color: var(--text);
    }
    .faq-q::-webkit-details-marker { display: none; }
    .faq-icon {
      width: 24px; height: 24px; flex-shrink: 0;
      transition: transform .2s ease; color: var(--blue);
    }
    details[open] .faq-icon { transform: rotate(45deg); }
    .faq-a { margin-top: 12px; color: var(--text-muted); font-size: 15px; line-height: 1.65; }
    .faq-a strong { color: var(--text); }

    /* ===== Lead magnet ===== */
    .lead-magnet {
      background: #fff;
      padding: 88px 0;
    }
    .lead-magnet-card {
      max-width: 920px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 280px; gap: 48px;
      align-items: center;
      padding: 48px;
      background: linear-gradient(135deg, var(--blue-pale) 0%, #fff 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
    }
    .lead-magnet-tag {
      display: inline-block; font-size: 11px; font-weight: 800;
      color: var(--pink); letter-spacing: 0.14em;
      text-transform: uppercase; margin-bottom: 10px;
    }
    .lead-magnet h2 { font-size: 28px; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; }
    .lead-magnet p { font-size: 15px; margin-bottom: 20px; }
    .lead-magnet-form { display: flex; gap: 8px; max-width: 460px; background: #fff; padding: 6px; border-radius: 100px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
    .lead-magnet-form input { flex: 1; border: none; outline: none; padding: 10px 18px; font-size: 14px; background: transparent; }
    .lead-magnet-form button { background: var(--navy); color: #fff; padding: 10px 20px; border-radius: 100px; font-weight: 600; font-size: 13px; }
    .lead-magnet-visual {
      aspect-ratio: 3/4;
      background: #fff;
      border-radius: 10px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 50px rgba(26,31,54,0.15);
      padding: 20px;
      display: flex; flex-direction: column;
      transform: rotate(-3deg);
      position: relative;
    }
    .lead-magnet-visual::before {
      content: "PDF"; position: absolute; top: 12px; right: 12px;
      background: var(--pink); color: #fff; font-size: 9px;
      padding: 3px 7px; border-radius: 4px;
      font-weight: 800; letter-spacing: 0.1em;
    }
    .lmv-head {
      font-size: 9px; font-weight: 700; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;
    }
    .lmv-title { font-size: 15px; font-weight: 800; color: var(--navy); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.01em; }
    .lmv-rows {
      display: flex; flex-direction: column; gap: 6px;
      flex: 1;
    }
    .lmv-row {
      display: flex; justify-content: space-between;
      font-size: 10px; padding: 6px 0;
      border-bottom: 1px dashed var(--border);
    }
    .lmv-row span:first-child { color: var(--text-muted); }
    .lmv-row strong { color: var(--text); font-weight: 700; }
    .lmv-foot { margin-top: 10px; padding-top: 8px; border-top: 2px solid var(--navy); display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: var(--navy); }
    @media (max-width: 720px) {
      .lead-magnet-card { grid-template-columns: 1fr; padding: 32px 24px; }
      .lead-magnet-visual { max-width: 220px; margin: 0 auto; }
    }

    /* ===== Final CTA ===== */
    .final-cta {
      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: #fff;
      text-align: center; padding: 110px 0;
    }
    .final-cta h2 { color: #fff; max-width: 820px; margin: 0 auto 18px; }
    .final-cta h2 u {
      text-decoration: none;
      display: inline-block;
      padding: 0 6px 4px;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r2'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='2' seed='7'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23FF4998' fill-opacity='0.55' filter='url(%23r2)'/></svg>");
      background-repeat: no-repeat;
      background-position: 0 55%;
      background-size: 100% 60%;
    }
    .final-cta .lead { color: rgba(255,255,255,0.8); max-width: 620px; margin: 0 auto 36px; }
    .final-cta-form {
      display: flex; gap: 8px; max-width: 520px; margin: 0 auto 24px;
      background: #fff; padding: 6px; border-radius: 100px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .final-cta-form input {
      flex: 1; border: none; outline: none;
      padding: 12px 20px; font-size: 15px; color: var(--text);
      background: transparent; min-width: 0;
    }
    .final-cta-form button {
      background: var(--blue); color: #fff;
      padding: 12px 24px; border-radius: 100px;
      font-weight: 600; font-size: 14px;
    }
    .final-cta-chips {
      display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;
      margin-top: 20px;
    }
    .final-cta-chip {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 13px; color: rgba(255,255,255,0.8);
    }
    .final-cta-chip svg { width: 16px; height: 16px; color: var(--pink); }
    @media (max-width: 520px) {
      .final-cta-form { flex-direction: column; padding: 12px; border-radius: 16px; }
      .final-cta-form input { text-align: center; }
      .final-cta-form button { width: 100%; }
    }

    /* ===== Footer ===== */
    .footer {
      background: var(--navy-dark); color: rgba(255,255,255,0.65);
      padding: 64px 0 32px; font-size: 14px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr repeat(4, 1fr);
      gap: 40px; margin-bottom: 48px;
    }
    .footer-brand .logo { color: #fff; margin-bottom: 16px; }
    .footer-brand .logo-mark { background: #fff; }
    .footer-brand .logo-mark svg { color: var(--navy); }
    .footer-brand p { color: rgba(255,255,255,0.55); max-width: 320px; margin-bottom: 16px; font-size: 14px; }
    .footer-col h4 { color: #fff; font-size: 14px; margin-bottom: 16px; font-weight: 700; }
    .footer-col ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
    .footer-col a:hover { color: #fff; }
    .footer-bottom {
      padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08);
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 16px;
      color: rgba(255,255,255,0.4); font-size: 13px;
    }
    .footer-legal { display: flex; gap: 20px; flex-wrap: wrap; }
    @media (max-width: 960px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .footer-brand { grid-column: 1 / -1; }
    }`;

const MOCK_HTML = `<!-- TOP UTILITY -->
  <div class="top-bar">
    <strong>Founder pricing closes April 30 · 87 of 100 spots left:</strong>
    Lock Pro at $97/mo for life.
    <a href="#pricing">See the offer</a>
  </div>

  <!-- NAV -->
  <nav class="nav">
    <div class="wrap nav-inner">
      <a href="#" class="logo">
        <span class="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
        </span>
        Tenantory
      </a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="tools.html">Free tools</a>
        <a href="stories.html">Stories</a>
        <a href="pricing.html">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
      <div class="nav-cta">
        <a href="onboarding.html" style="font-size: 14px; color: var(--text); font-weight: 500;">Sign in</a>
        <a href="#hero-form" class="btn btn-primary" style="padding: 10px 20px;">Get my time back</a>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="wrap">
      <div class="hero-grid">
        <div>
          <span class="eyebrow">The Founders' Offer · 87 spots left</span>
          <h1>Run <em>30 doors</em> with the admin work of <u>5</u> — in 14 days, or we pay you <em>$100.</em></h1>
          <p class="lead">Tenantory replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper — and gives you back <strong style="color: var(--text);">12 hours a week.</strong> All on your own brand, for $97/mo.</p>
          <form id="hero-form" class="hero-form" onsubmit="event.preventDefault(); const e = encodeURIComponent(this.querySelector('input').value || ''); window.location.href = 'onboarding.html' + (e ? '?email=' + e : '');">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Get my time back</button>
          </form>
          <p class="hero-microcopy">14-day free trial. <strong>No credit card required.</strong> We import your data free. Live in 15 minutes.</p>
          <p class="hero-microcopy" style="margin-top:8px;">
            See examples on a branded subdomain:
            <a href="listings.html" target="_blank" style="color:var(--blue); font-weight:600; text-decoration:underline;">listings</a>
            ·
            <a href="apply.html" target="_blank" style="color:var(--blue); font-weight:600; text-decoration:underline;">apply</a>
            ·
            <a href="sign.html" target="_blank" style="color:var(--blue); font-weight:600; text-decoration:underline;">sign lease</a>
            ·
            <a href="portal.html" target="_blank" style="color:var(--blue); font-weight:600; text-decoration:underline;">tenant portal</a>
          </p>

          <div class="founder-block">
            <div class="founder-avatar">HC</div>
            <div class="founder-text">
              Built by <strong>Harrison Cooper</strong>, Alabama co-living operator running 15+ rooms.
              Tenantory is the software I wish existed when I started. Not built by a VC. Built by an operator.
            </div>
          </div>
        </div>

        <div class="device-stack">
          <!-- Desktop browser frame -->
          <div class="device-desktop">
            <div class="device-desktop-bar">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span class="device-desktop-url">yourcompany.tenantory.app</span>
            </div>
            <div class="device-desktop-body">
              <div class="dd-stats">
                <div class="dd-stat"><div class="dd-stat-label">Collected</div><div class="dd-stat-val">$24,850</div><div class="dd-stat-delta">+12% MoM</div></div>
                <div class="dd-stat"><div class="dd-stat-label">Occupancy</div><div class="dd-stat-val">96%</div><div class="dd-stat-delta">22 / 23</div></div>
                <div class="dd-stat"><div class="dd-stat-label">Time saved</div><div class="dd-stat-val">13h</div><div class="dd-stat-delta">this week</div></div>
              </div>
              <div class="dd-rows">
                <div class="dd-row dd-row-head"><span>Tenant</span><span>Due</span><span>Status</span></div>
                <div class="dd-row"><span>Tenant · Room A</span><span>Apr 1</span><span class="pill pill-green">Paid</span></div>
                <div class="dd-row"><span>Tenant · Room B</span><span>Apr 1</span><span class="pill pill-green">Autopay</span></div>
                <div class="dd-row"><span>Tenant · Room C</span><span>Apr 1</span><span class="pill pill-red">2d late</span></div>
                <div class="dd-row"><span>Tenant · Room D</span><span>Apr 1</span><span class="pill pill-green">Paid</span></div>
              </div>
            </div>
          </div>

          <!-- Floating phone frame -->
          <div class="device-phone">
            <div class="device-phone-screen">
              <div class="device-phone-notch"></div>
              <div class="dp-brand-top">Your Property Co.</div>
              <div class="dp-welcome">Hi, Alex 👋</div>
              <div class="dp-card">
                <div class="dp-card-label">Rent due Apr 1</div>
                <div class="dp-card-val">$1,200</div>
                <div class="dp-card-sub">Autopay on · no action needed</div>
                <a href="#" class="dp-btn">Pay now</a>
              </div>
              <div class="dp-card" style="padding: 12px 14px;">
                <div class="dp-row"><span>Maintenance</span><strong>Open · 1</strong></div>
                <div class="dp-row"><span>Lease ends</span><strong>Aug 15</strong></div>
                <div class="dp-row"><span>Balance</span><strong>$0.00</strong></div>
              </div>
              <div class="dp-brand">yourcompany.com</div>
            </div>
          </div>

          <!-- Floating overlay badge -->
          <div class="device-overlay">
            <div class="device-overlay-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="device-overlay-text">
              <strong>48 hrs/mo</strong>
              <span>back in your life</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SOCIAL PROOF / TESTIMONIALS -->
  <section class="proof">
    <div class="wrap">
      <div class="proof-head">
        <span class="proof-eyebrow">Real operators. Real results.</span>
        <h2 style="font-size: clamp(26px, 3vw, 36px);">The proof is in the portfolios.</h2>
      </div>

      <!-- Aggregate stats (sourced from founder's operation) -->
      <div class="proof-stats">
        <div class="proof-stat">
          <div class="proof-stat-num">15+</div>
          <div class="proof-stat-label">Rooms managed in production</div>
        </div>
        <div class="proof-stat">
          <div class="proof-stat-num">12 hrs</div>
          <div class="proof-stat-label">Returned per week, per operator</div>
        </div>
        <div class="proof-stat">
          <div class="proof-stat-num">94%</div>
          <div class="proof-stat-label">On-time rent (vs. 67% manual)</div>
        </div>
        <div class="proof-stat">
          <div class="proof-stat-num">15 min</div>
          <div class="proof-stat-label">From sign-up to first rent run</div>
        </div>
      </div>

      <div class="testimonial-grid">

        <!-- FEATURED: Real founder case study -->
        <div class="testimonial featured">
          <span class="testimonial-case-badge">Case Study · Co-Living</span>
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-quote">
            "I was stitching AppFolio, QuickBooks, DocuSign, and a bookkeeper together — and still losing <strong>12 hours every week</strong> to admin. Built Tenantory in-house because nothing on the market handled per-room leases. Now I run 15+ rooms on autopilot and my banker gets a rent roll in one click."
          </p>
          <div class="testimonial-metrics">
            <div class="testimonial-metric">
              <div class="testimonial-metric-num">15+</div>
              <div class="testimonial-metric-label">Rooms</div>
            </div>
            <div class="testimonial-metric">
              <div class="testimonial-metric-num">$24.8K</div>
              <div class="testimonial-metric-label">Monthly</div>
            </div>
            <div class="testimonial-metric">
              <div class="testimonial-metric-num">48 hrs</div>
              <div class="testimonial-metric-label">Saved/mo</div>
            </div>
          </div>
          <div class="testimonial-foot">
            <div class="testimonial-avatar">HC</div>
            <div class="testimonial-foot-text">
              <strong>Harrison Cooper</strong>
              <span>Co-living operator · Huntsville, AL</span>
            </div>
          </div>
        </div>

        <!-- REPLACE WITH REAL CUSTOMER TESTIMONIAL -->
        <div class="testimonial">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-quote">
            "Moved off AppFolio in a weekend. My tenants don't even know — the portal has my logo, my colors, my domain. <strong>I look like a 50-unit shop</strong> running 8 doors."
          </p>
          <div class="testimonial-foot">
            <div class="testimonial-avatar" style="background: linear-gradient(135deg, var(--pink), var(--gold));">—</div>
            <div class="testimonial-foot-text">
              <strong>Beta operator · SFR portfolio</strong>
              <span>Public quote coming soon</span>
            </div>
          </div>
        </div>

        <!-- REPLACE WITH REAL CUSTOMER TESTIMONIAL -->
        <div class="testimonial">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-quote">
            "My banker asked for a rent roll Friday at 4pm. I sent it at 4:01. Used to take me <strong>half a Saturday</strong> in Excel."
          </p>
          <div class="testimonial-foot">
            <div class="testimonial-avatar" style="background: linear-gradient(135deg, var(--green), var(--blue));">—</div>
            <div class="testimonial-foot-text">
              <strong>Beta operator · Multifamily</strong>
              <span>Public quote coming soon</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- TIME BACK -->
  <section id="time-back" class="time-back">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow eyebrow-pink">What runs while you sleep</span>
        <h2>Here's what you're getting back.</h2>
        <p class="lead">12 automations. One dashboard. A full work week of your life back every month.</p>
      </div>

      <div class="time-back-grid">

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="time-back-card-text">Automated rent collection with retry</div>
          <div class="time-back-card-hours">2 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          </div>
          <div class="time-back-card-text">Auto-generated rent roll PDFs for your banker</div>
          <div class="time-back-card-hours">1.5 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 14 2 2 4-4"/></svg>
          </div>
          <div class="time-back-card-text">AI lease generation (state-specific)</div>
          <div class="time-back-card-hours">1 hr/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <div class="time-back-card-text">AI application scoring + FCRA-compliant denials</div>
          <div class="time-back-card-hours">1 hr/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          </div>
          <div class="time-back-card-text">Automated late fee processing</div>
          <div class="time-back-card-hours">1 hr/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
          </div>
          <div class="time-back-card-text">Autopay enrollment + retry on failure</div>
          <div class="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/><path d="M9 21V12h6v9"/></svg>
          </div>
          <div class="time-back-card-text">Move-in chain: 5-step automation on lease exec</div>
          <div class="time-back-card-hours">1 hr/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="time-back-card-text">Automated SMS reminders to tenants</div>
          <div class="time-back-card-hours">1.5 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="time-back-card-text">One-click Schedule E + 1099 export</div>
          <div class="time-back-card-hours">1 hr/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/></svg>
          </div>
          <div class="time-back-card-text">A/R aging reports (30/60/90+) auto-updated</div>
          <div class="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>
          </div>
          <div class="time-back-card-text">Lease expiry alerts + renewal prompts (60-90d)</div>
          <div class="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div class="time-back-card">
          <div class="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div class="time-back-card-text">Security deposit reconciliation with state-rule alerts</div>
          <div class="time-back-card-hours">0.5 hrs/wk</div>
        </div>

      </div>

      <div class="time-back-total">
        <div class="time-back-total-label">That's</div>
        <div class="time-back-total-number"><span class="num">48</span><span class="unit">hrs/mo</span></div>
        <div class="time-back-total-sub"><strong>A full workweek back in your life.</strong> Every month. Forever.</div>
        <a href="#pricing" class="btn btn-white btn-lg">Show me the offer
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- PROBLEM -->
  <section class="problem">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">The reality today</span>
        <h2>Stop running your business like it's 2012.</h2>
        <p class="lead">You didn't sign up to be a data-entry clerk. Yet here you are, every week:</p>
      </div>
      <div class="problem-grid">
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Reconciling rent payments by hand in a spreadsheet.</div>
        </div>
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Chasing tenants for late payments, every single month.</div>
        </div>
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Building rent rolls for your banker in Excel.</div>
        </div>
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Re-typing tenant info across AppFolio, QuickBooks, and email.</div>
        </div>
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Losing a Saturday every January to year-end tax prep.</div>
        </div>
        <div class="problem-item">
          <div class="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
          <div class="problem-item-text">Paying a bookkeeper $500/mo to do what software should.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- PORTFOLIOS -->
  <section class="portfolios">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Built for how you operate</span>
        <h2>Your portfolio is unique. Tenantory is built for it.</h2>
        <p class="lead">Whether you run a 4-bedroom co-living house or a 300-unit portfolio, Tenantory scales with your operation. Same software. Different superpowers.</p>
      </div>

      <div class="portfolio-tabs">
        <button class="portfolio-tab active" data-tab="coliving">Co-Living</button>
        <button class="portfolio-tab" data-tab="single">Single-Family</button>
        <button class="portfolio-tab" data-tab="multi">Multifamily</button>
        <button class="portfolio-tab" data-tab="student">Student Housing</button>
      </div>

      <div class="portfolio-panel active" data-panel="coliving">
        <div>
          <h3>Rent-by-the-bedroom, built in</h3>
          <p>Tenantory is one of the only PM platforms designed from day one to handle co-living. Per-room leases, shared utilities, individual rent schedules — without Frankensteining spreadsheets on top of AppFolio.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Per-room lease generation with auto-filled addendums</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Shared utility splits and prorations per tenant</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Room-level photos, pricing, and availability on listings</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Owner-occupied filtering across all reports</li>
          </ul>
        </div>
        <div class="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3z"/><path d="M3 9l9-6 9 6"/><path d="M9 21V12h6v9"/></svg>
        </div>
      </div>

      <div class="portfolio-panel" data-panel="single">
        <div>
          <h3>Single-family built for scale</h3>
          <p>From 5 doors to 500. Manage lease renewals, maintenance, and accounting from one dashboard. Give each tenant a branded portal that feels like they rent directly from you.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> One-click lease renewals with rent escalation</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Per-property P&amp;L and Schedule E exports</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Automated late fees with per-property overrides</li>
          </ul>
        </div>
        <div class="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3z"/><path d="M3 9l9-6 9 6"/></svg>
        </div>
      </div>

      <div class="portfolio-panel" data-panel="multi">
        <div>
          <h3>Multifamily without the overhead</h3>
          <p>Enterprise-grade tools without the enterprise bill. Unit-level accounting, building-wide reporting, tenant portals for every door.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Building and unit-level financial drill-downs</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Bulk lease renewals and rent increases</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Maintenance ticketing with vendor + cost tracking</li>
          </ul>
        </div>
        <div class="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/></svg>
        </div>
      </div>

      <div class="portfolio-panel" data-panel="student">
        <div>
          <h3>Student housing, simplified</h3>
          <p>Per-bedroom leases on academic-year cycles. Parent co-signers. Roommate matching. Tenantory handles the quirks of student housing without bolt-ons.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Academic-year lease terms with automated renewals</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Parent co-signer workflow with e-signature</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Move-out coordination for summer turn</li>
          </ul>
        </div>
        <div class="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5a8 8 0 0 0 12 0v-5"/></svg>
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT YOUR TENANTS SEE -->
  <section class="tenant-view">
    <div class="wrap">
      <div class="tenant-view-grid">
        <div class="tenant-view-copy">
          <span class="eyebrow">What your tenants see</span>
          <h2>Your brand. Your domain. Zero "powered by."</h2>
          <p>Tenants log into a portal at <strong style="color: var(--text);">yourcompany.com</strong> — not tenantory.com. Your logo, your colors, your voice. They pay you, message you, and submit maintenance to you. Tenantory stays invisible.</p>
          <ul class="tenant-view-list">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Custom subdomain + logo + brand color on Pro</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Bring your own domain (CNAME + SSL) on Scale</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Emails sent from <em>you@yourcompany.com</em></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> "Powered by Tenantory" removed on Scale</li>
          </ul>
          <div class="tenant-view-quote">
            "My tenants think I built the software myself. <strong>That's the whole point.</strong>"
            <div style="margin-top: 6px; font-size: 12px; color: var(--text-faint); font-style: normal;">— Harrison Cooper, 15-room co-living operator</div>
          </div>
        </div>

        <div class="tenant-screens">
          <div class="tenant-screen-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            yourcompany.com
          </div>
          <div class="tenant-screen-phone">
            <div class="tenant-screen-inside">
              <div class="ts-header">
                <div class="ts-logo">Y</div>
                <div class="ts-brand">Your Property Co.</div>
              </div>
              <div class="ts-card">
                <div class="ts-card-head">Rent due · Apr 1</div>
                <div class="ts-card-val">$1,200.00</div>
                <div class="ts-card-sub">Autopay on · no action needed</div>
                <a href="#" class="ts-btn">Pay rent</a>
              </div>
              <div class="ts-card" style="padding: 12px 16px;">
                <ul class="ts-list" style="padding: 0; margin: 0;">
                  <li><span>Lease</span><strong>Aug 15, 2026</strong></li>
                  <li><span>Maintenance</span><strong>1 open</strong></li>
                  <li><span>Balance</span><strong>$0.00</strong></li>
                </ul>
              </div>
              <div class="ts-footer">Your Property Co.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- NEW FEATURES -->
  <section class="new-features">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Property management's future starts here</span>
        <h2>Three AI features that save 10+ hours a month.</h2>
      </div>
      <div class="new-features-grid">

        <div class="new-feature-card">
          <div class="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <h3>AI Application Scoring <span class="new-pill">New</span></h3>
          <p>Our AI scores every application on income, credit, background, and references — then flags duplicates and high-risk applicants automatically. FCRA-compliant denials included.</p>
          <div class="hours-pill">Saves 4 hrs/mo</div>
        </div>

        <div class="new-feature-card">
          <div class="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 14 2 2 4-4"/></svg>
          </div>
          <h3>AI Lease Generator <span class="new-pill">New</span></h3>
          <p>Generate state-specific, attorney-reviewed leases in under 60 seconds. 20-section template with your custom clauses, auto-filled from application data.</p>
          <div class="hours-pill">Saves 6 hrs/mo</div>
        </div>

        <div class="new-feature-card">
          <div class="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h3>Workflows <span class="new-pill">New</span></h3>
          <p>Automate move-in chains, renewal reminders, maintenance escalations, and rent collection cadences. Set it once — Tenantory runs the playbook every time.</p>
          <div class="hours-pill">Saves 8 hrs/mo</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURE ROWS -->
  <section id="features" class="feature-rows">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">The stack you actually need</span>
        <h2>Everything you need. Nothing you don't.</h2>
      </div>

      <div class="feature-row">
        <div class="feature-row-copy">
          <div class="hours-pill" style="margin-bottom: 16px;">Saves 12 hrs/mo</div>
          <h3>Collect rent faster than ever</h3>
          <p>Automate rent and fee collection for reliably easy payments. Autopay, retry logic, and smart reminders — operators using autopay see on-time rates of 94%+ (vs. 67% industry average for manual collection*).</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Stripe-powered autopay with automatic retry on failed payments</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Automated late fees with per-operator configuration</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Rent goes directly to your bank — never through us</li>
          </ul>
        </div>
        <div class="feature-row-visual">
          <div class="fv-header"><span class="fv-dot"></span><span class="fv-dot"></span><span class="fv-dot"></span></div>
          <div class="fv-cards">
            <div class="fv-card"><div class="fv-card-label">This month</div><div class="fv-card-val">$24,850</div><div class="fv-card-sub">+12% MoM</div></div>
            <div class="fv-card"><div class="fv-card-label">On-time rate</div><div class="fv-card-val">94%</div><div class="fv-card-sub">Founder portfolio, 2026</div></div>
          </div>
          <div class="fv-chart">
            <div class="fv-bar" style="height:30%;background:var(--blue-pale);"></div>
            <div class="fv-bar" style="height:55%;background:var(--blue-pale);"></div>
            <div class="fv-bar" style="height:40%;background:var(--blue-pale);"></div>
            <div class="fv-bar" style="height:70%;background:var(--blue);"></div>
            <div class="fv-bar" style="height:85%;background:var(--blue);"></div>
            <div class="fv-bar" style="height:95%;background:var(--navy);"></div>
          </div>
        </div>
      </div>

      <div class="feature-row reverse">
        <div class="feature-row-copy">
          <div class="hours-pill" style="margin-bottom: 16px;">Saves 8 hrs/mo</div>
          <h3>Accounting that feels effortless</h3>
          <p>Schedule E-ready from day one. Your banker's favorite report is one click away. Year-end tax package auto-generated every December.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Per-property P&amp;L with mortgage interest/principal separation</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> A/R aging (30/60/90+) and investor-grade rent roll PDFs</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 1099 vendor reports and QuickBooks CSV export built-in</li>
          </ul>
        </div>
        <div class="feature-row-visual">
          <div class="fv-header"><span class="fv-dot"></span><span class="fv-dot"></span><span class="fv-dot"></span></div>
          <div class="fv-cards">
            <div class="fv-card"><div class="fv-card-label">YTD income</div><div class="fv-card-val">$298K</div><div class="fv-card-sub">Schedule E ready</div></div>
            <div class="fv-card"><div class="fv-card-label">Net operating</div><div class="fv-card-val">$142K</div><div class="fv-card-sub">47.6% margin</div></div>
          </div>
          <div class="fv-chart">
            <div class="fv-bar" style="height:40%;"></div>
            <div class="fv-bar" style="height:50%;"></div>
            <div class="fv-bar" style="height:65%;"></div>
            <div class="fv-bar" style="height:55%;"></div>
            <div class="fv-bar" style="height:75%;"></div>
            <div class="fv-bar" style="height:90%;"></div>
          </div>
        </div>
      </div>

      <div class="feature-row">
        <div class="feature-row-copy">
          <div class="hours-pill" style="margin-bottom: 16px;">Saves 6 hrs/mo</div>
          <h3>Maintenance made simple</h3>
          <p>Tenants submit tickets via their branded portal. You assign vendors, track costs, close the loop — all without leaving Tenantory. No more text-chain chaos or lost work orders.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Ticket pipeline: open → assigned → in-progress → completed</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Vendor directory with cost tracking and 1099 flagging</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Photo uploads, priority flags, tenant communication inline</li>
          </ul>
        </div>
        <div class="feature-row-visual">
          <div class="fv-header"><span class="fv-dot"></span><span class="fv-dot"></span><span class="fv-dot"></span></div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="background: #fff; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><strong>Leaky faucet — Room B</strong><span class="pill pill-red">Urgent</span></div>
              <div style="color: var(--text-muted); font-size: 12px;">Assigned to Joe's Plumbing · $180 est.</div>
            </div>
            <div style="background: #fff; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><strong>HVAC filter replacement</strong><span class="pill pill-green">Completed</span></div>
              <div style="color: var(--text-muted); font-size: 12px;">Acme HVAC · $45 actual</div>
            </div>
            <div style="background: #fff; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><strong>Garage door spring</strong><span class="pill" style="background: rgba(245,166,35,0.12); color: var(--gold);">In progress</span></div>
              <div style="color: var(--text-muted); font-size: 12px;">Scheduled Apr 14</div>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-row reverse">
        <div class="feature-row-copy">
          <div class="hours-pill" style="margin-bottom: 16px;">Saves 4 hrs/mo</div>
          <h3>Tenant screening done right</h3>
          <p>FCRA-compliant scoring in under 2 minutes. Background check, credit pull, income verification, and reference outreach — all in one workflow.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Income/credit/background/references scored out of 100 points</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Automatic duplicate application detection</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> FCRA-compliant adverse action notices auto-generated</li>
          </ul>
        </div>
        <div class="feature-row-visual">
          <div class="fv-header"><span class="fv-dot"></span><span class="fv-dot"></span><span class="fv-dot"></span></div>
          <div style="background: #fff; padding: 20px; border: 1px solid var(--border); border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <div style="font-weight: 700; color: var(--text);">Sarah Chen</div>
                <div style="font-size: 12px; color: var(--text-muted);">Applied for 142 Oak St, Room A</div>
              </div>
              <div style="font-size: 32px; font-weight: 800; color: var(--green);">92</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between;"><span>Income ratio</span><strong style="color: var(--green);">28/30</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Credit score</span><strong style="color: var(--green);">24/25</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>Background</span><strong style="color: var(--green);">25/25</strong></div>
              <div style="display: flex; justify-content: space-between;"><span>References</span><strong style="color: var(--green);">15/20</strong></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- FOUNDER STORY -->
  <section class="founder-story">
    <div class="wrap">
      <div class="founder-story-inner">
        <div class="founder-story-avatar">HC</div>
        <span class="eyebrow eyebrow-dark">Built by an operator, for operators</span>
        <h2>Why I built Tenantory.</h2>
        <p>I'm Harrison Cooper. I run a 15+ room co-living operation in Huntsville, Alabama.</p>
        <p>For three years I stitched AppFolio, QuickBooks, DocuSign, Google Sheets, and a bookkeeper together. Every week I lost 12 hours to admin work that software should have handled. Every quarter my banker asked for a rent roll and I'd lose half a Saturday building it.</p>
        <p>I built Tenantory because no existing PM software understood co-living, and the ones that came closest were either generic and ugly ($280/mo) or enterprise and bloated ($1,400/mo). Tenantory is the software I wish existed when I started. If you're an owner-operator running 5-100 units and you want your weekends back, let's talk.</p>
        <div class="founder-story-sig">— <strong>Harrison Cooper</strong>, Founder</div>
      </div>
    </div>
  </section>

  <!-- GUARANTEE -->
  <section class="guarantee">
    <div class="wrap">
      <div class="guarantee-card">
        <div class="guarantee-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <span class="eyebrow">The Tenantory Guarantee</span>
        <h2>If we don't save you 12 hours a week, we'll pay you $100.</h2>
        <p class="guarantee-body">Try Tenantory free for 14 days. No credit card. After 30 days as a paying customer, if Tenantory hasn't saved you at least 12 hours of work, email us. <span class="guarantee-highlight">Full refund — every dollar — plus $100 for your time.</span> We built this guarantee because we know what the software does. If you can't find 12 hours back in your month, something's broken — and we'll fix it or pay you.</p>
        <div class="guarantee-stack">
          <div class="guarantee-stack-item">
            <strong>14 days</strong>
            <span>Free trial, no card</span>
          </div>
          <div class="guarantee-stack-item">
            <strong>100%</strong>
            <span>Refund if we don't deliver</span>
          </div>
          <div class="guarantee-stack-item">
            <strong>+$100</strong>
            <span>Paid to you for your time</span>
          </div>
        </div>

        <!-- Stacked guarantee: reverse migration -->
        <div style="margin-top: 36px; padding: 24px 28px; background: var(--surface-alt); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); max-width: 660px; margin-left: auto; margin-right: auto; text-align: left;">
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--pink-bg); color: var(--pink); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M3 12h18"/><path d="m10 5-7 7 7 7"/></svg>
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 800; color: var(--pink); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;">Plus: Reverse-Migration Guarantee</div>
              <div style="color: var(--text); font-size: 15px; line-height: 1.55;">
                Decide to leave? <strong>We'll migrate your data back to AppFolio, Buildium, or QuickBooks — for free.</strong> No exit fees. No data lock-in. Export everything as CSV or JSON in one click.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 90 DAYS TIMELINE -->
  <section class="timeline">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Life after Tenantory</span>
        <h2>Here's what your year looks like.</h2>
      </div>
      <div class="timeline-grid">
        <div class="timeline-item">
          <div class="timeline-marker">DAY 1</div>
          <h4>You're live.</h4>
          <p>Your subdomain is up. Tenants get a welcome email from you — not from us.</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">DAY 14</div>
          <h4>Rent runs itself.</h4>
          <p>Autopay is on. Your bank balance grew this morning. You didn't lift a finger.</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">DAY 30</div>
          <h4>Banker impressed.</h4>
          <p>She asks for a rent roll at 4pm. You send it at 4:01. One click.</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">DAY 90</div>
          <h4>3 more units.</h4>
          <p>You added 3 doors to the portfolio. Admin load didn't change.</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">YR 1</div>
          <h4>3x the units.</h4>
          <p>Running 40 units with the admin load of 10. Took 4 weeks off last summer.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- THE MATH -->
  <section class="math">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">The math</span>
        <h2>Before Tenantory vs. with Tenantory.</h2>
        <p class="lead">You've seen the hours. Here's the dollars.</p>
      </div>

      <div class="math-compare">

        <div class="math-col math-col-before">
          <h3>The old way</h3>
          <ul>
            <li><span>AppFolio or Buildium</span><span>$280/mo</span></li>
            <li><span>QuickBooks + bookkeeper</span><span>$590/mo</span></li>
            <li><span>DocuSign</span><span>$45/mo</span></li>
            <li><span>Squarespace or Wix website</span><span>$30/mo</span></li>
            <li><span>SMS service (Twilio/EZ Texting)</span><span>$50/mo</span></li>
            <li><span>Maintenance ticketing</span><span>$50/mo</span></li>
            <li><span>Rent roll + investor reports</span><span>$200/mo<small style="display:block;font-size:11px;font-weight:400;color:var(--text-faint);">(10 hrs of your time)</small></span></li>
          </ul>
          <div class="math-total">
            <span>Total</span>
            <span class="math-total-num">$1,245<small>/mo</small></span>
          </div>
        </div>

        <div class="math-col math-col-after">
          <h3>Tenantory Pro</h3>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Everything above — built in</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Your brand on every page</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Automations that save 48 hrs/mo</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> $4,250 in Founder bonuses — free</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> $100 refund if we don't deliver</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> $97/mo locked for life</li>
          </ul>
          <div class="math-total">
            <span>Total</span>
            <span class="math-total-num">$97<small>/mo</small></span>
          </div>
        </div>

      </div>

      <div class="math-savings">
        <div class="math-savings-label">Your savings as a Founder</div>
        <div class="math-savings-number">$1,148<small>/month</small></div>
        <div class="math-savings-sub">That's <strong>$13,776 a year.</strong> Every year. For as long as you run your business.</div>
      </div>
    </div>
  </section>

  <!-- COMPARE TABLE -->
  <section id="compare-table" class="compare">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">How we stack up</span>
        <h2>Tenantory vs. the legacy options.</h2>
        <p class="lead">Same jobs done. Half the price. Built for how you actually operate.</p>
      </div>
      <div class="compare-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Capability</th>
              <th class="us">Tenantory</th>
              <th>AppFolio</th>
              <th>Buildium</th>
              <th>DoorLoop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Per-room / co-living leases</td>
              <td class="us-col yes">✓ Native</td>
              <td class="no">—</td>
              <td class="no">—</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Your own brand + domain</td>
              <td class="us-col yes">✓ Included</td>
              <td class="no">—</td>
              <td class="no">—</td>
              <td>Add-on</td>
            </tr>
            <tr>
              <td>Free data migration</td>
              <td class="us-col yes">✓ Done-for-you</td>
              <td class="no">—</td>
              <td>DIY</td>
              <td class="yes">✓</td>
            </tr>
            <tr>
              <td>Setup minimum</td>
              <td class="us-col yes">15 min</td>
              <td>2-4 weeks</td>
              <td>1-2 weeks</td>
              <td>1 week</td>
            </tr>
            <tr>
              <td>Unit minimum</td>
              <td class="us-col yes">None</td>
              <td>50 units</td>
              <td>None</td>
              <td>None</td>
            </tr>
            <tr>
              <td>AI lease generation</td>
              <td class="us-col yes">✓ Included</td>
              <td class="no">—</td>
              <td class="no">—</td>
              <td class="no">—</td>
            </tr>
            <tr>
              <td>Money-back guarantee</td>
              <td class="us-col yes">✓ + $100</td>
              <td class="no">—</td>
              <td class="no">—</td>
              <td>30-day</td>
            </tr>
            <tr>
              <td>Contract length</td>
              <td class="us-col yes">Month-to-month</td>
              <td>1-year min</td>
              <td>Month-to-month</td>
              <td>Annual</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Starting price</td>
              <td class="us-price">$97/mo</td>
              <td>$280/mo</td>
              <td>$58/mo*</td>
              <td>$59/mo*</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p style="text-align: center; font-size: 12px; color: var(--text-faint); margin-top: 16px; max-width: 780px; margin-left: auto; margin-right: auto;">
        * Buildium/DoorLoop starting prices exclude add-ons typically required for lease docs, SMS, and accounting. Comparison reflects publicly listed pricing as of April 2026.
      </p>
    </div>
  </section>

  <!-- PRICING -->
  <section id="pricing" class="pricing">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">The Founders' Offer · 87 spots left</span>
        <h2>Stop paying for five tools. Pay for one.</h2>
        <p class="lead">14-day free trial. No credit card required. Cancel anytime. Lock $97/mo for life as a Founder.</p>
      </div>

      <div class="price-controls">
        <div class="price-toggle">
          <button data-period="monthly">Monthly</button>
          <button class="active" data-period="yearly">Yearly</button>
        </div>
        <span class="price-save-badge">2 months free on yearly</span>
      </div>

      <div class="pricing-grid">

        <div class="price-card">
          <div class="price-name">Starter</div>
          <span class="price-was" style="visibility: hidden;">spacer</span>
          <div class="price-tag"><span class="amt" data-monthly="$47" data-yearly="$37">$37</span><span class="per">/mo</span></div>
          <div class="price-billing">
            <span class="billing-yearly"><strong>$444</strong> billed annually · save $120/yr</span>
            <span class="billing-monthly">Billed monthly</span>
          </div>
          <div class="price-anchor">For landlords leaving spreadsheets behind.</div>
          <div class="price-tagline">The step up from TurboTenant and RentRedi.</div>
          <div class="price-cta"><a href="#hero-form" class="btn btn-ghost">Get organized this week</a></div>
          <div class="price-features-head">Starter plan includes:</div>
          <ul class="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Up to <strong>10 units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Application tracking + tenant portal</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Rent collection via Stripe</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Basic accounting + Schedule E export</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 1 generic lease template</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 1 team seat</li>
          </ul>
        </div>

        <div class="price-card featured">
          <span class="price-badge">Most Popular</span>
          <div class="price-name">Pro</div>
          <span class="price-was">Launch price $197/mo</span>
          <div class="price-tag"><span class="amt" data-monthly="$97" data-yearly="$77">$77</span><span class="per">/mo</span></div>
          <div class="price-billing">
            <span class="billing-yearly"><strong>$924</strong> billed annually · save $240/yr · locked for life</span>
            <span class="billing-monthly">Billed monthly · Founders locked for life</span>
          </div>
          <div class="price-anchor">Launch price <strike>$197/mo</strike>. <strong>Founders pay this rate forever.</strong></div>
          <div class="price-tagline">For owner-operators who want to look like a real company.</div>
          <div class="price-cta"><a href="#hero-form" class="btn btn-primary">Get my time back</a></div>
          <div class="price-features-head">Pro: Everything in Starter, and:</div>
          <ul class="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Up to <strong>50 units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>Your subdomain + logo + color</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Full Schedule E accounting + rent roll + 1099</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Unlimited AI-generated e-sign leases</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Autopay + automated late fees + retry</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> SMS reminders (500/mo)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> AI application scoring + FCRA denials</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 3 team seats</li>
          </ul>

          <div class="price-bonus">
            <div class="price-bonus-head">Plus, included free for Founders</div>
            <ul>
              <li><strong>Free AppFolio/Buildium data migration</strong> — done by our team<em>$500 value</em></li>
              <li><strong>AppFolio contract buyout</strong> — we pay up to $500 of your remaining contract<em>$500 value</em></li>
              <li><strong>30-min onboarding call</strong> with a real property manager<em>$300 value</em></li>
              <li><strong>State-specific custom lease template</strong> — attorney-reviewed<em>$750 value</em></li>
              <li><strong>Lifetime $97/mo price lock</strong> — even when launch price hits $197<em>$1,800 value</em></li>
              <li style="background: rgba(255,73,152,0.08); margin: 4px -8px 0; padding: 10px 8px; border-radius: 6px;"><strong>48-HR SPEED BONUS:</strong> Sign up in next 48h, get 1 month of bookkeeping cleanup done for you<em>$400 value</em></li>
            </ul>
            <div class="price-bonus-total">
              <span>Total bonuses</span>
              <strong>$4,250 value — free</strong>
            </div>
          </div>
        </div>

        <div class="price-card">
          <div class="price-name">Scale</div>
          <span class="price-was">Launch price $497/mo</span>
          <div class="price-tag"><span class="amt" data-monthly="$297" data-yearly="$247">$247</span><span class="per">/mo</span></div>
          <div class="price-billing">
            <span class="billing-yearly"><strong>$2,964</strong> billed annually · save $600/yr</span>
            <span class="billing-monthly">Billed monthly</span>
          </div>
          <div class="price-anchor">Launch price <strike>$497/mo</strike>. <strong>Founders lock at $297/mo.</strong></div>
          <div class="price-tagline">For brand-forward PMs and multi-portfolio operators.</div>
          <div class="price-cta"><a href="#hero-form" class="btn btn-ghost">Launch my branded portal</a></div>
          <div class="price-features-head">Scale: Everything in Pro, and:</div>
          <ul class="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>Bring your own domain</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> "Powered by Tenantory" removed</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>Unlimited units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Custom email from your domain</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> API access + webhooks</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Banker / investor portal</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Multi-LLC / multi-portfolio workspace</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> SMS reminders (2,000/mo)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 10 team seats</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Priority support, 4h response</li>
          </ul>

          <div class="price-bonus">
            <div class="price-bonus-head">Plus, included for Scale</div>
            <ul>
              <li><strong>White-glove onboarding</strong> — we set up your domain, SSL, and data in 48 hours<em>$1,500 value</em></li>
              <li><strong>Quarterly strategy call</strong> — 60 min with founder, 4x per year<em>$1,200 value</em></li>
              <li><strong>Dedicated Slack channel</strong> — direct line to engineering for feature requests<em>$600 value</em></li>
              <li><strong>Custom integration support</strong> — we'll help connect your CRM or bank<em>$900 value</em></li>
            </ul>
            <div class="price-bonus-total">
              <span>Total bonuses</span>
              <strong>$4,200 value — free</strong>
            </div>
          </div>
        </div>

        <div class="price-card enterprise">
          <div class="price-name">Enterprise</div>
          <span class="price-was" style="visibility: hidden;">spacer</span>
          <div class="price-tag"><span class="amt" data-monthly="$1,497" data-yearly="$1,497">$1,497</span><span class="per">/mo+</span></div>
          <div class="price-billing">
            <span>Custom pricing · annual contract</span>
          </div>
          <div class="price-anchor">Starts at $1,497/mo. Scales to 10,000+ units.</div>
          <div class="price-tagline">For franchises, multi-market PMs, and white-label resellers.</div>
          <div class="price-cta"><a href="mailto:sales@tenantory.com" class="btn btn-gold" style="width: 100%;">Talk to sales</a></div>
          <div class="price-features-head">Enterprise: Everything in Scale, and:</div>
          <ul class="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>Multi-workspace</strong> (franchise / multi-market)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>SSO</strong> (Okta, Google Workspace, Azure AD)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Custom SLA with 99.99% uptime</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <strong>Dedicated success manager</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> White-label reseller rights</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Custom feature development</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Unlimited seats + workspaces</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 1-hour support response</li>
          </ul>
        </div>

      </div>
      <p style="text-align:center; margin-top: 28px; font-size: 14px; color: var(--text-muted);">
        Want every feature side-by-side?
        <a href="pricing.html" style="color: var(--blue); font-weight: 600; text-decoration: underline;">Full comparison</a>
        ·
        <a href="vs-appfolio.html" style="color: var(--blue); font-weight: 600; text-decoration: underline;">vs AppFolio</a>
        ·
        <a href="vs-buildium.html" style="color: var(--blue); font-weight: 600; text-decoration: underline;">vs Buildium</a>
        ·
        <a href="vs-doorloop.html" style="color: var(--blue); font-weight: 600; text-decoration: underline;">vs DoorLoop &rarr;</a>
      </p>
    </div>
  </section>

  <!-- SUPPORT -->
  <section class="support">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Real humans, no bots</span>
        <h2>World-class support in minutes.</h2>
        <p class="lead">Our team is small, opinionated, and cares obsessively. You'll talk to a human who actually uses the software.</p>
      </div>
      <div class="support-grid">
        <div class="support-item">
          <div class="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h4>Unlimited support</h4>
          <p>No tiered pricing on support. Same response time for everyone.</p>
        </div>
        <div class="support-item">
          <div class="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h4>60-sec video walkthroughs</h4>
          <p>Every feature has a quick tutorial. Search and go.</p>
        </div>
        <div class="support-item">
          <div class="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <h4>Free Zoom training</h4>
          <p>Book a 30-min call. A real PM walks you through setup.</p>
        </div>
        <div class="support-item">
          <div class="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </div>
          <h4>Free data migration</h4>
          <p>Send your spreadsheet. We import everything for you.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq" class="faq">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">FAQ</span>
        <h2>Your questions, answered.</h2>
      </div>
      <div class="faq-tabs">
        <button class="faq-tab active" data-faq-tab="general">General</button>
        <button class="faq-tab" data-faq-tab="product">Product</button>
        <button class="faq-tab" data-faq-tab="support">Support &amp; billing</button>
      </div>

      <div class="faq-panel active" data-faq-panel="general">
        <details class="faq-item">
          <summary class="faq-q">How is Tenantory different from AppFolio or Buildium?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Tenantory is built for owner-operator PMs who want <strong>their own brand</strong> — not a generic portal that screams "we use AppFolio." Pro starts at $97/mo vs AppFolio's $298/mo minimum. And we support <strong>co-living / rent-by-the-bedroom</strong> natively, which AppFolio does not.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">Do I need a credit card to try it?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">No. 14-day free trial on every tier. No credit card required to start.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">What's the "Founders' Offer"?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">The first 100 PMs to join Tenantory Pro lock <strong>$99/mo for life</strong> — even when the launch price rises to $149/mo. Founders also get <strong>$4,250 in bonuses</strong> included free: free data migration ($500), AppFolio contract buyout up to $500, a 30-minute onboarding call ($300), state-specific custom lease template ($750), lifetime price lock ($1,800+ value), and — if you sign up in the next 48 hours — 1 month of bookkeeping cleanup ($400). 87 spots remain.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">Is there a contract?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">No contracts. Month-to-month on all tiers. Annual plans get 2 months free. Cancel anytime from your dashboard.</div>
        </details>
      </div>

      <div class="faq-panel" data-faq-panel="product">
        <details class="faq-item">
          <summary class="faq-q">Do I have to migrate my existing data?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">No lifting. Send us your tenant spreadsheet or give us read access to AppFolio, and we'll <strong>import everything for free</strong>. Takes us about a day.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">Can I use my own domain?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Yes, on Scale. Point a CNAME at our servers; we verify and provision an SSL cert automatically. Usually live within 15 minutes.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">What payment processor do you use?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Stripe. You connect your own Stripe account via Stripe Connect — rent goes <strong>directly to your bank</strong>, never through ours.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">Is my tenant data private?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Yes. Each workspace is isolated at the database level. We never share data across PMs, and we never sell tenant data.</div>
        </details>
      </div>

      <div class="faq-panel" data-faq-panel="support">
        <details class="faq-item">
          <summary class="faq-q">What happens if I cancel?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Access until the end of your billing period. Then we export everything as JSON. No data lock-in.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">What's your support response time?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Starter: 48h. Pro: 24h. Scale: 4h. Enterprise: 1h with a dedicated success manager.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">What's in the Tenantory Guarantee?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">If after 30 days as a paying customer Tenantory hasn't saved you 12 hours, email us. <strong>Full refund plus $100 for your time.</strong> No questions asked.</div>
        </details>
        <details class="faq-item">
          <summary class="faq-q">How does billing work for annual plans?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></summary>
          <div class="faq-a">Billed upfront with 2 months free (17% discount). Switch from monthly to annual anytime — we prorate the difference.</div>
        </details>
      </div>
    </div>
  </section>

  <!-- LEAD MAGNET -->
  <section class="lead-magnet">
    <div class="wrap">
      <div class="lead-magnet-card">
        <div>
          <span class="lead-magnet-tag">Not ready to switch? Grab this instead.</span>
          <h2>The 1-Page Banker Rent Roll Template — free PDF.</h2>
          <p>The exact rent roll format real operators send to their lender to unlock the next deal. Steal the structure. Send it in Excel or print it. Yours in 10 seconds.</p>
          <form class="lead-magnet-form" onsubmit="event.preventDefault(); alert('Lead magnet PDF would send here');">
            <input type="email" placeholder="your@email.com" required>
            <button type="submit">Send it to me</button>
          </form>
          <p style="font-size: 12px; color: var(--text-faint); margin-top: 12px; margin-bottom: 0;">No spam. Unsubscribe with one click. We use your email to send the PDF and 3 short operator emails — that's it.</p>
        </div>
        <div class="lead-magnet-visual">
          <div class="lmv-head">Rent Roll · Apr 2026</div>
          <div class="lmv-title">Your Property LLC</div>
          <div class="lmv-rows">
            <div class="lmv-row"><span>142 Oak St · A</span><strong>$950</strong></div>
            <div class="lmv-row"><span>142 Oak St · B</span><strong>$950</strong></div>
            <div class="lmv-row"><span>142 Oak St · C</span><strong>$975</strong></div>
            <div class="lmv-row"><span>88 Maple Ave · A</span><strong>$1,100</strong></div>
            <div class="lmv-row"><span>88 Maple Ave · B</span><strong>$1,100</strong></div>
            <div class="lmv-row"><span>410 Pine Rd · A</span><strong>$1,250</strong></div>
          </div>
          <div class="lmv-foot">
            <span>Monthly</span>
            <span>$24,850</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta">
    <div class="wrap">
      <span class="eyebrow eyebrow-pink">The Founders' Offer · 87 spots left</span>
      <h2>Get <u>12 hours a week</u> back. Starting today.</h2>
      <p class="lead">14-day trial. No credit card. $4,250 in bonuses included. $97/mo locked for life. Tenantory Guarantee: if we don't deliver, you get a full refund and $100 for your time.</p>
      <form class="final-cta-form" onsubmit="event.preventDefault(); alert('Demo signup would fire here');">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Get my time back</button>
      </form>
      <div class="final-cta-chips">
        <span class="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          No credit card required
        </span>
        <span class="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Live in 15 minutes
        </span>
        <span class="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          $100 if we don't deliver
        </span>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="logo">
            <span class="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
            </span>
            Tenantory
          </a>
          <p>The property management platform for owner-operators who want their own brand. Built by an operator, for operators.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="pricing.html">Pricing</a></li>
            <li><a href="#time-back">Your time back</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Who it's for</h4>
          <ul>
            <li><a href="#">Co-living</a></li>
            <li><a href="#">Single-family</a></li>
            <li><a href="#">Multifamily</a></li>
            <li><a href="#">Student housing</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Help center</a></li>
            <li><a href="#compare-table">Compare us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Rental forms</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 Tenantory. Built by an operator in Huntsville, Alabama.</div>
        <div class="footer-legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="security.html">Security</a>
        </div>
      </div>
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
