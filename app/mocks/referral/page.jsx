"use client";

// Mock ported from ~/Desktop/tenantory/referral.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n    input { font-family: inherit; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 32px; text-align: center; max-width: 960px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 58px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 860px; margin: 0 auto 18px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 680px; margin: 0 auto 32px; line-height: 1.55;\n    }\n    .hero-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }\n\n    .hero-stats {\n      max-width: 860px; margin: 48px auto 0; padding: 0 16px;\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .hero-stat {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 18px; text-align: left;\n    }\n    .hero-stat-num { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); line-height: 1; margin-bottom: 6px; }\n    .hero-stat-num em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n    .hero-stat-lbl { font-size: 12.5px; color: var(--text-muted); line-height: 1.4; }\n\n    /* ===== Section shell ===== */\n    .section { max-width: 1200px; margin: 88px auto 0; padding: 0 32px; }\n    .section-head { text-align: center; margin-bottom: 40px; }\n    .section-eyebrow {\n      display: inline-block;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      color: var(--pink); margin-bottom: 10px;\n    }\n    .section-title { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; }\n    .section-sub { font-size: 16px; color: var(--text-muted); max-width: 620px; margin: 14px auto 0; }\n\n    /* ===== Steps ===== */\n    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; position: relative; }\n    .step {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px 26px;\n      position: relative; transition: all 0.2s ease;\n    }\n    .step:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n    .step-num {\n      position: absolute; top: -14px; left: 26px;\n      width: 32px; height: 32px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; font-weight: 800; font-size: 13px;\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 8px 22px rgba(255,73,152,0.3);\n    }\n    .step-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin: 16px 0 18px;\n    }\n    .step-icon svg { width: 22px; height: 22px; }\n    .step-title { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 8px; }\n    .step-desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }\n    .step-payout {\n      margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);\n      display: flex; justify-content: space-between; align-items: center;\n      font-size: 12.5px;\n    }\n    .step-payout span { color: var(--text-muted); }\n    .step-payout strong { color: var(--green-dark); font-weight: 800; }\n\n    /* ===== Programs split ===== */\n    .programs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }\n    .program {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px 32px;\n      display: flex; flex-direction: column; position: relative;\n      transition: all 0.2s ease;\n    }\n    .program:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }\n    .program.featured {\n      border: 2px solid var(--pink);\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);\n      box-shadow: 0 20px 60px rgba(255,73,152,0.14);\n    }\n    .program-ribbon {\n      position: absolute; top: -12px; left: 32px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; padding: 6px 14px; border-radius: 100px;\n      font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      box-shadow: 0 8px 22px rgba(255,73,152,0.4);\n    }\n    .program-kicker {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      color: var(--text-muted); margin-bottom: 10px;\n    }\n    .program-name { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .program-tag { font-size: 14px; color: var(--text-muted); margin-bottom: 22px; line-height: 1.5; }\n\n    .math {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n      margin-bottom: 22px;\n    }\n    .math-row {\n      display: flex; justify-content: space-between; align-items: baseline;\n      padding: 8px 0; font-size: 13.5px; color: var(--text-muted);\n    }\n    .math-row + .math-row { border-top: 1px solid var(--border); }\n    .math-row strong { color: var(--text); font-weight: 700; font-size: 14px; }\n    .math-row.total { padding-top: 12px; margin-top: 4px; border-top: 2px solid var(--border-strong); }\n    .math-row.total span { font-weight: 700; color: var(--text); font-size: 14px; }\n    .math-row.total strong { color: var(--pink); font-size: 18px; font-weight: 900; letter-spacing: -0.01em; }\n\n    .program-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }\n    .program-list li {\n      list-style: none; display: flex; align-items: flex-start; gap: 10px;\n      font-size: 13.5px; color: var(--text); line-height: 1.45;\n    }\n    .program-list li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;\n      color: var(--green-dark); padding: 2px;\n      background: var(--green-bg); border-radius: 50%;\n    }\n    .program-cta { margin-top: auto; display: flex; gap: 10px; flex-wrap: wrap; }\n    .program-cta .btn { flex: 1; justify-content: center; min-width: 140px; }\n\n    /* ===== Calculator ===== */\n    .calc-wrap { max-width: 900px; margin: 88px auto 0; padding: 0 32px; }\n    .calc {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 100%);\n      color: #fff; border-radius: var(--radius-xl); padding: 44px 44px;\n      position: relative; overflow: hidden;\n    }\n    .calc::before {\n      content: \"\"; position: absolute; top: -80px; right: -80px;\n      width: 320px; height: 320px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.35), transparent 70%);\n    }\n    .calc::after {\n      content: \"\"; position: absolute; bottom: -100px; left: -60px;\n      width: 280px; height: 280px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(22,101,216,0.3), transparent 70%);\n    }\n    .calc > * { position: relative; z-index: 1; }\n    .calc-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pink); margin-bottom: 10px; }\n    .calc h3 { font-size: clamp(22px, 3vw, 30px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 28px; line-height: 1.2; }\n    .calc h3 em { font-style: normal; color: var(--pink); }\n    .calc-grid {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;\n    }\n    .calc-slider-wrap { }\n    .calc-label {\n      display: flex; justify-content: space-between; align-items: baseline;\n      font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 12px; font-weight: 500;\n    }\n    .calc-label strong { color: #fff; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; }\n    .calc-slider {\n      width: 100%; -webkit-appearance: none; appearance: none;\n      height: 6px; border-radius: 100px;\n      background: rgba(255,255,255,0.15);\n      outline: none; cursor: pointer;\n    }\n    .calc-slider::-webkit-slider-thumb {\n      -webkit-appearance: none; appearance: none;\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--pink); border: 3px solid #fff;\n      box-shadow: 0 6px 18px rgba(255,73,152,0.5);\n      cursor: pointer;\n    }\n    .calc-slider::-moz-range-thumb {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--pink); border: 3px solid #fff;\n      box-shadow: 0 6px 18px rgba(255,73,152,0.5);\n      cursor: pointer;\n    }\n    .calc-ticks {\n      display: flex; justify-content: space-between;\n      font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 10px;\n    }\n    .calc-outputs {\n      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);\n      border-radius: var(--radius-lg); padding: 22px 24px;\n      backdrop-filter: blur(8px);\n    }\n    .calc-out-row {\n      display: flex; justify-content: space-between; align-items: baseline;\n      padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);\n      font-size: 13px; color: rgba(255,255,255,0.75);\n    }\n    .calc-out-row:last-child { border-bottom: none; padding-bottom: 0; }\n    .calc-out-row:first-child { padding-top: 0; }\n    .calc-out-row strong { color: #fff; font-weight: 800; font-size: 16px; letter-spacing: -0.01em; }\n    .calc-out-row.big strong { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: var(--pink); }\n    .calc-note { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 18px; line-height: 1.55; }\n\n    /* ===== Dashboard preview ===== */\n    .dash-wrap { max-width: 1100px; margin: 88px auto 0; padding: 0 32px; }\n    .dash-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-lg);\n    }\n    .dash-chrome {\n      display: flex; align-items: center; gap: 10px;\n      padding: 14px 20px; border-bottom: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .dash-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }\n    .dash-dot:nth-child(1) { background: #ff6b6b; }\n    .dash-dot:nth-child(2) { background: var(--gold); }\n    .dash-dot:nth-child(3) { background: var(--green); }\n    .dash-url {\n      margin-left: 12px; padding: 5px 12px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 12px; color: var(--text-muted);\n      display: flex; align-items: center; gap: 6px;\n    }\n    .dash-url svg { width: 11px; height: 11px; color: var(--green-dark); }\n    .dash-body { padding: 28px 32px; }\n    .dash-head {\n      display: flex; justify-content: space-between; align-items: flex-start;\n      margin-bottom: 24px; flex-wrap: wrap; gap: 16px;\n    }\n    .dash-head h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }\n    .dash-head-sub { font-size: 13px; color: var(--text-muted); }\n    .dash-link {\n      display: flex; align-items: center; gap: 8px;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 10px 14px;\n      font-size: 13px; font-family: 'SF Mono', 'Monaco', monospace; color: var(--text);\n      max-width: 360px; width: 100%;\n    }\n    .dash-link svg { width: 14px; height: 14px; color: var(--text-muted); flex-shrink: 0; }\n    .dash-link-url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .dash-link-copy {\n      padding: 4px 10px; border-radius: 6px;\n      background: var(--blue); color: #fff; font-size: 11px; font-weight: 700;\n      letter-spacing: 0.04em; text-transform: uppercase;\n    }\n\n    .dash-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }\n    .dash-tile {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px 18px;\n    }\n    .dash-tile-lbl { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }\n    .dash-tile-val { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }\n    .dash-tile-val.green { color: var(--green-dark); }\n    .dash-tile-val.pink { color: var(--pink); }\n\n    .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; }\n    .dash-table thead th {\n      text-align: left; padding: 10px 14px;\n      background: var(--surface-subtle);\n      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      text-transform: uppercase; letter-spacing: 0.08em;\n    }\n    .dash-table td { padding: 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }\n    .dash-table tr:last-child td { border-bottom: none; }\n    .dash-table td.right { text-align: right; }\n    .dash-name { display: flex; align-items: center; gap: 10px; }\n    .dash-ava {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; font-size: 12px; font-weight: 700;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .dash-ava.b { background: linear-gradient(135deg, #1ea97c, #138a60); }\n    .dash-ava.c { background: linear-gradient(135deg, #f5a623, #d68a13); }\n    .dash-ava.d { background: linear-gradient(135deg, #5a6478, #3d4656); }\n    .dash-name-main { font-weight: 600; color: var(--text); }\n    .dash-name-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 2px; }\n    .dash-pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      padding: 3px 10px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;\n    }\n    .dash-pill::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n    .pill-paid { background: var(--green-bg); color: var(--green-dark); }\n    .pill-signed { background: var(--blue-pale); color: var(--blue); }\n    .pill-pending { background: rgba(245,166,35,0.15); color: #a06a10; }\n    .pill-lost { background: rgba(214,69,69,0.1); color: var(--red); }\n    .dash-amt { font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .dash-amt.green { color: var(--green-dark); }\n    .dash-amt.muted { color: var(--text-faint); text-decoration: line-through; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 800px; margin: 88px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6;\n    }\n    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }\n    .faq-a strong { color: var(--text); }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 88px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    .signed-link-box {\n      max-width: 520px; margin: 24px auto 0;\n      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);\n      border-radius: var(--radius-lg); padding: 14px 16px;\n      display: flex; align-items: center; gap: 10px;\n      backdrop-filter: blur(8px);\n    }\n    .signed-link-box svg { width: 14px; height: 14px; color: rgba(255,255,255,0.7); flex-shrink: 0; }\n    .signed-link-box code { flex: 1; font-size: 13px; font-family: 'SF Mono', monospace; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .signed-link-box button {\n      padding: 6px 14px; border-radius: 100px;\n      background: #fff; color: var(--navy);\n      font-size: 12px; font-weight: 700;\n    }\n    .signed-link-box button:hover { background: var(--pink); color: #fff; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 24px; }\n      .hero-stats { grid-template-columns: 1fr; }\n      .section { padding: 0 16px; margin-top: 64px; }\n      .steps, .programs { grid-template-columns: 1fr; }\n      .calc-wrap { padding: 0 16px; margin-top: 64px; }\n      .calc { padding: 32px 24px; }\n      .calc-grid { grid-template-columns: 1fr; gap: 28px; }\n      .dash-wrap { padding: 0 16px; margin-top: 64px; }\n      .dash-body { padding: 20px 16px; }\n      .dash-tiles { grid-template-columns: repeat(2, 1fr); }\n      .dash-table { font-size: 12px; }\n      .dash-table thead { display: none; }\n      .dash-table tbody tr { display: block; padding: 12px 0; border-bottom: 1px solid var(--border); }\n      .dash-table tbody tr:last-child { border-bottom: none; }\n      .dash-table td { display: flex; justify-content: space-between; padding: 6px 4px; border: none; }\n      .dash-table td.right { text-align: right; }\n      .faq, .cta-bottom { margin-top: 64px; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <span className="tb-brand-name">Tenantory</span>
    </a>
    <nav className="tb-nav">
      <a className="tb-nav-item" href="landing.html">Home</a>
      <a className="tb-nav-item" href="pricing.html">Pricing</a>
      <a className="tb-nav-item active" href="referral.html">Refer &amp; earn</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3h4v4" /><path d="m21 3-7 7" /><circle cx="7" cy="17" r="4" /></svg>
      Double-sided $99 credit
    </div>
    <h1>Turn your REIA friends into <em>your first check.</em></h1>
    <p className="hero-sub">You already tell your PM buddies about the software that runs your portfolio. Now get paid for it. Refer another property manager to Tenantory Pro — you get a free month, they get a free month. No limit on how many you send.</p>
    <div className="hero-actions">
      <a className="btn btn-pink btn-lg" href="#programs">See the two programs
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="#calc">Calculate my payout</a>
    </div>

    <div className="hero-stats">
      <div className="hero-stat">
        <div className="hero-stat-num"><em>$99</em> each</div>
        <div className="hero-stat-lbl">Credit for you, discount for them. Both sides win on day one.</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num"><em>20%</em> recurring</div>
        <div className="hero-stat-lbl">Affiliate revenue share for creators, coaches &amp; REIA leaders with audiences.</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num"><em>No cap</em></div>
        <div className="hero-stat-lbl">Stack credit on top of your Founder price. Refer ten, pay nothing for a year.</div>
      </div>
    </div>
  </section>

  
  <section className="section" id="how">
    <div className="section-head">
      <div className="section-eyebrow">How it works</div>
      <h2 className="section-title">Three steps. Zero awkward pitching.</h2>
      <p className="section-sub">You're not cold-emailing strangers. You're sending a link to the PM who asked, "wait, what do you use for rent?"</p>
    </div>

    <div className="steps">
      <div className="step">
        <div className="step-num">1</div>
        <div className="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        </div>
        <div className="step-title">Grab your link</div>
        <div className="step-desc">Open your Tenantory admin, click <strong>Refer &amp; earn</strong>. Your unique link is there waiting. Copy it, text it, tweet it — whatever feels natural.</div>
        <div className="step-payout"><span>Takes</span><strong>~20 seconds</strong></div>
      </div>

      <div className="step">
        <div className="step-num">2</div>
        <div className="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
        </div>
        <div className="step-title">Share with a PM you respect</div>
        <div className="step-desc">The PM at your REIA meeting still wrestling with spreadsheets. The coach with fifty doors. The friend who just inherited a fourplex. One message, one link.</div>
        <div className="step-payout"><span>They get</span><strong>$99 off month one</strong></div>
      </div>

      <div className="step">
        <div className="step-num">3</div>
        <div className="step-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 12h.01" /><path d="M18 12h.01" /></svg>
        </div>
        <div className="step-title">They subscribe — you both get paid</div>
        <div className="step-desc">The moment they enter payment info for Tenantory Pro, $99 drops into your account as credit against next month's bill. They've already saved $99 on month one. Nobody lost.</div>
        <div className="step-payout"><span>You get</span><strong>$99 credit</strong></div>
      </div>
    </div>
  </section>

  
  <section className="section" id="programs">
    <div className="section-head">
      <div className="section-eyebrow">Two programs, same door</div>
      <h2 className="section-title">Pick the one that fits how you actually talk about Tenantory.</h2>
      <p className="section-sub">Sending a link to a friend is different from posting it to your 40,000 YouTube subs. We pay both — differently.</p>
    </div>

    <div className="programs">
      
      <div className="program featured">
        <div className="program-ribbon">Most common</div>
        <div className="program-kicker">For active customers</div>
        <div className="program-name">Customer Referral Program</div>
        <div className="program-tag">You pay Tenantory. Now Tenantory pays you. Every referral that signs up for Pro drops $99 in account credit — a free month, straight across.</div>

        <div className="math">
          <div className="math-row"><span>Your monthly credit per referral</span><strong>$99</strong></div>
          <div className="math-row"><span>Their first-month discount</span><strong>$99 off</strong></div>
          <div className="math-row"><span>Referrals per year (avg active customer)</span><strong>2–4</strong></div>
          <div className="math-row total"><span>You save</span><strong>$198 – $396 / yr</strong></div>
        </div>

        <ul className="program-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Unlimited referrals — stack credit indefinitely</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Credit applies to next invoice automatically</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Stacks with the $99 Founder price for life</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>No audience, portfolio, or follower count required</li>
        </ul>

        <div className="program-cta">
          <a className="btn btn-pink" href="onboarding.html">Grab my link
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="btn btn-ghost" href="#calc">Run the math</a>
        </div>
      </div>

      
      <div className="program">
        <div className="program-kicker">For creators &amp; coaches</div>
        <div className="program-name">Affiliate Program</div>
        <div className="program-tag">You've got a channel, a mastermind, a REIA, a newsletter. You send multiple PMs a month. Fine — 20% recurring on every Pro plan, for as long as they pay.</div>

        <div className="math">
          <div className="math-row"><span>Commission per Pro subscription</span><strong>20% / mo</strong></div>
          <div className="math-row"><span>Average Pro plan (Founder price)</span><strong>$99/mo</strong></div>
          <div className="math-row"><span>Average referred lifetime</span><strong>22 months</strong></div>
          <div className="math-row total"><span>Per referral (LTV)</span><strong>~$435</strong></div>
        </div>

        <ul className="program-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>20% recurring commission, paid monthly via Stripe</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Your referred PM still gets $99 off month one</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Custom coupon code, UTM tracking, dedicated landing page</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Light vetting: minimum 3 referrals/qtr or 5K audience</li>
        </ul>

        <div className="program-cta">
          <a className="btn btn-primary" href="mailto:affiliates@tenantory.com?subject=Tenantory%20Affiliate%20Application">Apply to affiliate
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="btn btn-ghost" href="mailto:affiliates@tenantory.com">Talk to us</a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="calc-wrap" id="calc">
    <div className="calc">
      <div className="calc-kicker">Run the numbers</div>
      <h3>If you refer <em id="calcCount">6</em> PMs this year, you pocket <em id="calcPayout">$594</em> in Tenantory credit.</h3>
      <div className="calc-grid">
        <div className="calc-slider-wrap">
          <div className="calc-label">
            <span>Referrals this year</span>
            <strong id="calcCountLbl">6</strong>
          </div>
          <input className="calc-slider" id="calcSlider" type="range" min="0" max="24" value="6" />
          <div className="calc-ticks">
            <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
          </div>
        </div>

        <div className="calc-outputs">
          <div className="calc-out-row"><span>Credit earned (customer)</span><strong id="outCredit">$594</strong></div>
          <div className="calc-out-row"><span>Free months on Pro ($99/mo)</span><strong id="outMonths">6 mo</strong></div>
          <div className="calc-out-row"><span>Affiliate LTV equivalent</span><strong id="outAff">~$2,613</strong></div>
          <div className="calc-out-row big"><span>You save</span><strong id="outBig">$594</strong></div>
        </div>
      </div>
      <div className="calc-note">Customer program caps at month-to-month credit — no cashback. Affiliate LTV is indicative based on 20% recurring × ~22 month average lifetime. Past performance of other referrers does not guarantee yours, but it's a decent anchor.</div>
    </div>
  </section>

  
  <section className="dash-wrap" id="dashboard">
    <div className="section-head">
      <div className="section-eyebrow">Inside the product</div>
      <h2 className="section-title">Your referral dashboard, front and center.</h2>
      <p className="section-sub">See who clicked, who signed up, who paid, and what's owed — same place you manage rent.</p>
    </div>

    <div className="dash-card">
      <div className="dash-chrome">
        <div className="dash-dot" /><div className="dash-dot" /><div className="dash-dot" />
        <div className="dash-url">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          app.tenantory.com/refer
        </div>
      </div>
      <div className="dash-body">
        <div className="dash-head">
          <div>
            <h3>Your referrals</h3>
            <div className="dash-head-sub">Track clicks, signups, and credit in real time.</div>
          </div>
          <div className="dash-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            <div className="dash-link-url">tenantory.com/r/marcus-bh83</div>
            <div className="dash-link-copy">Copy</div>
          </div>
        </div>

        <div className="dash-tiles">
          <div className="dash-tile"><div className="dash-tile-lbl">Clicks</div><div className="dash-tile-val">142</div></div>
          <div className="dash-tile"><div className="dash-tile-lbl">Signups</div><div className="dash-tile-val">11</div></div>
          <div className="dash-tile"><div className="dash-tile-lbl">Paid &amp; credited</div><div className="dash-tile-val green">7</div></div>
          <div className="dash-tile"><div className="dash-tile-lbl">Credit available</div><div className="dash-tile-val pink">$693</div></div>
        </div>

        <table className="dash-table">
          <thead>
            <tr>
              <th>Referral</th>
              <th>Status</th>
              <th>Date</th>
              <th className="right">Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="dash-name">
                  <div className="dash-ava">JR</div>
                  <div><div className="dash-name-main">Jordan Reyes</div><div className="dash-name-sub">Reyes Property Group · 24 doors</div></div>
                </div>
              </td>
              <td><span className="dash-pill pill-paid">Paid</span></td>
              <td>Apr 02, 2026</td>
              <td className="right"><span className="dash-amt green">+$99.00</span></td>
            </tr>
            <tr>
              <td>
                <div className="dash-name">
                  <div className="dash-ava b">SP</div>
                  <div><div className="dash-name-main">Samira Patel</div><div className="dash-name-sub">Cobalt Key Rentals · 9 doors</div></div>
                </div>
              </td>
              <td><span className="dash-pill pill-paid">Paid</span></td>
              <td>Mar 28, 2026</td>
              <td className="right"><span className="dash-amt green">+$99.00</span></td>
            </tr>
            <tr>
              <td>
                <div className="dash-name">
                  <div className="dash-ava c">DH</div>
                  <div><div className="dash-name-main">Derek Holloway</div><div className="dash-name-sub">Holloway &amp; Sons · 41 doors</div></div>
                </div>
              </td>
              <td><span className="dash-pill pill-signed">Signed</span></td>
              <td>Apr 11, 2026</td>
              <td className="right"><span className="dash-amt">Pending $99</span></td>
            </tr>
            <tr>
              <td>
                <div className="dash-name">
                  <div className="dash-ava d">KO</div>
                  <div><div className="dash-name-main">Kimi Okafor</div><div className="dash-name-sub">Okafor Collective · 6 doors</div></div>
                </div>
              </td>
              <td><span className="dash-pill pill-pending">Trial</span></td>
              <td>Apr 13, 2026</td>
              <td className="right"><span className="dash-amt" style={{color: "var(--text-faint)"}}>On trial — day 2/14</span></td>
            </tr>
            <tr>
              <td>
                <div className="dash-name">
                  <div className="dash-ava">LT</div>
                  <div><div className="dash-name-main">Lucas Tanaka</div><div className="dash-name-sub">North Loop PM · 18 doors</div></div>
                </div>
              </td>
              <td><span className="dash-pill pill-lost">Didn't convert</span></td>
              <td>Feb 19, 2026</td>
              <td className="right"><span className="dash-amt muted">$99.00</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  
  <section className="faq">
    <div className="section-head">
      <div className="section-eyebrow">Questions</div>
      <h2 className="section-title">Everything you were about to ask.</h2>
    </div>

    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">How do I get my referral link?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Sign in to Tenantory, open <strong>Refer &amp; earn</strong> from the sidebar. Your link is pre-generated — it looks like <strong>tenantory.com/r/your-handle</strong>. You can also grab a short social-ready version, a QR code for in-person REIA meetings, and email copy we've already written.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">When does the $99 credit actually hit?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">The moment your referred PM <strong>completes their first paid invoice</strong> on Tenantory Pro (usually right after the 14-day trial ends), $99 drops onto your account as credit against the next invoice. No waiting on clearing periods, no "qualification window." If you're already on Pro, it's a free month. If you refer 12 in a year, Tenantory costs you $0 that year.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">What if they cancel after a month? Do I lose the credit?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Customer referrals: <strong>no clawback</strong>. The credit is yours once they pay invoice one. For the Affiliate Program, commissions are paid monthly and naturally stop when the referred account churns — the lifetime earnings are just whatever the account lasted.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">Can I refer myself, a second LLC, or my cousin?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Self-referral (same payment method, same tax ID, same billing address) is blocked automatically. A separate LLC with separate billing, separate bank account, and a real PM operating it is fair game — that's a real customer, not a workaround. Your cousin is welcome, obviously.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">Tax implications — do I get a 1099?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Customer Referral credit is a <strong>discount against your invoice</strong>, not income — no 1099, no reporting needed. Affiliate commissions are cash payouts; we issue a <strong>1099-NEC</strong> if you cross $600 in a calendar year. Standard stuff. We're PMs, not CPAs — ask yours.</div>
      </div>

      <div className="faq-item">
        <button className="faq-q">How do I qualify for the affiliate program?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">We approve affiliates who either (a) have an audience of <strong>5,000+ real estate investors / PMs</strong> on any platform, or (b) run a REIA, mastermind, or coaching cohort, or (c) deliver <strong>3+ paid referrals per quarter</strong> via the customer program — at which point we upgrade you automatically. Email <strong>affiliates@tenantory.com</strong> with a quick intro; we reply inside 48 hours.</div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2 id="ctaHead">Your link is one click away.</h2>
      <p id="ctaCopy">Sign in, grab your link, send it to the PM at your next REIA meeting. That's the whole playbook.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" id="ctaPrimary" href="onboarding.html">Sign up to unlock referrals
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
      <div id="signedLinkBox" className="signed-link-box" style={{display: "none"}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        <code id="signedLinkUrl">tenantory.com/r/your-handle</code>
        <button id="copyBtn">Copy link</button>
      </div>
      <div className="cta-note">No cap on referrals. Double-sided reward. Credit applies automatically.</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="referral.html">Refer &amp; earn</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
