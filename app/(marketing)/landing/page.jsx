"use client";

// Mock ported from ~/Desktop/blackbear/landing.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: #1a1f36;\n      background: #ffffff;\n      line-height: 1.55;\n      font-size: 16px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; }\n    img, svg { display: block; max-width: 100%; }\n    input, select { font-family: inherit; font-size: inherit; }\n\n    :root {\n      --navy: #2F3E83;\n      --navy-dark: #1e2a5e;\n      --blue: #1251AD;\n      --blue-bright: #1665D8;\n      --blue-pale: rgb(241, 245, 255);\n      --pink: #FF4998;\n      --pink-bg: rgba(237, 185, 236, 0.3);\n      --text: #1a1f36;\n      --text-muted: #5a6478;\n      --text-faint: #8a93a5;\n      --surface: #ffffff;\n      --surface-alt: #f7f9fc;\n      --border: #e3e8ef;\n      --border-strong: #c9d1dd;\n      --gold: #f5a623;\n      --green: #1ea97c;\n      --green-dark: #138a60;\n      --red: #d64545;\n      --radius-sm: 8px;\n      --radius: 12px;\n      --radius-lg: 18px;\n      --radius-xl: 24px;\n      --shadow-sm: 0 1px 3px rgba(26,31,54,0.06);\n      --shadow: 0 6px 24px rgba(26,31,54,0.08);\n      --shadow-lg: 0 20px 60px rgba(26,31,54,0.12);\n      --max: 1200px;\n    }\n\n    .wrap { max-width: var(--max); margin: 0 auto; padding: 0 24px; }\n    section { padding: 88px 0; }\n    @media (max-width: 860px) {\n      section { padding: 56px 0; }\n      .wrap { padding: 0 20px; }\n    }\n\n    h1, h2, h3, h4 { color: var(--text); font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }\n    h1 { font-size: clamp(38px, 5.8vw, 66px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }\n    h2 { font-size: clamp(30px, 3.8vw, 48px); letter-spacing: -0.03em; }\n    h3 { font-size: 20px; }\n    h4 { font-size: 17px; font-weight: 600; }\n    p { color: var(--text-muted); }\n    .lead { font-size: clamp(17px, 1.7vw, 20px); color: var(--text-muted); line-height: 1.55; font-weight: 400; }\n\n    .eyebrow {\n      display: inline-block;\n      font-size: 13px;\n      font-weight: 700;\n      color: var(--blue);\n      text-transform: uppercase;\n      letter-spacing: 0.14em;\n      margin-bottom: 16px;\n    }\n    .eyebrow-dark { color: rgba(255,255,255,0.7); }\n    .eyebrow-pink { color: var(--pink); }\n\n    .section-head { text-align: center; max-width: 820px; margin: 0 auto 56px; }\n    .section-head .lead { margin-top: 16px; }\n\n    .btn {\n      display: inline-flex; align-items: center; justify-content: center; gap: 8px;\n      padding: 14px 24px; border-radius: 100px;\n      font-weight: 600; font-size: 15px;\n      transition: all .2s ease; white-space: nowrap;\n    }\n    .btn-primary {\n      background: var(--blue); color: #fff;\n    }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: var(--shadow); }\n    .btn-ghost {\n      color: var(--navy); border: 1.5px solid var(--border-strong); background: #fff;\n    }\n    .btn-ghost:hover { border-color: var(--navy); color: var(--navy); }\n    .btn-lg { padding: 16px 28px; font-size: 16px; }\n    .btn-white { background: #fff; color: var(--navy); }\n    .btn-white:hover { background: #f0f4ff; }\n    .btn-gold { background: var(--gold); color: #fff; }\n    .btn-gold:hover { background: #e09110; }\n    .chevron-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      color: var(--blue); font-weight: 600; font-size: 15px;\n    }\n    .chevron-link:hover { color: var(--navy); }\n    .chevron-link svg { width: 16px; height: 16px; transition: transform .2s ease; }\n    .chevron-link:hover svg { transform: translateX(3px); }\n\n    .new-pill {\n      display: inline-block;\n      background: var(--pink-bg); color: var(--pink);\n      font-size: 11px; font-weight: 700;\n      letter-spacing: 0.1em; text-transform: uppercase;\n      padding: 3px 8px; border-radius: 4px;\n      margin-left: 6px; vertical-align: middle;\n    }\n\n    .hours-pill {\n      display: inline-block;\n      background: rgba(30,169,124,0.12); color: var(--green-dark);\n      font-size: 12px; font-weight: 700;\n      letter-spacing: 0.02em;\n      padding: 4px 10px; border-radius: 100px;\n    }\n\n    /* ===== Top utility ===== */\n    .top-bar {\n      background: var(--navy-dark); color: #fff;\n      padding: 10px 0; font-size: 13px; text-align: center;\n    }\n    .top-bar strong { color: var(--pink); font-weight: 700; }\n    .top-bar a { text-decoration: underline; margin-left: 6px; color: rgba(255,255,255,0.9); }\n\n    /* ===== Nav ===== */\n    .nav {\n      position: sticky; top: 0; z-index: 50;\n      background: rgba(255,255,255,0.95); backdrop-filter: saturate(180%) blur(14px);\n      border-bottom: 1px solid var(--border);\n    }\n    .nav-inner {\n      display: flex; align-items: center; justify-content: space-between;\n      height: 72px; gap: 40px;\n    }\n    .logo {\n      display: flex; align-items: center; gap: 10px;\n      font-weight: 800; font-size: 22px; letter-spacing: -0.02em;\n      color: var(--navy);\n    }\n    .logo-mark {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--navy);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .logo-mark svg { width: 18px; height: 18px; color: #fff; }\n    .nav-links { display: flex; align-items: center; gap: 28px; flex: 1; }\n    .nav-links > a { font-size: 14px; color: var(--text); font-weight: 500; }\n    .nav-links > a:hover { color: var(--blue); }\n    .nav-cta { display: flex; align-items: center; gap: 16px; }\n    @media (max-width: 1000px) {\n      .nav-links { display: none; }\n    }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 80px 0 56px;\n      background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);\n    }\n    .hero-grid {\n      display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center;\n    }\n    .hero h1 { margin-bottom: 20px; }\n    .hero h1 em { font-style: normal; color: var(--blue); }\n    .hero h1 u {\n      text-decoration: none;\n      display: inline-block;\n      padding: 0 6px 4px;\n      background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='2' seed='4'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23FF4998' fill-opacity='0.42' filter='url(%23r)'/></svg>\");\n      background-repeat: no-repeat;\n      background-position: 0 55%;\n      background-size: 100% 60%;\n    }\n    .hero p.lead { margin-bottom: 32px; max-width: 580px; }\n    .hero-form {\n      display: flex; gap: 8px; max-width: 520px;\n      background: #fff; padding: 6px; border-radius: 100px;\n      box-shadow: var(--shadow); border: 1px solid var(--border);\n      margin-bottom: 14px;\n    }\n    .hero-form input {\n      flex: 1; border: none; outline: none;\n      padding: 12px 20px; font-size: 15px; background: transparent;\n    }\n    .hero-form button {\n      background: var(--blue); color: #fff;\n      padding: 12px 24px; border-radius: 100px;\n      font-weight: 600; font-size: 14px; transition: all .2s ease;\n    }\n    .hero-form button:hover { background: var(--navy); }\n    .hero-microcopy { font-size: 13px; color: var(--text-faint); margin-bottom: 28px; padding-left: 20px; }\n    .hero-microcopy strong { color: var(--pink); }\n\n    /* Founder credibility block */\n    .founder-block {\n      display: flex; align-items: center; gap: 16px;\n      padding: 16px 20px; background: #fff;\n      border: 1px solid var(--border); border-radius: 14px;\n      max-width: 520px; box-shadow: var(--shadow-sm);\n    }\n    .founder-avatar {\n      width: 52px; height: 52px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--navy), var(--blue));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 700; font-size: 20px; flex-shrink: 0;\n      border: 2px solid #fff; box-shadow: var(--shadow-sm);\n    }\n    .founder-text { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n    .founder-text strong { color: var(--text); font-weight: 700; }\n\n    /* Device stack (desktop + floating phone) */\n    .device-stack {\n      position: relative;\n      padding: 20px 0 40px 60px;\n      min-height: 520px;\n    }\n    .device-desktop {\n      position: relative;\n      background: #fff;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      box-shadow: 0 30px 80px rgba(26,31,54,0.18), 0 8px 24px rgba(26,31,54,0.08);\n      overflow: hidden;\n      margin-left: auto;\n      width: 100%;\n      max-width: 620px;\n    }\n    .device-desktop-bar {\n      display: flex; align-items: center; gap: 8px;\n      padding: 10px 14px; background: #f1f3f7;\n      border-bottom: 1px solid var(--border);\n    }\n    .device-desktop-bar .dot { width: 10px; height: 10px; border-radius: 50%; }\n    .device-desktop-bar .dot.r { background: #ff5f57; }\n    .device-desktop-bar .dot.y { background: #febc2e; }\n    .device-desktop-bar .dot.g { background: #28c840; }\n    .device-desktop-url {\n      margin-left: 10px; padding: 4px 12px;\n      background: #fff; border-radius: 6px;\n      font-size: 11px; color: var(--text-faint);\n      border: 1px solid var(--border);\n      flex: 1; max-width: 220px;\n    }\n    .device-desktop-body { padding: 18px; }\n    .dd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }\n    .dd-stat { padding: 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-alt); }\n    .dd-stat-label { font-size: 10px; color: var(--text-faint); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }\n    .dd-stat-val { font-size: 19px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }\n    .dd-stat-delta { font-size: 10px; color: var(--green); font-weight: 600; margin-top: 3px; }\n    .dd-rows { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }\n    .dd-row { display: grid; grid-template-columns: 1.6fr 1fr 80px; gap: 10px; padding: 10px 12px; font-size: 12px; border-bottom: 1px solid var(--border); align-items: center; }\n    .dd-row:last-child { border-bottom: none; }\n    .dd-row-head { background: var(--surface-alt); color: var(--text-faint); font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }\n\n    /* Phone frame floating in front */\n    .device-phone {\n      position: absolute;\n      left: 0; bottom: 0;\n      width: 200px;\n      background: #1a1f36;\n      border-radius: 28px;\n      padding: 8px;\n      box-shadow: 0 30px 80px rgba(26,31,54,0.28), 0 10px 30px rgba(26,31,54,0.15);\n      z-index: 2;\n    }\n    .device-phone-screen {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      border-radius: 22px;\n      padding: 20px 14px 16px;\n      color: #fff;\n      position: relative;\n      overflow: hidden;\n    }\n    .device-phone-notch {\n      position: absolute; top: 10px; left: 50%; transform: translateX(-50%);\n      width: 60px; height: 14px; background: #1a1f36; border-radius: 10px;\n    }\n    .dp-brand-top {\n      margin-top: 14px;\n      font-size: 10px; font-weight: 800;\n      color: var(--pink);\n      text-transform: uppercase; letter-spacing: 0.14em;\n      text-align: center;\n      padding-bottom: 10px;\n      border-bottom: 1px solid rgba(255,255,255,0.1);\n      margin-bottom: 14px;\n    }\n    .dp-welcome { font-size: 15px; font-weight: 700; margin-bottom: 14px; letter-spacing: -0.01em; }\n    .dp-card {\n      background: rgba(255,255,255,0.08);\n      border: 1px solid rgba(255,255,255,0.1);\n      border-radius: 12px;\n      padding: 14px;\n      margin-bottom: 10px;\n    }\n    .dp-card-label { font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 6px; }\n    .dp-card-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }\n    .dp-card-sub { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px; }\n    .dp-btn {\n      display: block; width: 100%; text-align: center;\n      background: var(--pink); color: #fff;\n      padding: 10px; border-radius: 100px;\n      font-size: 12px; font-weight: 700;\n      margin-top: 8px;\n    }\n    .dp-row {\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 11px;\n      padding: 6px 0;\n      border-bottom: 1px solid rgba(255,255,255,0.08);\n    }\n    .dp-row:last-child { border-bottom: none; }\n    .dp-row span:first-child { color: rgba(255,255,255,0.75); }\n    .dp-row strong { color: #fff; font-weight: 700; }\n    .dp-brand {\n      font-size: 9px; color: rgba(255,255,255,0.55);\n      text-align: center; margin-top: 10px;\n      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;\n    }\n    .dp-brand strong { color: #fff; font-weight: 800; }\n\n    /* Floating overlay badge */\n    .device-overlay {\n      position: absolute;\n      bottom: 10px; right: -10px;\n      background: #fff; border-radius: 14px; padding: 14px 18px;\n      box-shadow: var(--shadow-lg); border: 1px solid var(--border);\n      display: flex; align-items: center; gap: 12px;\n      z-index: 3;\n    }\n    .device-overlay-icon {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: rgba(30,169,124,0.15); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .device-overlay-text strong { display: block; font-size: 18px; color: var(--text); font-weight: 800; line-height: 1; }\n    .device-overlay-text span { font-size: 12px; color: var(--text-muted); }\n\n    @media (max-width: 960px) {\n      .device-stack { padding: 0; min-height: 0; }\n      .device-desktop { max-width: 100%; }\n      .device-phone { position: relative; left: auto; bottom: auto; width: 180px; margin: -40px auto 0; }\n      .device-overlay { position: relative; bottom: auto; right: auto; margin: 20px auto 0; max-width: max-content; }\n    }\n\n    .pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }\n    .pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }\n    .pill-green { background: rgba(30,169,124,0.12); color: var(--green); }\n    .pill-red { background: rgba(214,69,69,0.12); color: var(--red); }\n    @media (max-width: 960px) {\n      .hero-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }\n      .hero-form { margin-left: auto; margin-right: auto; }\n      .hero-microcopy { padding-left: 0; }\n      .founder-block { margin-left: auto; margin-right: auto; text-align: left; }\n      .hero p.lead { margin-left: auto; margin-right: auto; }\n    }\n    @media (max-width: 520px) {\n      .hero-form { flex-direction: column; padding: 12px; border-radius: 16px; }\n      .hero-form input { text-align: center; padding: 10px; }\n      .hero-form button { width: 100%; }\n    }\n\n    /* ===== Social proof / testimonials ===== */\n    .proof { background: #fff; padding: 72px 0; border-bottom: 1px solid var(--border); }\n    .proof-head { text-align: center; margin-bottom: 40px; }\n    .proof-eyebrow {\n      display: inline-block; font-size: 12px; font-weight: 700;\n      color: var(--text-faint); text-transform: uppercase;\n      letter-spacing: 0.16em; margin-bottom: 8px;\n    }\n    .proof-stats {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;\n      max-width: 900px; margin: 0 auto 56px;\n      padding: 28px 32px;\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-xl);\n    }\n    .proof-stat { text-align: center; }\n    .proof-stat-num {\n      font-size: clamp(28px, 3vw, 38px); font-weight: 800;\n      color: var(--navy); letter-spacing: -0.02em; line-height: 1;\n    }\n    .proof-stat-label {\n      font-size: 12px; color: var(--text-muted); font-weight: 500;\n      margin-top: 6px;\n    }\n    .testimonial-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;\n      max-width: 1100px; margin: 0 auto;\n    }\n    .testimonial {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 28px;\n      display: flex; flex-direction: column;\n      box-shadow: var(--shadow-sm);\n    }\n    .testimonial-stars {\n      display: flex; gap: 2px; color: var(--gold);\n      margin-bottom: 14px; font-size: 14px;\n    }\n    .testimonial-quote {\n      font-size: 15px; line-height: 1.6; color: var(--text);\n      font-weight: 500; margin-bottom: 18px; flex: 1;\n    }\n    .testimonial-quote strong {\n      background: linear-gradient(180deg, transparent 60%, rgba(30,169,124,0.25) 60%);\n      font-weight: 700;\n    }\n    .testimonial-foot { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border); }\n    .testimonial-avatar {\n      width: 44px; height: 44px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--navy), var(--blue));\n      color: #fff; font-weight: 700; font-size: 15px;\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .testimonial-foot-text { font-size: 13px; line-height: 1.3; }\n    .testimonial-foot-text strong { display: block; color: var(--text); font-weight: 700; }\n    .testimonial-foot-text span { color: var(--text-muted); }\n    .testimonial.featured { border: 2px solid var(--blue); box-shadow: 0 12px 40px rgba(18,81,173,0.12); }\n    .testimonial-case-badge {\n      display: inline-block; background: var(--blue-pale); color: var(--blue);\n      font-size: 10px; font-weight: 800; padding: 4px 10px;\n      border-radius: 100px; letter-spacing: 0.12em; text-transform: uppercase;\n      margin-bottom: 12px;\n    }\n    .testimonial-metrics {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;\n      margin: 14px 0 18px;\n      padding: 14px; background: var(--surface-alt);\n      border-radius: 10px;\n    }\n    .testimonial-metric { text-align: center; }\n    .testimonial-metric-num { font-size: 18px; font-weight: 800; color: var(--navy); line-height: 1; }\n    .testimonial-metric-label { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }\n    @media (max-width: 860px) {\n      .proof-stats { grid-template-columns: repeat(2, 1fr); }\n      .testimonial-grid { grid-template-columns: 1fr; }\n    }\n\n    /* ===== Time Back anchor section ===== */\n    .time-back {\n      background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy) 100%);\n      color: #fff;\n    }\n    .time-back h2 { color: #fff; }\n    .time-back .lead { color: rgba(255,255,255,0.75); }\n    .time-back .section-head p { color: rgba(255,255,255,0.75); }\n    .time-back-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n      margin-bottom: 56px;\n    }\n    .time-back-card {\n      background: rgba(255,255,255,0.04);\n      border: 1px solid rgba(255,255,255,0.08);\n      border-radius: var(--radius);\n      padding: 20px;\n      display: flex; align-items: center; justify-content: space-between; gap: 12px;\n    }\n    .time-back-card-icon {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: rgba(255,73,152,0.15); color: var(--pink);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .time-back-card-icon svg { width: 18px; height: 18px; }\n    .time-back-card-text {\n      flex: 1; font-size: 14px; font-weight: 500;\n      color: rgba(255,255,255,0.9);\n    }\n    .time-back-card-hours {\n      font-size: 12px; font-weight: 700;\n      color: var(--green); background: rgba(30,169,124,0.15);\n      padding: 4px 10px; border-radius: 100px;\n      white-space: nowrap;\n    }\n    .time-back-total {\n      text-align: center; padding: 48px;\n      background: rgba(255,255,255,0.03);\n      border: 1px solid rgba(255,255,255,0.1);\n      border-radius: var(--radius-xl);\n      max-width: 760px; margin: 0 auto;\n    }\n    .time-back-total-label {\n      font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.65);\n      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;\n    }\n    .time-back-total-number {\n      font-weight: 900;\n      letter-spacing: -0.04em; line-height: 1;\n      margin-bottom: 12px;\n      display: flex; align-items: baseline; justify-content: center; gap: 10px;\n    }\n    .time-back-total-number .num {\n      font-size: clamp(64px, 10vw, 120px);\n      background: linear-gradient(180deg, #fff 0%, var(--pink) 200%);\n      -webkit-background-clip: text; background-clip: text;\n      -webkit-text-fill-color: transparent;\n      color: transparent;\n    }\n    .time-back-total-number .unit {\n      font-size: clamp(20px, 2.4vw, 30px);\n      font-weight: 700; color: rgba(255,255,255,0.85);\n      letter-spacing: 0;\n    }\n    .time-back-total-sub {\n      font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 24px;\n    }\n    .time-back-total-sub strong { color: var(--pink); font-weight: 700; }\n    @media (max-width: 860px) { .time-back-grid { grid-template-columns: 1fr; } }\n\n    /* ===== Problem (Stop doing X) ===== */\n    .problem {\n      background: var(--surface-alt);\n    }\n    .problem-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;\n      max-width: 900px; margin: 0 auto;\n    }\n    .problem-item {\n      display: flex; align-items: center; gap: 16px;\n      background: #fff; padding: 20px;\n      border: 1px solid var(--border); border-radius: var(--radius);\n    }\n    .problem-x {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: rgba(214,69,69,0.12); color: var(--red);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .problem-x svg { width: 18px; height: 18px; }\n    .problem-item-text { font-size: 16px; font-weight: 600; color: var(--text); }\n    @media (max-width: 720px) { .problem-grid { grid-template-columns: 1fr; } }\n\n    /* ===== Portfolios ===== */\n    .portfolios { background: #fff; }\n    .portfolio-tabs {\n      display: flex; justify-content: center; gap: 8px;\n      flex-wrap: wrap; margin-bottom: 48px;\n    }\n    .portfolio-tab {\n      padding: 10px 20px; border-radius: 100px;\n      border: 1.5px solid var(--border);\n      background: #fff; color: var(--text);\n      font-weight: 600; font-size: 14px;\n      transition: all .2s ease;\n    }\n    .portfolio-tab:hover { border-color: var(--blue); color: var(--blue); }\n    .portfolio-tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }\n    .portfolio-panel { display: none; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }\n    .portfolio-panel.active { display: grid; }\n    .portfolio-panel h3 { font-size: 28px; margin-bottom: 12px; }\n    .portfolio-panel p { font-size: 16px; margin-bottom: 20px; }\n    .portfolio-panel ul { list-style: none; padding: 0; margin-bottom: 24px; }\n    .portfolio-panel li {\n      display: flex; gap: 10px; align-items: flex-start;\n      padding: 6px 0; font-size: 14px; color: var(--text);\n    }\n    .portfolio-panel li svg { width: 18px; height: 18px; color: var(--green); flex-shrink: 0; margin-top: 2px; }\n    .portfolio-visual {\n      aspect-ratio: 4/3; border-radius: var(--radius-lg);\n      background: linear-gradient(135deg, var(--blue-pale), #fff);\n      border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;\n      color: var(--blue); font-weight: 600;\n    }\n    .portfolio-visual svg { width: 80px; height: 80px; opacity: 0.3; }\n    @media (max-width: 860px) { .portfolio-panel.active { grid-template-columns: 1fr; } }\n\n    /* ===== Tenant view section ===== */\n    .tenant-view { background: var(--surface-alt); }\n    .tenant-view-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;\n    }\n    .tenant-view-copy h2 { margin-bottom: 16px; }\n    .tenant-view-copy p { font-size: 17px; margin-bottom: 24px; max-width: 480px; }\n    .tenant-view-list { list-style: none; padding: 0; margin-bottom: 28px; }\n    .tenant-view-list li {\n      display: flex; gap: 12px; align-items: flex-start;\n      padding: 10px 0; font-size: 15px; color: var(--text); font-weight: 500;\n    }\n    .tenant-view-list li svg { width: 20px; height: 20px; color: var(--green); flex-shrink: 0; margin-top: 2px; }\n    .tenant-view-quote {\n      background: #fff; border-left: 4px solid var(--pink);\n      padding: 16px 20px; border-radius: 0 10px 10px 0;\n      font-size: 14px; color: var(--text-muted); font-style: italic;\n    }\n    .tenant-view-quote strong { color: var(--text); font-style: normal; font-weight: 700; }\n    .tenant-screens {\n      position: relative; display: flex; flex-direction: column;\n      justify-content: center; align-items: center;\n      gap: 18px; min-height: 480px;\n    }\n    .tenant-screen-phone {\n      background: #1a1f36; border-radius: 36px; padding: 10px;\n      box-shadow: 0 30px 80px rgba(26,31,54,0.25);\n      width: 260px;\n    }\n    .tenant-screen-inside {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      border-radius: 28px; padding: 26px 20px 20px;\n      color: #fff; position: relative; overflow: hidden;\n    }\n    .tenant-screen-inside::before {\n      content: \"\"; position: absolute; top: 14px; left: 50%; transform: translateX(-50%);\n      width: 80px; height: 18px; background: #1a1f36; border-radius: 12px;\n    }\n    .ts-header { text-align: center; margin-top: 14px; margin-bottom: 22px; }\n    .ts-logo {\n      width: 40px; height: 40px; margin: 0 auto 10px;\n      background: var(--pink); border-radius: 10px;\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; color: #fff;\n    }\n    .ts-brand { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }\n    .ts-card {\n      background: rgba(255,255,255,0.08);\n      border: 1px solid rgba(255,255,255,0.12);\n      border-radius: 14px; padding: 16px; margin-bottom: 12px;\n    }\n    .ts-card-head { font-size: 11px; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 6px; }\n    .ts-card-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }\n    .ts-card-sub { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px; }\n    .ts-btn {\n      display: block; width: 100%; text-align: center;\n      background: var(--pink); color: #fff;\n      padding: 12px; border-radius: 100px;\n      font-size: 13px; font-weight: 700;\n      margin-top: 10px;\n    }\n    .ts-list li {\n      display: flex; justify-content: space-between;\n      font-size: 12px; padding: 8px 0;\n      border-bottom: 1px solid rgba(255,255,255,0.1);\n      list-style: none;\n    }\n    .ts-list li:last-child { border-bottom: none; }\n    .ts-list li span:first-child { color: rgba(255,255,255,0.7); }\n    .ts-list li strong { color: #fff; font-weight: 700; }\n    .ts-footer {\n      text-align: center; font-size: 10px;\n      color: rgba(255,255,255,0.55); margin-top: 14px;\n      text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;\n    }\n    .tenant-screen-tag {\n      background: #fff; padding: 8px 14px; border-radius: 100px;\n      box-shadow: var(--shadow);\n      font-size: 12px; font-weight: 700; color: var(--text);\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    .tenant-screen-tag svg { width: 14px; height: 14px; color: var(--green); }\n    @media (max-width: 860px) {\n      .tenant-view-grid { grid-template-columns: 1fr; gap: 32px; }\n    }\n\n    /* ===== NEW features ===== */\n    .new-features {\n      background: linear-gradient(180deg, #fff 0%, var(--surface-alt) 100%);\n    }\n    .new-features-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;\n    }\n    .new-feature-card {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 28px;\n      transition: all .2s ease;\n    }\n    .new-feature-card:hover {\n      transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--blue);\n    }\n    .new-feature-visual {\n      aspect-ratio: 16/10; border-radius: var(--radius);\n      background: linear-gradient(135deg, var(--navy), var(--blue));\n      margin-bottom: 20px; display: flex; align-items: center; justify-content: center;\n    }\n    .new-feature-visual svg { width: 64px; height: 64px; color: rgba(255,255,255,0.9); }\n    .new-feature-card h3 { margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }\n    .new-feature-card p { font-size: 14px; margin-bottom: 16px; }\n    @media (max-width: 860px) { .new-features-grid { grid-template-columns: 1fr; } }\n\n    /* ===== Feature rows ===== */\n    .feature-rows { background: #fff; }\n    .feature-rows .section-head { margin-bottom: 80px; }\n    .feature-row {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center;\n      margin-bottom: 96px;\n    }\n    .feature-row:last-child { margin-bottom: 0; }\n    .feature-row.reverse .feature-row-copy { order: 2; }\n    .feature-row.reverse .feature-row-visual { order: 1; }\n    .feature-row h3 { font-size: 32px; margin-bottom: 14px; letter-spacing: -0.025em; }\n    .feature-row p { font-size: 16px; margin-bottom: 24px; max-width: 480px; }\n    .feature-row ul { list-style: none; padding: 0; margin-bottom: 28px; }\n    .feature-row li {\n      display: flex; gap: 12px; align-items: flex-start;\n      padding: 8px 0; font-size: 15px; color: var(--text); font-weight: 500;\n    }\n    .feature-row li svg { width: 20px; height: 20px; color: var(--green); flex-shrink: 0; margin-top: 1px; }\n    .feature-row-visual {\n      aspect-ratio: 4/3; border-radius: var(--radius-lg);\n      background: var(--surface-alt); border: 1px solid var(--border);\n      box-shadow: var(--shadow); padding: 24px; position: relative;\n    }\n    .fv-header { display: flex; gap: 6px; margin-bottom: 18px; }\n    .fv-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); }\n    .fv-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n    .fv-card {\n      background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 12px;\n    }\n    .fv-card-label { font-size: 10px; color: var(--text-faint); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }\n    .fv-card-val { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }\n    .fv-card-sub { font-size: 11px; color: var(--green); font-weight: 600; margin-top: 2px; }\n    .fv-chart {\n      margin-top: 14px; padding: 14px; background: #fff;\n      border: 1px solid var(--border); border-radius: 8px;\n      display: flex; align-items: flex-end; gap: 6px; height: 120px;\n    }\n    .fv-bar { flex: 1; background: var(--blue); border-radius: 4px 4px 0 0; }\n    @media (max-width: 860px) {\n      .feature-row { grid-template-columns: 1fr; gap: 32px; margin-bottom: 64px; }\n      .feature-row.reverse .feature-row-copy { order: 1; }\n      .feature-row.reverse .feature-row-visual { order: 2; }\n    }\n\n    /* ===== Founder story ===== */\n    .founder-story {\n      background: var(--navy);\n      color: #fff;\n      padding: 96px 0;\n    }\n    .founder-story-inner {\n      max-width: 820px; margin: 0 auto; text-align: center;\n    }\n    .founder-story h2 { color: #fff; margin-bottom: 28px; }\n    .founder-story-avatar {\n      width: 96px; height: 96px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--pink), var(--gold));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 800; font-size: 32px;\n      margin: 0 auto 24px;\n      border: 4px solid rgba(255,255,255,0.1);\n    }\n    .founder-story p {\n      color: rgba(255,255,255,0.85);\n      font-size: 18px; line-height: 1.7;\n      margin-bottom: 18px;\n    }\n    .founder-story-sig {\n      margin-top: 32px; font-size: 16px;\n      color: rgba(255,255,255,0.65);\n    }\n    .founder-story-sig strong { color: #fff; }\n\n    /* ===== Guarantee ===== */\n    .guarantee {\n      background: linear-gradient(180deg, #fff 0%, var(--surface-alt) 100%);\n    }\n    .guarantee-card {\n      max-width: 820px; margin: 0 auto; background: #fff;\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 56px 48px; text-align: center;\n      box-shadow: var(--shadow-lg);\n      position: relative; overflow: hidden;\n    }\n    .guarantee-card::before {\n      content: \"\"; position: absolute; top: 0; left: 0; right: 0;\n      height: 6px; background: linear-gradient(90deg, var(--blue), var(--pink));\n    }\n    .guarantee-icon {\n      width: 72px; height: 72px; margin: 0 auto 24px;\n      background: var(--blue-pale); border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--blue);\n    }\n    .guarantee-icon svg { width: 36px; height: 36px; }\n    .guarantee h2 { margin-bottom: 16px; }\n    .guarantee-lead { font-size: 20px; color: var(--text); margin-bottom: 16px; font-weight: 600; }\n    .guarantee-body { font-size: 16px; color: var(--text-muted); max-width: 660px; margin: 0 auto 28px; line-height: 1.65; }\n    .guarantee-highlight {\n      display: inline-block;\n      font-weight: 700;\n      color: var(--text);\n      padding: 0 6px 3px;\n      background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r3'><feTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='2' seed='11'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23F5A623' fill-opacity='0.5' filter='url(%23r3)'/></svg>\");\n      background-repeat: no-repeat;\n      background-position: 0 60%;\n      background-size: 100% 65%;\n    }\n    .guarantee-stack {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n      max-width: 640px; margin: 0 auto;\n    }\n    .guarantee-stack-item {\n      padding: 14px;\n      text-align: center;\n      background: var(--surface-alt);\n      border-radius: var(--radius);\n    }\n    .guarantee-stack-item strong {\n      display: block; color: var(--blue); font-size: 18px; font-weight: 800;\n    }\n    .guarantee-stack-item span {\n      font-size: 12px; color: var(--text-muted);\n    }\n    @media (max-width: 640px) { .guarantee-stack { grid-template-columns: 1fr; } }\n\n    /* ===== 90 days timeline ===== */\n    .timeline {\n      background: #fff;\n    }\n    .timeline-grid {\n      display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px;\n      position: relative;\n    }\n    .timeline-grid::before {\n      content: \"\"; position: absolute; top: 40px; left: 10%; right: 10%;\n      height: 2px; background: linear-gradient(90deg, var(--blue), var(--pink));\n      z-index: 0;\n    }\n    .timeline-item {\n      position: relative; z-index: 1;\n      text-align: center; padding: 0 8px;\n    }\n    .timeline-marker {\n      width: 80px; height: 80px; margin: 0 auto 20px;\n      background: #fff; border: 3px solid var(--blue);\n      border-radius: 50%;\n      display: flex; align-items: center; justify-content: center;\n      color: var(--blue); font-weight: 800; font-size: 13px;\n      text-align: center; line-height: 1.1;\n      box-shadow: 0 0 0 6px rgba(18,81,173,0.06);\n    }\n    .timeline-item:last-child .timeline-marker {\n      border-color: var(--pink); color: var(--pink);\n      box-shadow: 0 0 0 6px rgba(255,73,152,0.1);\n    }\n    .timeline-item h4 {\n      font-size: 15px; color: var(--navy);\n      margin-bottom: 8px; font-weight: 700;\n    }\n    .timeline-item p {\n      font-size: 13px; line-height: 1.5;\n      color: var(--text-muted);\n    }\n    @media (max-width: 860px) {\n      .timeline-grid { grid-template-columns: 1fr; gap: 40px; }\n      .timeline-grid::before { display: none; }\n      .timeline-item { border-left: 2px solid var(--blue); padding-left: 24px; text-align: left; }\n      .timeline-marker { margin: 0 0 12px 0; }\n    }\n\n    /* ===== Math / Anchor ===== */\n    .math { background: #fff; }\n    .math-compare {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;\n      max-width: 960px; margin: 0 auto 40px;\n    }\n    .math-col {\n      border-radius: var(--radius-xl); padding: 36px 32px;\n      display: flex; flex-direction: column;\n    }\n    .math-col-before {\n      background: var(--surface-alt);\n      border: 1px solid var(--border);\n    }\n    .math-col-after {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      color: #fff; position: relative;\n      box-shadow: 0 20px 60px rgba(18,81,173,0.2);\n    }\n    .math-col-after::before {\n      content: \"WINNER\"; position: absolute; top: -12px; right: 24px;\n      background: var(--pink); color: #fff; padding: 6px 14px;\n      border-radius: 100px; font-size: 11px; font-weight: 800;\n      letter-spacing: 0.12em;\n    }\n    .math-col h3 {\n      font-size: 14px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.14em;\n      margin-bottom: 20px;\n    }\n    .math-col-before h3 { color: var(--red); }\n    .math-col-after h3 { color: var(--pink); }\n    .math-col ul {\n      list-style: none; padding: 0; flex: 1;\n      display: flex; flex-direction: column; gap: 10px;\n      margin-bottom: 28px;\n    }\n    .math-col-before li {\n      display: grid; grid-template-columns: 1fr auto; gap: 12px;\n      font-size: 14px; color: var(--text-muted);\n      padding-bottom: 10px; border-bottom: 1px solid var(--border);\n    }\n    .math-col-before li:last-child { border-bottom: none; }\n    .math-col-before li span:last-child {\n      font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums;\n    }\n    .math-col-after li {\n      display: flex; gap: 10px; align-items: flex-start;\n      font-size: 14px; color: rgba(255,255,255,0.85);\n      padding: 4px 0;\n    }\n    .math-col-after li svg {\n      width: 18px; height: 18px; color: var(--pink); flex-shrink: 0; margin-top: 2px;\n    }\n    .math-total {\n      padding: 20px 0; border-top: 2px solid;\n      font-size: 18px; font-weight: 700;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .math-col-before .math-total { border-color: var(--red); color: var(--red); }\n    .math-col-after .math-total { border-color: rgba(255,255,255,0.2); color: #fff; }\n    .math-total-num { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }\n    .math-total-num small { font-size: 50%; font-weight: 600; opacity: 0.7; }\n\n    .math-savings {\n      text-align: center; max-width: 760px; margin: 0 auto;\n      padding: 48px; background: linear-gradient(135deg, rgba(245,166,35,0.08), rgba(255,73,152,0.1));\n      border: 1px dashed var(--gold); border-radius: var(--radius-xl);\n    }\n    .math-savings-label {\n      font-size: 13px; font-weight: 700; color: var(--gold);\n      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 12px;\n    }\n    .math-savings-number {\n      font-size: clamp(64px, 9vw, 112px); font-weight: 900;\n      letter-spacing: -0.04em; line-height: 1;\n      color: var(--navy); margin-bottom: 12px;\n    }\n    .math-savings-number small { font-size: 30%; font-weight: 700; color: var(--text-muted); }\n    .math-savings-sub {\n      font-size: 18px; color: var(--text);\n    }\n    .math-savings-sub strong {\n      color: var(--gold); font-weight: 800; font-size: 22px;\n    }\n    @media (max-width: 860px) {\n      .math-compare { grid-template-columns: 1fr; }\n    }\n\n    /* ===== Compare table ===== */\n    .compare { background: var(--surface-alt); }\n    .compare-wrap {\n      max-width: 1000px; margin: 0 auto;\n      background: #fff; border-radius: var(--radius-xl);\n      border: 1px solid var(--border); overflow: hidden;\n      box-shadow: var(--shadow);\n    }\n    .compare-table {\n      width: 100%; border-collapse: collapse;\n      font-size: 14px;\n    }\n    .compare-table thead th {\n      padding: 20px 16px; text-align: center;\n      font-size: 13px; font-weight: 700;\n      background: var(--surface-alt);\n      border-bottom: 1px solid var(--border);\n      color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .compare-table thead th:first-child {\n      text-align: left; color: var(--text-faint);\n    }\n    .compare-table thead th.us {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      color: #fff; position: relative;\n    }\n    .compare-table thead th.us::after {\n      content: \"BEST VALUE\"; position: absolute; top: 6px; left: 50%;\n      transform: translateX(-50%); font-size: 9px; color: var(--pink);\n      letter-spacing: 0.14em; font-weight: 800;\n    }\n    .compare-table tbody td {\n      padding: 14px 16px; text-align: center;\n      border-bottom: 1px solid var(--border);\n      color: var(--text);\n    }\n    .compare-table tbody td:first-child {\n      text-align: left; color: var(--text);\n      font-weight: 600;\n    }\n    .compare-table tbody tr:last-child td { border-bottom: none; }\n    .compare-table .yes { color: var(--green); font-weight: 700; }\n    .compare-table .no { color: var(--red); opacity: 0.6; }\n    .compare-table .us-col { background: rgba(18,81,173,0.03); }\n    .compare-table tfoot td {\n      padding: 18px 16px; background: var(--surface-alt);\n      font-weight: 700; font-size: 15px;\n      text-align: center; color: var(--text);\n    }\n    .compare-table tfoot td:first-child { text-align: left; color: var(--text-faint); text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }\n    .compare-table tfoot td.us-price { background: var(--navy); color: #fff; font-size: 20px; letter-spacing: -0.02em; }\n    @media (max-width: 720px) {\n      .compare-table { font-size: 12px; }\n      .compare-table thead th, .compare-table tbody td, .compare-table tfoot td { padding: 10px 8px; }\n    }\n\n    /* ===== Pricing ===== */\n    .pricing { background: var(--surface-alt); }\n    .price-toggle {\n      display: inline-flex; background: #fff;\n      border: 1px solid var(--border); border-radius: 100px;\n      padding: 4px; margin-bottom: 16px;\n    }\n    .price-toggle button {\n      padding: 10px 24px; border-radius: 100px;\n      font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all .2s ease;\n    }\n    .price-toggle button.active { background: var(--navy); color: #fff; }\n    .price-save-badge {\n      display: inline-block; background: var(--pink-bg); color: var(--pink);\n      padding: 4px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700;\n      text-transform: uppercase; letter-spacing: 0.08em;\n      margin-left: 10px; vertical-align: middle;\n    }\n    .price-controls { text-align: center; margin-bottom: 48px; }\n    .pricing-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n      align-items: stretch;\n    }\n    .price-card {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px 22px;\n      position: relative; display: flex; flex-direction: column;\n    }\n    .price-card.featured {\n      border: 2px solid var(--blue);\n      box-shadow: 0 24px 60px rgba(18,81,173,0.18);\n      transform: translateY(-8px);\n    }\n    .price-card.enterprise {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      color: #fff;\n      border: 1px solid rgba(255,255,255,0.12);\n    }\n    .price-card.enterprise .price-name { color: var(--gold); }\n    .price-card.enterprise .price-tag .amt { color: #fff; }\n    .price-card.enterprise .price-tag .per { color: rgba(255,255,255,0.7); }\n    .price-card.enterprise .price-anchor,\n    .price-card.enterprise .price-tagline,\n    .price-card.enterprise .price-billing { color: rgba(255,255,255,0.75); }\n    .price-card.enterprise .price-features-head { color: rgba(255,255,255,0.55); }\n    .price-card.enterprise .price-features li { color: rgba(255,255,255,0.92); }\n    .price-card.enterprise .price-features li strong { color: var(--gold); }\n    .price-card.enterprise .price-features li svg { color: var(--gold); }\n    .price-badge {\n      position: absolute; top: -14px; left: 50%; transform: translateX(-50%);\n      background: var(--blue); color: #fff; padding: 7px 16px;\n      border-radius: 100px; font-size: 12px; font-weight: 700;\n      letter-spacing: 0.08em; text-transform: uppercase;\n    }\n    .price-name {\n      font-size: 13px; font-weight: 700; color: var(--navy);\n      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;\n    }\n    .price-tag { margin-bottom: 8px; display: flex; align-items: baseline; gap: 6px; }\n    .price-tag .amt { font-size: 42px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1; }\n    .price-tag .per { font-size: 15px; color: var(--text-muted); font-weight: 500; }\n    .price-anchor { font-size: 13px; color: var(--text-faint); margin-bottom: 8px; }\n    .price-anchor strike { color: var(--text-faint); }\n    .price-anchor strong { color: var(--gold); font-weight: 700; }\n    .price-billing {\n      font-size: 12px; color: var(--text-faint);\n      margin-bottom: 8px; min-height: 18px;\n      font-weight: 500;\n    }\n    .price-billing strong { color: var(--green); font-weight: 700; }\n    .billing-monthly { display: none; }\n    body.yearly .billing-yearly { display: inline; }\n    body.yearly .billing-monthly { display: none; }\n    body.monthly .billing-monthly { display: inline; }\n    body.monthly .billing-yearly { display: none; }\n    .price-was {\n      display: block;\n      font-size: 13px; color: var(--text-faint);\n      font-weight: 500;\n      margin-bottom: 2px;\n      text-decoration: line-through;\n      line-height: 1;\n    }\n    .price-tagline { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; min-height: 40px; }\n    .price-cta { margin-bottom: 28px; }\n    .price-cta .btn { width: 100%; }\n    .price-features-head {\n      font-size: 12px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;\n    }\n    .price-features {\n      list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;\n    }\n    .price-features li {\n      display: flex; align-items: flex-start; gap: 10px;\n      font-size: 14px; color: var(--text);\n    }\n    .price-features li svg { width: 16px; height: 16px; color: var(--green); flex-shrink: 0; margin-top: 3px; }\n    .price-features li strong { font-weight: 700; color: var(--navy); }\n\n    .price-bonus {\n      margin-top: 24px; padding: 20px;\n      background: linear-gradient(135deg, rgba(245,166,35,0.08), rgba(255,73,152,0.08));\n      border: 1px dashed var(--gold); border-radius: var(--radius);\n    }\n    .price-bonus-head {\n      font-size: 11px; font-weight: 800; color: var(--gold);\n      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px;\n    }\n    .price-bonus ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }\n    .price-bonus li {\n      display: grid; grid-template-columns: 1fr auto; gap: 10px;\n      font-size: 13px; color: var(--text); align-items: start;\n    }\n    .price-bonus li strong { color: var(--text); font-weight: 600; }\n    .price-bonus li em {\n      font-style: normal; color: var(--gold); font-weight: 700;\n      font-size: 12px; white-space: nowrap;\n    }\n    .price-bonus-total {\n      margin-top: 14px; padding-top: 14px;\n      border-top: 1px dashed rgba(245,166,35,0.4);\n      display: flex; justify-content: space-between; font-size: 14px;\n    }\n    .price-bonus-total strong { color: var(--gold); font-weight: 800; font-size: 16px; }\n\n    .price-enterprise {\n      margin-top: 48px;\n      background: var(--navy-dark); color: #fff;\n      border-radius: var(--radius-xl); padding: 40px 48px;\n      display: flex; align-items: center; justify-content: space-between; gap: 24px;\n    }\n    .price-enterprise h3 { color: #fff; margin-bottom: 6px; }\n    .price-enterprise p { color: rgba(255,255,255,0.7); }\n    @media (max-width: 960px) {\n      .pricing-grid { grid-template-columns: 1fr; }\n      .price-card.featured { transform: none; }\n      .price-enterprise { flex-direction: column; text-align: center; }\n    }\n    @media (min-width: 700px) and (max-width: 1100px) {\n      .pricing-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }\n    }\n\n    /* ===== Support ===== */\n    .support { background: #fff; }\n    .support-grid {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;\n      margin-bottom: 48px;\n    }\n    .support-item {\n      text-align: center; padding: 24px;\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n    }\n    .support-item-icon {\n      width: 48px; height: 48px; margin: 0 auto 16px;\n      background: var(--blue-pale); color: var(--blue);\n      border-radius: 12px; display: flex; align-items: center; justify-content: center;\n    }\n    .support-item-icon svg { width: 24px; height: 24px; }\n    .support-item h4 { margin-bottom: 6px; font-weight: 600; font-size: 16px; }\n    .support-item p { font-size: 13px; }\n    @media (max-width: 860px) { .support-grid { grid-template-columns: 1fr 1fr; } }\n    @media (max-width: 520px) { .support-grid { grid-template-columns: 1fr; } }\n\n    /* ===== FAQ ===== */\n    .faq { background: var(--surface-alt); }\n    .faq-tabs {\n      display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; flex-wrap: wrap;\n    }\n    .faq-tab {\n      padding: 10px 20px; border-radius: 100px;\n      border: 1.5px solid var(--border); background: #fff;\n      color: var(--text); font-weight: 600; font-size: 14px;\n      transition: all .2s ease;\n    }\n    .faq-tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }\n    .faq-tab:not(.active):hover { border-color: var(--blue); color: var(--blue); }\n    .faq-panel { display: none; max-width: 820px; margin: 0 auto; }\n    .faq-panel.active { display: block; }\n    .faq-item {\n      border-bottom: 1px solid var(--border); padding: 20px 0;\n    }\n    .faq-q {\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; list-style: none;\n      font-weight: 600; font-size: 17px; color: var(--text);\n    }\n    .faq-q::-webkit-details-marker { display: none; }\n    .faq-icon {\n      width: 24px; height: 24px; flex-shrink: 0;\n      transition: transform .2s ease; color: var(--blue);\n    }\n    details[open] .faq-icon { transform: rotate(45deg); }\n    .faq-a { margin-top: 12px; color: var(--text-muted); font-size: 15px; line-height: 1.65; }\n    .faq-a strong { color: var(--text); }\n\n    /* ===== Lead magnet ===== */\n    .lead-magnet {\n      background: #fff;\n      padding: 88px 0;\n    }\n    .lead-magnet-card {\n      max-width: 920px; margin: 0 auto;\n      display: grid; grid-template-columns: 1fr 280px; gap: 48px;\n      align-items: center;\n      padding: 48px;\n      background: linear-gradient(135deg, var(--blue-pale) 0%, #fff 100%);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-xl);\n      box-shadow: var(--shadow);\n    }\n    .lead-magnet-tag {\n      display: inline-block; font-size: 11px; font-weight: 800;\n      color: var(--pink); letter-spacing: 0.14em;\n      text-transform: uppercase; margin-bottom: 10px;\n    }\n    .lead-magnet h2 { font-size: 28px; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; }\n    .lead-magnet p { font-size: 15px; margin-bottom: 20px; }\n    .lead-magnet-form { display: flex; gap: 8px; max-width: 460px; background: #fff; padding: 6px; border-radius: 100px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }\n    .lead-magnet-form input { flex: 1; border: none; outline: none; padding: 10px 18px; font-size: 14px; background: transparent; }\n    .lead-magnet-form button { background: var(--navy); color: #fff; padding: 10px 20px; border-radius: 100px; font-weight: 600; font-size: 13px; }\n    .lead-magnet-visual {\n      aspect-ratio: 3/4;\n      background: #fff;\n      border-radius: 10px;\n      border: 1px solid var(--border);\n      box-shadow: 0 20px 50px rgba(26,31,54,0.15);\n      padding: 20px;\n      display: flex; flex-direction: column;\n      transform: rotate(-3deg);\n      position: relative;\n    }\n    .lead-magnet-visual::before {\n      content: \"PDF\"; position: absolute; top: 12px; right: 12px;\n      background: var(--pink); color: #fff; font-size: 9px;\n      padding: 3px 7px; border-radius: 4px;\n      font-weight: 800; letter-spacing: 0.1em;\n    }\n    .lmv-head {\n      font-size: 9px; font-weight: 700; color: var(--text-faint);\n      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;\n    }\n    .lmv-title { font-size: 15px; font-weight: 800; color: var(--navy); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.01em; }\n    .lmv-rows {\n      display: flex; flex-direction: column; gap: 6px;\n      flex: 1;\n    }\n    .lmv-row {\n      display: flex; justify-content: space-between;\n      font-size: 10px; padding: 6px 0;\n      border-bottom: 1px dashed var(--border);\n    }\n    .lmv-row span:first-child { color: var(--text-muted); }\n    .lmv-row strong { color: var(--text); font-weight: 700; }\n    .lmv-foot { margin-top: 10px; padding-top: 8px; border-top: 2px solid var(--navy); display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: var(--navy); }\n    @media (max-width: 720px) {\n      .lead-magnet-card { grid-template-columns: 1fr; padding: 32px 24px; }\n      .lead-magnet-visual { max-width: 220px; margin: 0 auto; }\n    }\n\n    /* ===== Final CTA ===== */\n    .final-cta {\n      background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);\n      color: #fff;\n      text-align: center; padding: 110px 0;\n    }\n    .final-cta h2 { color: #fff; max-width: 820px; margin: 0 auto 18px; }\n    .final-cta h2 u {\n      text-decoration: none;\n      display: inline-block;\n      padding: 0 6px 4px;\n      background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'><defs><filter id='r2'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='2' seed='7'/><feDisplacementMap in='SourceGraphic' scale='6'/></filter></defs><rect x='3' y='5' width='194' height='30' fill='%23FF4998' fill-opacity='0.55' filter='url(%23r2)'/></svg>\");\n      background-repeat: no-repeat;\n      background-position: 0 55%;\n      background-size: 100% 60%;\n    }\n    .final-cta .lead { color: rgba(255,255,255,0.8); max-width: 620px; margin: 0 auto 36px; }\n    .final-cta-form {\n      display: flex; gap: 8px; max-width: 520px; margin: 0 auto 24px;\n      background: #fff; padding: 6px; border-radius: 100px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.2);\n    }\n    .final-cta-form input {\n      flex: 1; border: none; outline: none;\n      padding: 12px 20px; font-size: 15px; color: var(--text);\n      background: transparent; min-width: 0;\n    }\n    .final-cta-form button {\n      background: var(--blue); color: #fff;\n      padding: 12px 24px; border-radius: 100px;\n      font-weight: 600; font-size: 14px;\n    }\n    .final-cta-chips {\n      display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;\n      margin-top: 20px;\n    }\n    .final-cta-chip {\n      display: inline-flex; align-items: center; gap: 8px;\n      font-size: 13px; color: rgba(255,255,255,0.8);\n    }\n    .final-cta-chip svg { width: 16px; height: 16px; color: var(--pink); }\n    @media (max-width: 520px) {\n      .final-cta-form { flex-direction: column; padding: 12px; border-radius: 16px; }\n      .final-cta-form input { text-align: center; }\n      .final-cta-form button { width: 100%; }\n    }\n\n    /* ===== Footer ===== */\n    .footer {\n      background: var(--navy-dark); color: rgba(255,255,255,0.65);\n      padding: 64px 0 32px; font-size: 14px;\n    }\n    .footer-grid {\n      display: grid;\n      grid-template-columns: 1.4fr repeat(4, 1fr);\n      gap: 40px; margin-bottom: 48px;\n    }\n    .footer-brand .logo { color: #fff; margin-bottom: 16px; }\n    .footer-brand .logo-mark { background: #fff; }\n    .footer-brand .logo-mark svg { color: var(--navy); }\n    .footer-brand p { color: rgba(255,255,255,0.55); max-width: 320px; margin-bottom: 16px; font-size: 14px; }\n    .footer-col h4 { color: #fff; font-size: 14px; margin-bottom: 16px; font-weight: 700; }\n    .footer-col ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }\n    .footer-col a:hover { color: #fff; }\n    .footer-bottom {\n      padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08);\n      display: flex; justify-content: space-between; align-items: center;\n      flex-wrap: wrap; gap: 16px;\n      color: rgba(255,255,255,0.4); font-size: 13px;\n    }\n    .footer-legal { display: flex; gap: 20px; flex-wrap: wrap; }\n    @media (max-width: 960px) {\n      .footer-grid { grid-template-columns: 1fr 1fr; }\n      .footer-brand { grid-column: 1 / -1; }\n    }\n\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <div className="top-bar">
    <strong>Founder pricing closes April 30 · 87 of 100 spots left:</strong>
    Lock Pro at $97/mo for life.
    <a href="#pricing">See the offer</a>
  </div>

  
  <nav className="nav">
    <div className="wrap nav-inner">
      <a href="#" className="logo">
        <span className="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
        </span>
        Black Bear Rentals
      </a>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="tools.html">Free tools</a>
        <a href="stories.html">Stories</a>
        <a href="pricing.html">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="nav-cta">
        <a href="onboarding.html" style={{fontSize: "14px", color: "var(--text)", fontWeight: "500"}}>Sign in</a>
        <a href="#hero-form" className="btn btn-primary" style={{padding: "10px 20px"}}>Get my time back</a>
      </div>
    </div>
  </nav>

  
  <section className="hero">
    <div className="wrap">
      <div className="hero-grid">
        <div>
          <span className="eyebrow">The Founders' Offer · 87 spots left</span>
          <h1>Run <em>30 doors</em> with the admin work of <u>5</u> — in 14 days, or we pay you <em>$100.</em></h1>
          <p className="lead">Black Bear Rentals replaces AppFolio, QuickBooks, DocuSign, and your bookkeeper — and gives you back <strong style={{color: "var(--text)"}}>12 hours a week.</strong> All on your own brand, for $97/mo.</p>
          <form id="hero-form" className="hero-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Get my time back</button>
          </form>
          <p className="hero-microcopy">14-day free trial. <strong>No credit card required.</strong> We import your data free. Live in 15 minutes.</p>
          <p className="hero-microcopy" style={{marginTop: "8px"}}>
            See examples on a branded subdomain:
            <a href="listings.html" target="_blank" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>listings</a>
            ·
            <a href="apply.html" target="_blank" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>apply</a>
            ·
            <a href="sign.html" target="_blank" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>sign lease</a>
            ·
            <a href="portal.html" target="_blank" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>tenant portal</a>
          </p>

          <div className="founder-block">
            <div className="founder-avatar">HC</div>
            <div className="founder-text">
              Built by <strong>Harrison Cooper</strong>, Alabama co-living operator running 15+ rooms.
              Black Bear Rentals is the software I wish existed when I started. Not built by a VC. Built by an operator.
            </div>
          </div>
        </div>

        <div className="device-stack">
          
          <div className="device-desktop">
            <div className="device-desktop-bar">
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="device-desktop-url">yourcompany.blackbear.app</span>
            </div>
            <div className="device-desktop-body">
              <div className="dd-stats">
                <div className="dd-stat"><div className="dd-stat-label">Collected</div><div className="dd-stat-val">$24,850</div><div className="dd-stat-delta">+12% MoM</div></div>
                <div className="dd-stat"><div className="dd-stat-label">Occupancy</div><div className="dd-stat-val">96%</div><div className="dd-stat-delta">22 / 23</div></div>
                <div className="dd-stat"><div className="dd-stat-label">Time saved</div><div className="dd-stat-val">13h</div><div className="dd-stat-delta">this week</div></div>
              </div>
              <div className="dd-rows">
                <div className="dd-row dd-row-head"><span>Tenant</span><span>Due</span><span>Status</span></div>
                <div className="dd-row"><span>Tenant · Room A</span><span>Apr 1</span><span className="pill pill-green">Paid</span></div>
                <div className="dd-row"><span>Tenant · Room B</span><span>Apr 1</span><span className="pill pill-green">Autopay</span></div>
                <div className="dd-row"><span>Tenant · Room C</span><span>Apr 1</span><span className="pill pill-red">2d late</span></div>
                <div className="dd-row"><span>Tenant · Room D</span><span>Apr 1</span><span className="pill pill-green">Paid</span></div>
              </div>
            </div>
          </div>

          
          <div className="device-phone">
            <div className="device-phone-screen">
              <div className="device-phone-notch" />
              <div className="dp-brand-top">Your Property Co.</div>
              <div className="dp-welcome">Hi, Alex 👋</div>
              <div className="dp-card">
                <div className="dp-card-label">Rent due Apr 1</div>
                <div className="dp-card-val">$1,200</div>
                <div className="dp-card-sub">Autopay on · no action needed</div>
                <a href="#" className="dp-btn">Pay now</a>
              </div>
              <div className="dp-card" style={{padding: "12px 14px"}}>
                <div className="dp-row"><span>Maintenance</span><strong>Open · 1</strong></div>
                <div className="dp-row"><span>Lease ends</span><strong>Aug 15</strong></div>
                <div className="dp-row"><span>Balance</span><strong>$0.00</strong></div>
              </div>
              <div className="dp-brand">yourcompany.com</div>
            </div>
          </div>

          
          <div className="device-overlay">
            <div className="device-overlay-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <div className="device-overlay-text">
              <strong>48 hrs/mo</strong>
              <span>back in your life</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="proof">
    <div className="wrap">
      <div className="proof-head">
        <span className="proof-eyebrow">Real operators. Real results.</span>
        <h2 style={{fontSize: "clamp(26px, 3vw, 36px)"}}>The proof is in the portfolios.</h2>
      </div>

      
      <div className="proof-stats">
        <div className="proof-stat">
          <div className="proof-stat-num">15+</div>
          <div className="proof-stat-label">Rooms managed in production</div>
        </div>
        <div className="proof-stat">
          <div className="proof-stat-num">12 hrs</div>
          <div className="proof-stat-label">Returned per week, per operator</div>
        </div>
        <div className="proof-stat">
          <div className="proof-stat-num">94%</div>
          <div className="proof-stat-label">On-time rent (vs. 67% manual)</div>
        </div>
        <div className="proof-stat">
          <div className="proof-stat-num">15 min</div>
          <div className="proof-stat-label">From sign-up to first rent run</div>
        </div>
      </div>

      <div className="testimonial-grid">

        
        <div className="testimonial featured">
          <span className="testimonial-case-badge">Case Study · Co-Living</span>
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-quote">
            "I was stitching AppFolio, QuickBooks, DocuSign, and a bookkeeper together — and still losing <strong>12 hours every week</strong> to admin. Built Black Bear Rentals in-house because nothing on the market handled per-room leases. Now I run 15+ rooms on autopilot and my banker gets a rent roll in one click."
          </p>
          <div className="testimonial-metrics">
            <div className="testimonial-metric">
              <div className="testimonial-metric-num">15+</div>
              <div className="testimonial-metric-label">Rooms</div>
            </div>
            <div className="testimonial-metric">
              <div className="testimonial-metric-num">$24.8K</div>
              <div className="testimonial-metric-label">Monthly</div>
            </div>
            <div className="testimonial-metric">
              <div className="testimonial-metric-num">48 hrs</div>
              <div className="testimonial-metric-label">Saved/mo</div>
            </div>
          </div>
          <div className="testimonial-foot">
            <div className="testimonial-avatar">HC</div>
            <div className="testimonial-foot-text">
              <strong>Harrison Cooper</strong>
              <span>Co-living operator · Huntsville, AL</span>
            </div>
          </div>
        </div>

        
        <div className="testimonial">
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-quote">
            "Moved off AppFolio in a weekend. My tenants don't even know — the portal has my logo, my colors, my domain. <strong>I look like a 50-unit shop</strong> running 8 doors."
          </p>
          <div className="testimonial-foot">
            <div className="testimonial-avatar" style={{background: "linear-gradient(135deg, var(--pink), var(--gold))"}}>—</div>
            <div className="testimonial-foot-text">
              <strong>Beta operator · SFR portfolio</strong>
              <span>Public quote coming soon</span>
            </div>
          </div>
        </div>

        
        <div className="testimonial">
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-quote">
            "My banker asked for a rent roll Friday at 4pm. I sent it at 4:01. Used to take me <strong>half a Saturday</strong> in Excel."
          </p>
          <div className="testimonial-foot">
            <div className="testimonial-avatar" style={{background: "linear-gradient(135deg, var(--green), var(--blue))"}}>—</div>
            <div className="testimonial-foot-text">
              <strong>Beta operator · Multifamily</strong>
              <span>Public quote coming soon</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  
  <section id="time-back" className="time-back">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow eyebrow-pink">What runs while you sleep</span>
        <h2>Here's what you're getting back.</h2>
        <p className="lead">12 automations. One dashboard. A full work week of your life back every month.</p>
      </div>

      <div className="time-back-grid">

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="time-back-card-text">Automated rent collection with retry</div>
          <div className="time-back-card-hours">2 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
          </div>
          <div className="time-back-card-text">Auto-generated rent roll PDFs for your banker</div>
          <div className="time-back-card-hours">1.5 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="m9 14 2 2 4-4" /></svg>
          </div>
          <div className="time-back-card-text">AI lease generation (state-specific)</div>
          <div className="time-back-card-hours">1 hr/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 11 3 3L22 4" /></svg>
          </div>
          <div className="time-back-card-text">AI application scoring + FCRA-compliant denials</div>
          <div className="time-back-card-hours">1 hr/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
          </div>
          <div className="time-back-card-text">Automated late fee processing</div>
          <div className="time-back-card-hours">1 hr/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>
          </div>
          <div className="time-back-card-text">Autopay enrollment + retry on failure</div>
          <div className="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6" /><path d="M9 21V12h6v9" /></svg>
          </div>
          <div className="time-back-card-text">Move-in chain: 5-step automation on lease exec</div>
          <div className="time-back-card-hours">1 hr/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div className="time-back-card-text">Automated SMS reminders to tenants</div>
          <div className="time-back-card-hours">1.5 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div className="time-back-card-text">One-click Schedule E + 1099 export</div>
          <div className="time-back-card-hours">1 hr/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 6-6" /></svg>
          </div>
          <div className="time-back-card-text">A/R aging reports (30/60/90+) auto-updated</div>
          <div className="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
          </div>
          <div className="time-back-card-text">Lease expiry alerts + renewal prompts (60-90d)</div>
          <div className="time-back-card-hours">0.5 hrs/wk</div>
        </div>

        <div className="time-back-card">
          <div className="time-back-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <div className="time-back-card-text">Security deposit reconciliation with state-rule alerts</div>
          <div className="time-back-card-hours">0.5 hrs/wk</div>
        </div>

      </div>

      <div className="time-back-total">
        <div className="time-back-total-label">That's</div>
        <div className="time-back-total-number"><span className="num">48</span><span className="unit">hrs/mo</span></div>
        <div className="time-back-total-sub"><strong>A full workweek back in your life.</strong> Every month. Forever.</div>
        <a href="#pricing" className="btn btn-white btn-lg">Show me the offer
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>

  
  <section className="problem">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">The reality today</span>
        <h2>Stop running your business like it's 2012.</h2>
        <p className="lead">You didn't sign up to be a data-entry clerk. Yet here you are, every week:</p>
      </div>
      <div className="problem-grid">
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Reconciling rent payments by hand in a spreadsheet.</div>
        </div>
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Chasing tenants for late payments, every single month.</div>
        </div>
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Building rent rolls for your banker in Excel.</div>
        </div>
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Re-typing tenant info across AppFolio, QuickBooks, and email.</div>
        </div>
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Losing a Saturday every January to year-end tax prep.</div>
        </div>
        <div className="problem-item">
          <div className="problem-x">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
          <div className="problem-item-text">Paying a bookkeeper $500/mo to do what software should.</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="portfolios">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Built for how you operate</span>
        <h2>Your portfolio is unique. Black Bear Rentals is built for it.</h2>
        <p className="lead">Whether you run a 4-bedroom co-living house or a 300-unit portfolio, Black Bear Rentals scales with your operation. Same software. Different superpowers.</p>
      </div>

      <div className="portfolio-tabs">
        <button className="portfolio-tab active" data-tab="coliving">Co-Living</button>
        <button className="portfolio-tab" data-tab="single">Single-Family</button>
        <button className="portfolio-tab" data-tab="multi">Multifamily</button>
        <button className="portfolio-tab" data-tab="student">Student Housing</button>
      </div>

      <div className="portfolio-panel active" data-panel="coliving">
        <div>
          <h3>Rent-by-the-bedroom, built in</h3>
          <p>Black Bear Rentals is one of the only PM platforms designed from day one to handle co-living. Per-room leases, shared utilities, individual rent schedules — without Frankensteining spreadsheets on top of AppFolio.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Per-room lease generation with auto-filled addendums</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Shared utility splits and prorations per tenant</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Room-level photos, pricing, and availability on listings</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Owner-occupied filtering across all reports</li>
          </ul>
        </div>
        <div className="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3z" /><path d="M3 9l9-6 9 6" /><path d="M9 21V12h6v9" /></svg>
        </div>
      </div>

      <div className="portfolio-panel" data-panel="single">
        <div>
          <h3>Single-family built for scale</h3>
          <p>From 5 doors to 500. Manage lease renewals, maintenance, and accounting from one dashboard. Give each tenant a branded portal that feels like they rent directly from you.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> One-click lease renewals with rent escalation</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Per-property P&amp;L and Schedule E exports</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Automated late fees with per-property overrides</li>
          </ul>
        </div>
        <div className="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v12H3z" /><path d="M3 9l9-6 9 6" /></svg>
        </div>
      </div>

      <div className="portfolio-panel" data-panel="multi">
        <div>
          <h3>Multifamily without the overhead</h3>
          <p>Enterprise-grade tools without the enterprise bill. Unit-level accounting, building-wide reporting, tenant portals for every door.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Building and unit-level financial drill-downs</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Bulk lease renewals and rent increases</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Maintenance ticketing with vendor + cost tracking</li>
          </ul>
        </div>
        <div className="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" /></svg>
        </div>
      </div>

      <div className="portfolio-panel" data-panel="student">
        <div>
          <h3>Student housing, simplified</h3>
          <p>Per-bedroom leases on academic-year cycles. Parent co-signers. Roommate matching. Black Bear Rentals handles the quirks of student housing without bolt-ons.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Academic-year lease terms with automated renewals</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Parent co-signer workflow with e-signature</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Move-out coordination for summer turn</li>
          </ul>
        </div>
        <div className="portfolio-visual">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5a8 8 0 0 0 12 0v-5" /></svg>
        </div>
      </div>
    </div>
  </section>

  
  <section className="tenant-view">
    <div className="wrap">
      <div className="tenant-view-grid">
        <div className="tenant-view-copy">
          <span className="eyebrow">What your tenants see</span>
          <h2>Your brand. Your domain. Zero "powered by."</h2>
          <p>Tenants log into a portal at <strong style={{color: "var(--text)"}}>yourcompany.com</strong> — not rentblackbear.com. Your logo, your colors, your voice. They pay you, message you, and submit maintenance to you. Black Bear Rentals stays invisible.</p>
          <ul className="tenant-view-list">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Custom subdomain + logo + brand color on Pro</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Bring your own domain (CNAME + SSL) on Scale</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Emails sent from <em>you@yourcompany.com</em></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> "Powered by Black Bear Rentals" removed on Scale</li>
          </ul>
          <div className="tenant-view-quote">
            "My tenants think I built the software myself. <strong>That's the whole point.</strong>"
            <div style={{marginTop: "6px", fontSize: "12px", color: "var(--text-faint)", fontStyle: "normal"}}>— Harrison Cooper, 15-room co-living operator</div>
          </div>
        </div>

        <div className="tenant-screens">
          <div className="tenant-screen-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            yourcompany.com
          </div>
          <div className="tenant-screen-phone">
            <div className="tenant-screen-inside">
              <div className="ts-header">
                <div className="ts-logo">Y</div>
                <div className="ts-brand">Your Property Co.</div>
              </div>
              <div className="ts-card">
                <div className="ts-card-head">Rent due · Apr 1</div>
                <div className="ts-card-val">$1,200.00</div>
                <div className="ts-card-sub">Autopay on · no action needed</div>
                <a href="#" className="ts-btn">Pay rent</a>
              </div>
              <div className="ts-card" style={{padding: "12px 16px"}}>
                <ul className="ts-list" style={{padding: "0", margin: "0"}}>
                  <li><span>Lease</span><strong>Aug 15, 2026</strong></li>
                  <li><span>Maintenance</span><strong>1 open</strong></li>
                  <li><span>Balance</span><strong>$0.00</strong></li>
                </ul>
              </div>
              <div className="ts-footer">Your Property Co.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="new-features">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Property management's future starts here</span>
        <h2>Three AI features that save 10+ hours a month.</h2>
      </div>
      <div className="new-features-grid">

        <div className="new-feature-card">
          <div className="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
          </div>
          <h3>AI Application Scoring <span className="new-pill">New</span></h3>
          <p>Our AI scores every application on income, credit, background, and references — then flags duplicates and high-risk applicants automatically. FCRA-compliant denials included.</p>
          <div className="hours-pill">Saves 4 hrs/mo</div>
        </div>

        <div className="new-feature-card">
          <div className="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="m9 14 2 2 4-4" /></svg>
          </div>
          <h3>AI Lease Generator <span className="new-pill">New</span></h3>
          <p>Generate state-specific, attorney-reviewed leases in under 60 seconds. 20-section template with your custom clauses, auto-filled from application data.</p>
          <div className="hours-pill">Saves 6 hrs/mo</div>
        </div>

        <div className="new-feature-card">
          <div className="new-feature-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          </div>
          <h3>Workflows <span className="new-pill">New</span></h3>
          <p>Automate move-in chains, renewal reminders, maintenance escalations, and rent collection cadences. Set it once — Black Bear Rentals runs the playbook every time.</p>
          <div className="hours-pill">Saves 8 hrs/mo</div>
        </div>
      </div>
    </div>
  </section>

  
  <section id="features" className="feature-rows">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">The stack you actually need</span>
        <h2>Everything you need. Nothing you don't.</h2>
      </div>

      <div className="feature-row">
        <div className="feature-row-copy">
          <div className="hours-pill" style={{marginBottom: "16px"}}>Saves 12 hrs/mo</div>
          <h3>Collect rent faster than ever</h3>
          <p>Automate rent and fee collection for reliably easy payments. Autopay, retry logic, and smart reminders — operators using autopay see on-time rates of 94%+ (vs. 67% industry average for manual collection*).</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Stripe-powered autopay with automatic retry on failed payments</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Automated late fees with per-operator configuration</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Rent goes directly to your bank — never through us</li>
          </ul>
        </div>
        <div className="feature-row-visual">
          <div className="fv-header"><span className="fv-dot" /><span className="fv-dot" /><span className="fv-dot" /></div>
          <div className="fv-cards">
            <div className="fv-card"><div className="fv-card-label">This month</div><div className="fv-card-val">$24,850</div><div className="fv-card-sub">+12% MoM</div></div>
            <div className="fv-card"><div className="fv-card-label">On-time rate</div><div className="fv-card-val">94%</div><div className="fv-card-sub">Founder portfolio, 2026</div></div>
          </div>
          <div className="fv-chart">
            <div className="fv-bar" style={{height: "30%", background: "var(--blue-pale)"}} />
            <div className="fv-bar" style={{height: "55%", background: "var(--blue-pale)"}} />
            <div className="fv-bar" style={{height: "40%", background: "var(--blue-pale)"}} />
            <div className="fv-bar" style={{height: "70%", background: "var(--blue)"}} />
            <div className="fv-bar" style={{height: "85%", background: "var(--blue)"}} />
            <div className="fv-bar" style={{height: "95%", background: "var(--navy)"}} />
          </div>
        </div>
      </div>

      <div className="feature-row reverse">
        <div className="feature-row-copy">
          <div className="hours-pill" style={{marginBottom: "16px"}}>Saves 8 hrs/mo</div>
          <h3>Accounting that feels effortless</h3>
          <p>Schedule E-ready from day one. Your banker's favorite report is one click away. Year-end tax package auto-generated every December.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Per-property P&amp;L with mortgage interest/principal separation</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> A/R aging (30/60/90+) and investor-grade rent roll PDFs</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 1099 vendor reports and QuickBooks CSV export built-in</li>
          </ul>
        </div>
        <div className="feature-row-visual">
          <div className="fv-header"><span className="fv-dot" /><span className="fv-dot" /><span className="fv-dot" /></div>
          <div className="fv-cards">
            <div className="fv-card"><div className="fv-card-label">YTD income</div><div className="fv-card-val">$298K</div><div className="fv-card-sub">Schedule E ready</div></div>
            <div className="fv-card"><div className="fv-card-label">Net operating</div><div className="fv-card-val">$142K</div><div className="fv-card-sub">47.6% margin</div></div>
          </div>
          <div className="fv-chart">
            <div className="fv-bar" style={{height: "40%"}} />
            <div className="fv-bar" style={{height: "50%"}} />
            <div className="fv-bar" style={{height: "65%"}} />
            <div className="fv-bar" style={{height: "55%"}} />
            <div className="fv-bar" style={{height: "75%"}} />
            <div className="fv-bar" style={{height: "90%"}} />
          </div>
        </div>
      </div>

      <div className="feature-row">
        <div className="feature-row-copy">
          <div className="hours-pill" style={{marginBottom: "16px"}}>Saves 6 hrs/mo</div>
          <h3>Maintenance made simple</h3>
          <p>Tenants submit tickets via their branded portal. You assign vendors, track costs, close the loop — all without leaving Black Bear Rentals. No more text-chain chaos or lost work orders.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Ticket pipeline: open → assigned → in-progress → completed</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Vendor directory with cost tracking and 1099 flagging</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Photo uploads, priority flags, tenant communication inline</li>
          </ul>
        </div>
        <div className="feature-row-visual">
          <div className="fv-header"><span className="fv-dot" /><span className="fv-dot" /><span className="fv-dot" /></div>
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <div style={{background: "#fff", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "4px"}}><strong>Leaky faucet — Room B</strong><span className="pill pill-red">Urgent</span></div>
              <div style={{color: "var(--text-muted)", fontSize: "12px"}}>Assigned to Joe's Plumbing · $180 est.</div>
            </div>
            <div style={{background: "#fff", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "4px"}}><strong>HVAC filter replacement</strong><span className="pill pill-green">Completed</span></div>
              <div style={{color: "var(--text-muted)", fontSize: "12px"}}>Acme HVAC · $45 actual</div>
            </div>
            <div style={{background: "#fff", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "4px"}}><strong>Garage door spring</strong><span className="pill" style={{background: "rgba(245,166,35,0.12)", color: "var(--gold)"}}>In progress</span></div>
              <div style={{color: "var(--text-muted)", fontSize: "12px"}}>Scheduled Apr 14</div>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-row reverse">
        <div className="feature-row-copy">
          <div className="hours-pill" style={{marginBottom: "16px"}}>Saves 4 hrs/mo</div>
          <h3>Tenant screening done right</h3>
          <p>FCRA-compliant scoring in under 2 minutes. Background check, credit pull, income verification, and reference outreach — all in one workflow.</p>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Income/credit/background/references scored out of 100 points</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Automatic duplicate application detection</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> FCRA-compliant adverse action notices auto-generated</li>
          </ul>
        </div>
        <div className="feature-row-visual">
          <div className="fv-header"><span className="fv-dot" /><span className="fv-dot" /><span className="fv-dot" /></div>
          <div style={{background: "#fff", padding: "20px", border: "1px solid var(--border)", borderRadius: "10px"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
              <div>
                <div style={{fontWeight: "700", color: "var(--text)"}}>Sarah Chen</div>
                <div style={{fontSize: "12px", color: "var(--text-muted)"}}>Applied for 142 Oak St, Room A</div>
              </div>
              <div style={{fontSize: "32px", fontWeight: "800", color: "var(--green)"}}>92</div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}><span>Income ratio</span><strong style={{color: "var(--green)"}}>28/30</strong></div>
              <div style={{display: "flex", justifyContent: "space-between"}}><span>Credit score</span><strong style={{color: "var(--green)"}}>24/25</strong></div>
              <div style={{display: "flex", justifyContent: "space-between"}}><span>Background</span><strong style={{color: "var(--green)"}}>25/25</strong></div>
              <div style={{display: "flex", justifyContent: "space-between"}}><span>References</span><strong style={{color: "var(--green)"}}>15/20</strong></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  
  <section className="founder-story">
    <div className="wrap">
      <div className="founder-story-inner">
        <div className="founder-story-avatar">HC</div>
        <span className="eyebrow eyebrow-dark">Built by an operator, for operators</span>
        <h2>Why I built Black Bear Rentals.</h2>
        <p>I'm Harrison Cooper. I run a 15+ room co-living operation in Huntsville, Alabama.</p>
        <p>For three years I stitched AppFolio, QuickBooks, DocuSign, Google Sheets, and a bookkeeper together. Every week I lost 12 hours to admin work that software should have handled. Every quarter my banker asked for a rent roll and I'd lose half a Saturday building it.</p>
        <p>I built Black Bear Rentals because no existing PM software understood co-living, and the ones that came closest were either generic and ugly ($280/mo) or enterprise and bloated ($1,400/mo). Black Bear Rentals is the software I wish existed when I started. If you're an owner-operator running 5-100 units and you want your weekends back, let's talk.</p>
        <div className="founder-story-sig">— <strong>Harrison Cooper</strong>, Founder</div>
      </div>
    </div>
  </section>

  
  <section className="guarantee">
    <div className="wrap">
      <div className="guarantee-card">
        <div className="guarantee-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
        </div>
        <span className="eyebrow">The Black Bear Rentals Guarantee</span>
        <h2>If we don't save you 12 hours a week, we'll pay you $100.</h2>
        <p className="guarantee-body">Try Black Bear Rentals free for 14 days. No credit card. After 30 days as a paying customer, if Black Bear Rentals hasn't saved you at least 12 hours of work, email us. <span className="guarantee-highlight">Full refund — every dollar — plus $100 for your time.</span> We built this guarantee because we know what the software does. If you can't find 12 hours back in your month, something's broken — and we'll fix it or pay you.</p>
        <div className="guarantee-stack">
          <div className="guarantee-stack-item">
            <strong>14 days</strong>
            <span>Free trial, no card</span>
          </div>
          <div className="guarantee-stack-item">
            <strong>100%</strong>
            <span>Refund if we don't deliver</span>
          </div>
          <div className="guarantee-stack-item">
            <strong>+$100</strong>
            <span>Paid to you for your time</span>
          </div>
        </div>

        
        <div style={{marginTop: "36px", padding: "24px 28px", background: "var(--surface-alt)", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-lg)", maxWidth: "660px", marginLeft: "auto", marginRight: "auto", textAlign: "left"}}>
          <div style={{display: "flex", alignItems: "flex-start", gap: "16px"}}>
            <div style={{width: "36px", height: "36px", borderRadius: "50%", background: "var(--pink-bg)", color: "var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M3 12h18" /><path d="m10 5-7 7 7 7" /></svg>
            </div>
            <div>
              <div style={{fontSize: "13px", fontWeight: "800", color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px"}}>Plus: Reverse-Migration Guarantee</div>
              <div style={{color: "var(--text)", fontSize: "15px", lineHeight: "1.55"}}>
                Decide to leave? <strong>We'll migrate your data back to AppFolio, Buildium, or QuickBooks — for free.</strong> No exit fees. No data lock-in. Export everything as CSV or JSON in one click.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="timeline">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Life after Black Bear Rentals</span>
        <h2>Here's what your year looks like.</h2>
      </div>
      <div className="timeline-grid">
        <div className="timeline-item">
          <div className="timeline-marker">DAY 1</div>
          <h4>You're live.</h4>
          <p>Your subdomain is up. Tenants get a welcome email from you — not from us.</p>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker">DAY 14</div>
          <h4>Rent runs itself.</h4>
          <p>Autopay is on. Your bank balance grew this morning. You didn't lift a finger.</p>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker">DAY 30</div>
          <h4>Banker impressed.</h4>
          <p>She asks for a rent roll at 4pm. You send it at 4:01. One click.</p>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker">DAY 90</div>
          <h4>3 more units.</h4>
          <p>You added 3 doors to the portfolio. Admin load didn't change.</p>
        </div>
        <div className="timeline-item">
          <div className="timeline-marker">YR 1</div>
          <h4>3x the units.</h4>
          <p>Running 40 units with the admin load of 10. Took 4 weeks off last summer.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="math">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">The math</span>
        <h2>Before Black Bear Rentals vs. with Black Bear Rentals.</h2>
        <p className="lead">You've seen the hours. Here's the dollars.</p>
      </div>

      <div className="math-compare">

        <div className="math-col math-col-before">
          <h3>The old way</h3>
          <ul>
            <li><span>AppFolio or Buildium</span><span>$280/mo</span></li>
            <li><span>QuickBooks + bookkeeper</span><span>$590/mo</span></li>
            <li><span>DocuSign</span><span>$45/mo</span></li>
            <li><span>Squarespace or Wix website</span><span>$30/mo</span></li>
            <li><span>SMS service (Twilio/EZ Texting)</span><span>$50/mo</span></li>
            <li><span>Maintenance ticketing</span><span>$50/mo</span></li>
            <li><span>Rent roll + investor reports</span><span>$200/mo<small style={{display: "block", fontSize: "11px", fontWeight: "400", color: "var(--text-faint)"}}>(10 hrs of your time)</small></span></li>
          </ul>
          <div className="math-total">
            <span>Total</span>
            <span className="math-total-num">$1,245<small>/mo</small></span>
          </div>
        </div>

        <div className="math-col math-col-after">
          <h3>Black Bear Rentals Pro</h3>
          <ul>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Everything above — built in</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Your brand on every page</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Automations that save 48 hrs/mo</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> $4,250 in Founder bonuses — free</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> $100 refund if we don't deliver</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> $97/mo locked for life</li>
          </ul>
          <div className="math-total">
            <span>Total</span>
            <span className="math-total-num">$97<small>/mo</small></span>
          </div>
        </div>

      </div>

      <div className="math-savings">
        <div className="math-savings-label">Your savings as a Founder</div>
        <div className="math-savings-number">$1,148<small>/month</small></div>
        <div className="math-savings-sub">That's <strong>$13,776 a year.</strong> Every year. For as long as you run your business.</div>
      </div>
    </div>
  </section>

  
  <section id="compare-table" className="compare">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">How we stack up</span>
        <h2>Black Bear Rentals vs. the legacy options.</h2>
        <p className="lead">Same jobs done. Half the price. Built for how you actually operate.</p>
      </div>
      <div className="compare-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Capability</th>
              <th className="us">Black Bear Rentals</th>
              <th>AppFolio</th>
              <th>Buildium</th>
              <th>DoorLoop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Per-room / co-living leases</td>
              <td className="us-col yes">✓ Native</td>
              <td className="no">—</td>
              <td className="no">—</td>
              <td className="no">—</td>
            </tr>
            <tr>
              <td>Your own brand + domain</td>
              <td className="us-col yes">✓ Included</td>
              <td className="no">—</td>
              <td className="no">—</td>
              <td>Add-on</td>
            </tr>
            <tr>
              <td>Free data migration</td>
              <td className="us-col yes">✓ Done-for-you</td>
              <td className="no">—</td>
              <td>DIY</td>
              <td className="yes">✓</td>
            </tr>
            <tr>
              <td>Setup minimum</td>
              <td className="us-col yes">15 min</td>
              <td>2-4 weeks</td>
              <td>1-2 weeks</td>
              <td>1 week</td>
            </tr>
            <tr>
              <td>Unit minimum</td>
              <td className="us-col yes">None</td>
              <td>50 units</td>
              <td>None</td>
              <td>None</td>
            </tr>
            <tr>
              <td>AI lease generation</td>
              <td className="us-col yes">✓ Included</td>
              <td className="no">—</td>
              <td className="no">—</td>
              <td className="no">—</td>
            </tr>
            <tr>
              <td>Money-back guarantee</td>
              <td className="us-col yes">✓ + $100</td>
              <td className="no">—</td>
              <td className="no">—</td>
              <td>30-day</td>
            </tr>
            <tr>
              <td>Contract length</td>
              <td className="us-col yes">Month-to-month</td>
              <td>1-year min</td>
              <td>Month-to-month</td>
              <td>Annual</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Starting price</td>
              <td className="us-price">$97/mo</td>
              <td>$280/mo</td>
              <td>$58/mo*</td>
              <td>$59/mo*</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p style={{textAlign: "center", fontSize: "12px", color: "var(--text-faint)", marginTop: "16px", maxWidth: "780px", marginLeft: "auto", marginRight: "auto"}}>
        * Buildium/DoorLoop starting prices exclude add-ons typically required for lease docs, SMS, and accounting. Comparison reflects publicly listed pricing as of April 2026.
      </p>
    </div>
  </section>

  
  <section id="pricing" className="pricing">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">The Founders' Offer · 87 spots left</span>
        <h2>Stop paying for five tools. Pay for one.</h2>
        <p className="lead">14-day free trial. No credit card required. Cancel anytime. Lock $97/mo for life as a Founder.</p>
      </div>

      <div className="price-controls">
        <div className="price-toggle">
          <button data-period="monthly">Monthly</button>
          <button className="active" data-period="yearly">Yearly</button>
        </div>
        <span className="price-save-badge">2 months free on yearly</span>
      </div>

      <div className="pricing-grid">

        <div className="price-card">
          <div className="price-name">Starter</div>
          <span className="price-was" style={{visibility: "hidden"}}>spacer</span>
          <div className="price-tag"><span className="amt" data-monthly="$47" data-yearly="$37">$37</span><span className="per">/mo</span></div>
          <div className="price-billing">
            <span className="billing-yearly"><strong>$444</strong> billed annually · save $120/yr</span>
            <span className="billing-monthly">Billed monthly</span>
          </div>
          <div className="price-anchor">For landlords leaving spreadsheets behind.</div>
          <div className="price-tagline">The step up from TurboTenant and RentRedi.</div>
          <div className="price-cta"><a href="#hero-form" className="btn btn-ghost">Get organized this week</a></div>
          <div className="price-features-head">Starter plan includes:</div>
          <ul className="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Up to <strong>10 units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Application tracking + tenant portal</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Rent collection via Stripe</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Basic accounting + Schedule E export</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 1 generic lease template</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 1 team seat</li>
          </ul>
        </div>

        <div className="price-card featured">
          <span className="price-badge">Most Popular</span>
          <div className="price-name">Pro</div>
          <span className="price-was">Launch price $197/mo</span>
          <div className="price-tag"><span className="amt" data-monthly="$97" data-yearly="$77">$77</span><span className="per">/mo</span></div>
          <div className="price-billing">
            <span className="billing-yearly"><strong>$924</strong> billed annually · save $240/yr · locked for life</span>
            <span className="billing-monthly">Billed monthly · Founders locked for life</span>
          </div>
          <div className="price-anchor">Launch price <strike>$197/mo</strike>. <strong>Founders pay this rate forever.</strong></div>
          <div className="price-tagline">For owner-operators who want to look like a real company.</div>
          <div className="price-cta"><a href="#hero-form" className="btn btn-primary">Get my time back</a></div>
          <div className="price-features-head">Pro: Everything in Starter, and:</div>
          <ul className="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Up to <strong>50 units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>Your subdomain + logo + color</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Full Schedule E accounting + rent roll + 1099</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Unlimited AI-generated e-sign leases</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Autopay + automated late fees + retry</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> SMS reminders (500/mo)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> AI application scoring + FCRA denials</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 3 team seats</li>
          </ul>

          <div className="price-bonus">
            <div className="price-bonus-head">Plus, included free for Founders</div>
            <ul>
              <li><strong>Free AppFolio/Buildium data migration</strong> — done by our team<em>$500 value</em></li>
              <li><strong>AppFolio contract buyout</strong> — we pay up to $500 of your remaining contract<em>$500 value</em></li>
              <li><strong>30-min onboarding call</strong> with a real property manager<em>$300 value</em></li>
              <li><strong>State-specific custom lease template</strong> — attorney-reviewed<em>$750 value</em></li>
              <li><strong>Lifetime $97/mo price lock</strong> — even when launch price hits $197<em>$1,800 value</em></li>
              <li style={{background: "rgba(255,73,152,0.08)", margin: "4px -8px 0", padding: "10px 8px", borderRadius: "6px"}}><strong>48-HR SPEED BONUS:</strong> Sign up in next 48h, get 1 month of bookkeeping cleanup done for you<em>$400 value</em></li>
            </ul>
            <div className="price-bonus-total">
              <span>Total bonuses</span>
              <strong>$4,250 value — free</strong>
            </div>
          </div>
        </div>

        <div className="price-card">
          <div className="price-name">Scale</div>
          <span className="price-was">Launch price $497/mo</span>
          <div className="price-tag"><span className="amt" data-monthly="$297" data-yearly="$247">$247</span><span className="per">/mo</span></div>
          <div className="price-billing">
            <span className="billing-yearly"><strong>$2,964</strong> billed annually · save $600/yr</span>
            <span className="billing-monthly">Billed monthly</span>
          </div>
          <div className="price-anchor">Launch price <strike>$497/mo</strike>. <strong>Founders lock at $297/mo.</strong></div>
          <div className="price-tagline">For brand-forward PMs and multi-portfolio operators.</div>
          <div className="price-cta"><a href="#hero-form" className="btn btn-ghost">Launch my branded portal</a></div>
          <div className="price-features-head">Scale: Everything in Pro, and:</div>
          <ul className="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>Bring your own domain</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> "Powered by Black Bear Rentals" removed</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>Unlimited units</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Custom email from your domain</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> API access + webhooks</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Banker / investor portal</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Multi-LLC / multi-portfolio workspace</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> SMS reminders (2,000/mo)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 10 team seats</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Priority support, 4h response</li>
          </ul>

          <div className="price-bonus">
            <div className="price-bonus-head">Plus, included for Scale</div>
            <ul>
              <li><strong>White-glove onboarding</strong> — we set up your domain, SSL, and data in 48 hours<em>$1,500 value</em></li>
              <li><strong>Quarterly strategy call</strong> — 60 min with founder, 4x per year<em>$1,200 value</em></li>
              <li><strong>Dedicated Slack channel</strong> — direct line to engineering for feature requests<em>$600 value</em></li>
              <li><strong>Custom integration support</strong> — we'll help connect your CRM or bank<em>$900 value</em></li>
            </ul>
            <div className="price-bonus-total">
              <span>Total bonuses</span>
              <strong>$4,200 value — free</strong>
            </div>
          </div>
        </div>

        <div className="price-card enterprise">
          <div className="price-name">Enterprise</div>
          <span className="price-was" style={{visibility: "hidden"}}>spacer</span>
          <div className="price-tag"><span className="amt" data-monthly="$1,497" data-yearly="$1,497">$1,497</span><span className="per">/mo+</span></div>
          <div className="price-billing">
            <span>Custom pricing · annual contract</span>
          </div>
          <div className="price-anchor">Starts at $1,497/mo. Scales to 10,000+ units.</div>
          <div className="price-tagline">For franchises, multi-market PMs, and white-label resellers.</div>
          <div className="price-cta"><a href="mailto:sales@rentblackbear.com" className="btn btn-gold" style={{width: "100%"}}>Talk to sales</a></div>
          <div className="price-features-head">Enterprise: Everything in Scale, and:</div>
          <ul className="price-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>Multi-workspace</strong> (franchise / multi-market)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>SSO</strong> (Okta, Google Workspace, Azure AD)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Custom SLA with 99.99% uptime</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> <strong>Dedicated success manager</strong></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> White-label reseller rights</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Custom feature development</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> Unlimited seats + workspaces</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 1-hour support response</li>
          </ul>
        </div>

      </div>
      <p style={{textAlign: "center", marginTop: "28px", fontSize: "14px", color: "var(--text-muted)"}}>
        Want every feature side-by-side?
        <a href="pricing.html" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>Full comparison</a>
        ·
        <a href="vs-appfolio.html" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>vs AppFolio</a>
        ·
        <a href="vs-buildium.html" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>vs Buildium</a>
        ·
        <a href="vs-doorloop.html" style={{color: "var(--blue)", fontWeight: "600", textDecoration: "underline"}}>vs DoorLoop &rarr;</a>
      </p>
    </div>
  </section>

  
  <section className="support">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">Real humans, no bots</span>
        <h2>World-class support in minutes.</h2>
        <p className="lead">Our team is small, opinionated, and cares obsessively. You'll talk to a human who actually uses the software.</p>
      </div>
      <div className="support-grid">
        <div className="support-item">
          <div className="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h4>Unlimited support</h4>
          <p>No tiered pricing on support. Same response time for everyone.</p>
        </div>
        <div className="support-item">
          <div className="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <h4>60-sec video walkthroughs</h4>
          <p>Every feature has a quick tutorial. Search and go.</p>
        </div>
        <div className="support-item">
          <div className="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <h4>Free Zoom training</h4>
          <p>Book a 30-min call. A real PM walks you through setup.</p>
        </div>
        <div className="support-item">
          <div className="support-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          </div>
          <h4>Free data migration</h4>
          <p>Send your spreadsheet. We import everything for you.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section id="faq" className="faq">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">FAQ</span>
        <h2>Your questions, answered.</h2>
      </div>
      <div className="faq-tabs">
        <button className="faq-tab active" data-faq-tab="general">General</button>
        <button className="faq-tab" data-faq-tab="product">Product</button>
        <button className="faq-tab" data-faq-tab="support">Support &amp; billing</button>
      </div>

      <div className="faq-panel active" data-faq-panel="general">
        <details className="faq-item">
          <summary className="faq-q">How is Black Bear Rentals different from AppFolio or Buildium?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Black Bear Rentals is built for owner-operator PMs who want <strong>their own brand</strong> — not a generic portal that screams "we use AppFolio." Pro starts at $97/mo vs AppFolio's $298/mo minimum. And we support <strong>co-living / rent-by-the-bedroom</strong> natively, which AppFolio does not.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">Do I need a credit card to try it?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">No. 14-day free trial on every tier. No credit card required to start.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">What's the "Founders' Offer"?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">The first 100 PMs to join Black Bear Rentals Pro lock <strong>$99/mo for life</strong> — even when the launch price rises to $149/mo. Founders also get <strong>$4,250 in bonuses</strong> included free: free data migration ($500), AppFolio contract buyout up to $500, a 30-minute onboarding call ($300), state-specific custom lease template ($750), lifetime price lock ($1,800+ value), and — if you sign up in the next 48 hours — 1 month of bookkeeping cleanup ($400). 87 spots remain.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">Is there a contract?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">No contracts. Month-to-month on all tiers. Annual plans get 2 months free. Cancel anytime from your dashboard.</div>
        </details>
      </div>

      <div className="faq-panel" data-faq-panel="product">
        <details className="faq-item">
          <summary className="faq-q">Do I have to migrate my existing data?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">No lifting. Send us your tenant spreadsheet or give us read access to AppFolio, and we'll <strong>import everything for free</strong>. Takes us about a day.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">Can I use my own domain?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Yes, on Scale. Point a CNAME at our servers; we verify and provision an SSL cert automatically. Usually live within 15 minutes.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">What payment processor do you use?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Stripe. You connect your own Stripe account via Stripe Connect — rent goes <strong>directly to your bank</strong>, never through ours.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">Is my tenant data private?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Yes. Each workspace is isolated at the database level. We never share data across PMs, and we never sell tenant data.</div>
        </details>
      </div>

      <div className="faq-panel" data-faq-panel="support">
        <details className="faq-item">
          <summary className="faq-q">What happens if I cancel?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Access until the end of your billing period. Then we export everything as JSON. No data lock-in.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">What's your support response time?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Starter: 48h. Pro: 24h. Scale: 4h. Enterprise: 1h with a dedicated success manager.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">What's in the Black Bear Rentals Guarantee?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">If after 30 days as a paying customer Black Bear Rentals hasn't saved you 12 hours, email us. <strong>Full refund plus $100 for your time.</strong> No questions asked.</div>
        </details>
        <details className="faq-item">
          <summary className="faq-q">How does billing work for annual plans?<svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></summary>
          <div className="faq-a">Billed upfront with 2 months free (17% discount). Switch from monthly to annual anytime — we prorate the difference.</div>
        </details>
      </div>
    </div>
  </section>

  
  <section className="lead-magnet">
    <div className="wrap">
      <div className="lead-magnet-card">
        <div>
          <span className="lead-magnet-tag">Not ready to switch? Grab this instead.</span>
          <h2>The 1-Page Banker Rent Roll Template — free PDF.</h2>
          <p>The exact rent roll format real operators send to their lender to unlock the next deal. Steal the structure. Send it in Excel or print it. Yours in 10 seconds.</p>
          <form className="lead-magnet-form">
            <input type="email" placeholder="your@email.com" required />
            <button type="submit">Send it to me</button>
          </form>
          <p style={{fontSize: "12px", color: "var(--text-faint)", marginTop: "12px", marginBottom: "0"}}>No spam. Unsubscribe with one click. We use your email to send the PDF and 3 short operator emails — that's it.</p>
        </div>
        <div className="lead-magnet-visual">
          <div className="lmv-head">Rent Roll · Apr 2026</div>
          <div className="lmv-title">Your Property LLC</div>
          <div className="lmv-rows">
            <div className="lmv-row"><span>142 Oak St · A</span><strong>$950</strong></div>
            <div className="lmv-row"><span>142 Oak St · B</span><strong>$950</strong></div>
            <div className="lmv-row"><span>142 Oak St · C</span><strong>$975</strong></div>
            <div className="lmv-row"><span>88 Maple Ave · A</span><strong>$1,100</strong></div>
            <div className="lmv-row"><span>88 Maple Ave · B</span><strong>$1,100</strong></div>
            <div className="lmv-row"><span>410 Pine Rd · A</span><strong>$1,250</strong></div>
          </div>
          <div className="lmv-foot">
            <span>Monthly</span>
            <span>$24,850</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="final-cta">
    <div className="wrap">
      <span className="eyebrow eyebrow-pink">The Founders' Offer · 87 spots left</span>
      <h2>Get <u>12 hours a week</u> back. Starting today.</h2>
      <p className="lead">14-day trial. No credit card. $4,250 in bonuses included. $97/mo locked for life. Black Bear Rentals Guarantee: if we don't deliver, you get a full refund and $100 for your time.</p>
      <form className="final-cta-form">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Get my time back</button>
      </form>
      <div className="final-cta-chips">
        <span className="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          No credit card required
        </span>
        <span className="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          Live in 15 minutes
        </span>
        <span className="final-cta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          $100 if we don't deliver
        </span>
      </div>
    </div>
  </section>

  
  <footer className="footer">
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
            </span>
            Black Bear Rentals
          </a>
          <p>The property management platform for owner-operators who want their own brand. Built by an operator, for operators.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="pricing.html">Pricing</a></li>
            <li><a href="#time-back">Your time back</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Who it's for</h4>
          <ul>
            <li><a href="#">Co-living</a></li>
            <li><a href="#">Single-family</a></li>
            <li><a href="#">Multifamily</a></li>
            <li><a href="#">Student housing</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Help center</a></li>
            <li><a href="#compare-table">Compare us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Rental forms</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2026 Black Bear Rentals. Built by an operator in Huntsville, Alabama.</div>
        <div className="footer-legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="security.html">Security</a>
        </div>
      </div>
    </div>
  </footer>

  


    </>
  );
}
