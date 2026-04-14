"use client";

// Mock ported from ~/Desktop/tenantory/for-sfr-investors.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 80px 32px 40px; text-align: center; max-width: 1100px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(38px, 5.2vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 960px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 720px; margin: 0 auto 32px; line-height: 1.6;\n    }\n    .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }\n    .hero-note { font-size: 12px; color: var(--text-faint); }\n    .hero-portrait {\n      max-width: 900px; margin: 56px auto 0;\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;\n    }\n    .hp-stat {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px; text-align: left;\n    }\n    .hp-stat-num {\n      font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); margin-bottom: 2px;\n    }\n    .hp-stat-num em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hp-stat-lbl { font-size: 12.5px; color: var(--text-muted); line-height: 1.45; }\n\n    /* ===== Section head ===== */\n    .section-head { text-align: center; margin-bottom: 44px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.6; }\n\n    /* ===== Problems ===== */\n    .problems { max-width: 1180px; margin: 96px auto 0; padding: 0 32px; }\n    .prob-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .prob-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px;\n      position: relative; overflow: hidden;\n      transition: all 0.2s ease;\n    }\n    .prob-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n    .prob-num {\n      font-size: 11px; font-weight: 800; color: var(--pink);\n      letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 14px;\n    }\n    .prob-card h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .prob-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }\n    .prob-tag {\n      display: inline-flex; margin-top: 14px;\n      font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;\n      background: var(--surface-alt); color: var(--text-muted);\n      letter-spacing: 0.04em;\n    }\n\n    /* ===== Feature cards ===== */\n    .features { max-width: 1180px; margin: 96px auto 0; padding: 0 32px; }\n    .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n    .feat-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px; transition: all 0.2s ease;\n    }\n    .feat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n    .feat-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center; margin-bottom: 16px;\n    }\n    .feat-icon svg { width: 22px; height: 22px; }\n    .feat-card.accent .feat-icon { background: var(--pink-bg); color: #c21a6a; }\n    .feat-card h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .feat-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }\n\n    /* ===== Mockup dashboard ===== */\n    .mockup-wrap { max-width: 1180px; margin: 96px auto 0; padding: 0 32px; }\n    .mockup {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-lg);\n    }\n    .mk-bar {\n      padding: 14px 20px; display: flex; align-items: center; gap: 10px;\n      background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n    }\n    .mk-dots { display: flex; gap: 6px; }\n    .mk-dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }\n    .mk-dots span:nth-child(1) { background: #ff5f57; }\n    .mk-dots span:nth-child(2) { background: #febc2e; }\n    .mk-dots span:nth-child(3) { background: #28c840; }\n    .mk-title { font-size: 13px; font-weight: 700; color: var(--text); margin-left: 8px; }\n    .mk-url { font-size: 12px; color: var(--text-faint); margin-left: auto; font-variant-numeric: tabular-nums; }\n\n    .mk-head {\n      padding: 22px 28px; display: grid; grid-template-columns: 1fr auto; gap: 16px;\n      align-items: end; border-bottom: 1px solid var(--border);\n    }\n    .mk-head h4 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }\n    .mk-head-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }\n    .mk-entity-pills { display: flex; gap: 6px; flex-wrap: wrap; }\n    .mk-pill {\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 12px; font-weight: 600; color: var(--text-muted);\n      border: 1px solid var(--border); background: var(--surface);\n    }\n    .mk-pill.on { background: var(--navy); color: #fff; border-color: var(--navy); }\n\n    .mk-kpis {\n      display: grid; grid-template-columns: repeat(4, 1fr);\n      border-bottom: 1px solid var(--border);\n    }\n    .mk-kpi {\n      padding: 20px 24px; border-right: 1px solid var(--border);\n    }\n    .mk-kpi:last-child { border-right: none; }\n    .mk-kpi-lbl { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }\n    .mk-kpi-val { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }\n    .mk-kpi-delta { font-size: 12px; font-weight: 600; margin-top: 4px; color: var(--green-dark); }\n    .mk-kpi-delta.red { color: var(--red); }\n\n    .mk-table-head, .mk-row {\n      display: grid;\n      grid-template-columns: 1.9fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr;\n      align-items: center;\n    }\n    .mk-table-head {\n      padding: 12px 28px; background: var(--surface-subtle); border-bottom: 1px solid var(--border);\n      font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;\n    }\n    .mk-row {\n      padding: 16px 28px; border-bottom: 1px solid var(--border); font-size: 14px;\n    }\n    .mk-row:last-child { border-bottom: none; }\n    .mk-row:nth-child(even) { background: var(--surface-subtle); }\n    .mk-addr { font-weight: 700; color: var(--text); }\n    .mk-addr small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n    .mk-num { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--text); }\n    .mk-chip {\n      display: inline-flex; align-items: center; justify-content: center;\n      font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px;\n      min-width: 56px;\n    }\n    .mk-chip.g { background: var(--green-bg); color: var(--green-dark); }\n    .mk-chip.y { background: rgba(245,166,35,0.14); color: #a86d0f; }\n    .mk-chip.r { background: rgba(214,69,69,0.12); color: var(--red); }\n    .mk-occ {\n      display: inline-flex; gap: 3px;\n    }\n    .mk-occ span {\n      width: 10px; height: 18px; border-radius: 2px; background: var(--border);\n    }\n    .mk-occ span.on { background: var(--green-dark); }\n\n    .mk-foot {\n      padding: 18px 28px; background: var(--surface-subtle);\n      display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted);\n    }\n    .mk-foot strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Stack comparison ===== */\n    .replaces { max-width: 1000px; margin: 96px auto 0; padding: 0 32px; }\n    .rep-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }\n    .rep-row {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px 18px;\n      display: flex; justify-content: space-between; align-items: center;\n    }\n    .rep-name { font-weight: 600; font-size: 14px; color: var(--text); }\n    .rep-name small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n    .rep-price { font-weight: 700; font-size: 16px; color: var(--text); font-variant-numeric: tabular-nums; }\n    .rep-total {\n      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;\n      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius-lg); padding: 26px 32px;\n    }\n    .rep-total-side { display: flex; flex-direction: column; gap: 2px; }\n    .rep-total-label { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; }\n    .rep-total-amount { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }\n    .rep-total-side.right .rep-total-amount { color: var(--green-dark); }\n    .rep-total-side.right .rep-total-label { color: var(--green-dark); }\n    .rep-total-arrow {\n      width: 44px; height: 44px; border-radius: 50%;\n      background: var(--surface); border: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: center; color: var(--blue);\n    }\n    .rep-total-arrow svg { width: 18px; height: 18px; }\n    .rep-total-after { font-size: 12px; color: var(--green-dark); font-weight: 600; margin-top: 4px; }\n\n    /* ===== Case study ===== */\n    .case { max-width: 1120px; margin: 96px auto 0; padding: 0 32px; }\n    .case-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 48px;\n      display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .case-card::before {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 280px; height: 280px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .case-card > * { position: relative; z-index: 1; }\n    .case-label {\n      font-size: 11px; font-weight: 800; color: var(--pink);\n      letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px;\n    }\n    .case-quote {\n      font-size: 22px; font-weight: 500; letter-spacing: -0.015em;\n      line-height: 1.45; margin-bottom: 22px; color: #fff;\n    }\n    .case-quote::before { content: \"\\201C\"; color: var(--pink); font-size: 36px; line-height: 0; vertical-align: -18px; margin-right: 4px; }\n    .case-quote::after { content: \"\\201D\"; color: var(--pink); font-size: 36px; line-height: 0; vertical-align: -18px; margin-left: 2px; }\n    .case-who { display: flex; align-items: center; gap: 14px; }\n    .case-avatar {\n      width: 52px; height: 52px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; font-weight: 800; font-size: 18px;\n      display: flex; align-items: center; justify-content: center;\n      letter-spacing: -0.02em;\n    }\n    .case-who-name { font-weight: 700; font-size: 15px; color: #fff; }\n    .case-who-role { font-size: 13px; color: rgba(255,255,255,0.7); }\n    .case-stats {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;\n    }\n    .case-stat {\n      background: rgba(255,255,255,0.06);\n      border: 1px solid rgba(255,255,255,0.12);\n      border-radius: var(--radius-lg); padding: 20px;\n    }\n    .case-stat-lbl {\n      font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6);\n      letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px;\n    }\n    .case-stat-val {\n      font-size: 28px; font-weight: 800; letter-spacing: -0.03em; color: #fff;\n      font-variant-numeric: tabular-nums;\n    }\n    .case-stat-val em {\n      font-style: normal;\n      background: linear-gradient(135deg, #8fd4ff, var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .case-stat-sub { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; }\n\n    /* ===== Pricing callout ===== */\n    .pricing-cta { max-width: 1100px; margin: 96px auto 0; padding: 0 32px; }\n    .pc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n    .pc-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px 28px;\n      position: relative; transition: all 0.2s ease;\n    }\n    .pc-card.featured {\n      border: 2px solid var(--pink);\n      background: linear-gradient(180deg, #fff 0%, rgba(255,73,152,0.03) 100%);\n      box-shadow: 0 20px 60px rgba(255,73,152,0.16);\n    }\n    .pc-ribbon {\n      position: absolute; top: -14px; left: 24px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      color: #fff; padding: 6px 16px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;\n      box-shadow: 0 8px 22px rgba(255,73,152,0.4);\n    }\n    .pc-name { font-weight: 800; font-size: 16px; color: var(--text); margin-bottom: 4px; }\n    .pc-tag { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }\n    .pc-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 14px; }\n    .pc-amount { font-size: 48px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--text); }\n    .pc-period { font-size: 15px; color: var(--text-muted); font-weight: 500; }\n    .pc-cap { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }\n    .pc-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }\n    .pc-list li {\n      list-style: none; display: flex; align-items: flex-start; gap: 10px;\n      font-size: 13.5px; color: var(--text); line-height: 1.45;\n    }\n    .pc-list li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;\n      color: var(--green-dark); padding: 2px; background: var(--green-bg); border-radius: 50%;\n    }\n    .pc-card .btn { width: 100%; justify-content: center; }\n    .pc-note { text-align: center; font-size: 11px; color: var(--text-faint); margin-top: 10px; }\n    .pc-lock {\n      margin-top: 28px; text-align: center;\n      padding: 16px 20px;\n      background: var(--pink-bg); color: #c21a6a;\n      border-radius: var(--radius-lg);\n      font-size: 13.5px; font-weight: 600;\n    }\n    .pc-lock strong { font-weight: 800; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 820px; margin: 96px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      transition: all 0.15s ease;\n    }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q {\n      padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text);\n      display: flex; justify-content: space-between; align-items: center;\n      cursor: pointer; user-select: none; width: 100%; text-align: left; gap: 16px;\n    }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.25s ease;\n      padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 600px; padding: 0 22px 20px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 88px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 980px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .hero-portrait { grid-template-columns: repeat(2, 1fr); }\n      .problems, .features, .mockup-wrap, .replaces, .case, .pricing-cta, .faq, .cta-bottom {\n        padding-left: 16px; padding-right: 16px;\n      }\n      .prob-grid, .feat-grid { grid-template-columns: 1fr; }\n      .pc-grid { grid-template-columns: 1fr; }\n      .case-card { grid-template-columns: 1fr; padding: 36px 26px; }\n      .rep-grid { grid-template-columns: 1fr; }\n      .rep-total { grid-template-columns: 1fr; text-align: center; gap: 12px; }\n      .rep-total-side { align-items: center; }\n      .rep-total-arrow { transform: rotate(90deg); margin: 0 auto; }\n      .mk-kpis { grid-template-columns: repeat(2, 1fr); }\n      .mk-kpi:nth-child(2) { border-right: none; }\n      .mk-kpi:nth-child(-n+2) { border-bottom: 1px solid var(--border); }\n      .mk-table-head, .mk-row { grid-template-columns: 1.6fr 0.9fr 0.9fr 0.9fr; }\n      .mk-col-hide { display: none; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="for-sfr-investors.html">For investors</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><polyline points="7 14 11 10 14 13 21 6" /></svg>
      Built for scattered-SFR portfolio operators
    </div>
    <h1>Run 20 SFRs like they're <em>one portfolio</em>.</h1>
    <p className="hero-sub">Cap rate, cash-on-cash, DSCR, and per-entity Schedule E — calculated across every door, every month. Stop stitching portfolio performance together from seven spreadsheets, two property managers, and a QuickBooks file you've been afraid to open since January.</p>
    <div className="hero-actions">
      <a className="btn btn-pink btn-lg" href="onboarding.html">Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="pricing.html">See Pro &amp; Scale pricing</a>
    </div>
    <div className="hero-note">No credit card · Founders' lock at $99 if you're under 50 doors</div>

    <div className="hero-portrait">
      <div className="hp-stat">
        <div className="hp-stat-num"><em>1</em> portfolio view</div>
        <div className="hp-stat-lbl">One dashboard across every LLC, market, and asset class.</div>
      </div>
      <div className="hp-stat">
        <div className="hp-stat-num"><em>6</em> metrics auto-computed</div>
        <div className="hp-stat-lbl">Cap rate, CoC, DSCR, NOI, GRM, occupancy — refreshed nightly.</div>
      </div>
      <div className="hp-stat">
        <div className="hp-stat-num"><em>100%</em> entity-aware</div>
        <div className="hp-stat-lbl">Each property tagged to the LLC that owns it. Schedule E splits itself.</div>
      </div>
      <div className="hp-stat">
        <div className="hp-stat-num"><em>$1,100</em> /mo saved</div>
        <div className="hp-stat-lbl">Replace AppFolio, QuickBooks, bookkeeper retainer, investor-report spreadsheet.</div>
      </div>
    </div>
  </section>

  
  <section className="problems">
    <div className="section-head">
      <div className="section-kicker">The scattered-portfolio tax</div>
      <h2>Five problems you stopped noticing<br />because they've always been this way.</h2>
      <p>Most "property management" tools were built for a single apartment complex — not 34 houses across three states, six LLCs, and two bookkeepers. Here's what actually breaks at 15+ doors.</p>
    </div>
    <div className="prob-grid">
      <div className="prob-card">
        <div className="prob-num">Problem 01</div>
        <h3>Geographic sprawl</h3>
        <p>Your portfolio is Birmingham, Huntsville, Chattanooga, and that one weird Memphis asset. No single PM covers all four. You're juggling three local managers plus a few self-managed rentals — each in a different system.</p>
        <div className="prob-tag">3 PMs · 4 markets · 1 you</div>
      </div>
      <div className="prob-card">
        <div className="prob-num">Problem 02</div>
        <h3>Per-property ledgers, no portfolio roll-up</h3>
        <p>You can see the P&amp;L for 418 Lee Drive. You can see the P&amp;L for 3026 Turf. You cannot see a clean portfolio NOI trendline without exporting two CSVs and a prayer. Portfolio IRR? That's a quarterly spreadsheet project.</p>
        <div className="prob-tag">Per-door ledgers don't equal a portfolio</div>
      </div>
      <div className="prob-card">
        <div className="prob-num">Problem 03</div>
        <h3>Investor reporting across entities</h3>
        <p>Blackbear Holdings LLC owns 8 doors. Lee Three LLC owns 4. Your sister is a passive LP in one and not the other. You send separate monthly emails and hope you attached the right P&amp;L to the right person.</p>
        <div className="prob-tag">LLC A vs LLC B · LPs waiting</div>
      </div>
      <div className="prob-card">
        <div className="prob-num">Problem 04</div>
        <h3>Capex tracking is a guessing game</h3>
        <p>You dropped $14k on a roof at 908 Lee last year. Was that capitalized or expensed? What's the depreciation schedule? Basis tracking lives in whatever your CPA remembers. Portfolio-level capex pacing: nonexistent.</p>
        <div className="prob-tag">Basis &amp; depreciation · gut-feel</div>
      </div>
      <div className="prob-card">
        <div className="prob-num">Problem 05</div>
        <h3>Vendor coordination across cities</h3>
        <p>The HVAC guy you trust in Huntsville won't drive to Chattanooga. You have a mental Rolodex per market. When a tenant submits a work order at 10pm, you're cross-referencing which vendor covers that zip code — from your phone, in bed.</p>
        <div className="prob-tag">Zip-coded vendor memory · leaks money</div>
      </div>
      <div className="prob-card">
        <div className="prob-num">Problem 06</div>
        <h3>Underwriting new deals without a baseline</h3>
        <p>You're staring at a 4-plex on LoopNet. You need to compare its pro-forma to your current portfolio's actual cap rate — not the fantasy cap rate on the listing. That baseline lives in a spreadsheet from Q3 2025.</p>
        <div className="prob-tag">Stale cap-rate baseline · worse deals</div>
      </div>
    </div>
  </section>

  
  <section className="features">
    <div className="section-head">
      <div className="section-kicker">What Tenantory does for SFR</div>
      <h2>Portfolio-grade analytics.<br />Entity-aware bookkeeping. One subscription.</h2>
      <p>Six things built specifically for the operator who thinks in IRR and gets a 1099 from every LLC they own.</p>
    </div>
    <div className="feat-grid">
      <div className="feat-card accent">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        </div>
        <h3>Portfolio-level dashboard</h3>
        <p>Not just "10 per-property tiles." A real portfolio view: blended NOI, weighted cap rate, occupancy trend, and cash-on-cash across every door. Filter by market, LLC, or acquisition cohort.</p>
      </div>
      <div className="feat-card">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 7-7" /><polyline points="14 6 21 6 21 13" /></svg>
        </div>
        <h3>Cap rate &amp; CoC auto-calculated</h3>
        <p>Tenantory already knows rent, expenses, debt service, and your purchase basis. Cap rate and cash-on-cash compute nightly — per asset and portfolio-blended. No formulas. No Q3 catch-up.</p>
      </div>
      <div className="feat-card">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>
        </div>
        <h3>Per-entity Schedule E exports</h3>
        <p>Tag each door to the LLC that owns it. At year-end, export a clean, IRS-ready Schedule E for LLC A and a separate one for LLC B. Your CPA stops charging you to untangle it.</p>
      </div>
      <div className="feat-card">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /><circle cx="7" cy="6" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="17" cy="18" r="1.5" fill="currentColor" /></svg>
        </div>
        <h3>Multi-property rent roll</h3>
        <p>Every lease, term, rent, delinquency, and renewal date in one live rent roll. Filter by market, sort by expiring leases, export to PDF the morning your lender asks.</p>
      </div>
      <div className="feat-card accent">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <h3>Investor portal for LPs</h3>
        <p>Your passive partners log in and see exactly what you want them to see — their entity's P&amp;L, distributions, and K-1 prep. Not the maintenance tickets, not the tenant complaints. Read-only, branded, quiet.</p>
      </div>
      <div className="feat-card">
        <div className="feat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
        </div>
        <h3>RentCast comp integration</h3>
        <p>Every property shows live rent comps within a quarter-mile radius. Identify under-rented units at renewal. Underwrite new acquisitions against your actual market, not the seller's.</p>
      </div>
    </div>
  </section>

  
  <section className="mockup-wrap">
    <div className="section-head">
      <div className="section-kicker">Portfolio dashboard</div>
      <h2>Every door, every number, color-coded by performance.</h2>
      <p>Green is hitting pro forma. Yellow is drifting. Red needs a decision. You'll know inside 10 seconds which asset is dragging the portfolio down this month.</p>
    </div>
    <div className="mockup">
      <div className="mk-bar">
        <div className="mk-dots"><span /><span /><span /></div>
        <div className="mk-title">Portfolio Overview — April 2026</div>
        <div className="mk-url">rentblackbear.com/admin/portfolio</div>
      </div>
      <div className="mk-head">
        <div>
          <h4>Blackbear Holdings — Full Portfolio</h4>
          <div className="mk-head-sub">34 doors · 4 markets · 6 LLCs · updated 2 hours ago</div>
        </div>
        <div className="mk-entity-pills">
          <span className="mk-pill on">All entities</span>
          <span className="mk-pill">Blackbear Holdings LLC</span>
          <span className="mk-pill">Lee Three LLC</span>
          <span className="mk-pill">Turf Ventures LLC</span>
        </div>
      </div>
      <div className="mk-kpis">
        <div className="mk-kpi">
          <div className="mk-kpi-lbl">Blended Cap Rate</div>
          <div className="mk-kpi-val">7.82%</div>
          <div className="mk-kpi-delta">+0.34% vs Q4</div>
        </div>
        <div className="mk-kpi">
          <div className="mk-kpi-lbl">Cash-on-Cash</div>
          <div className="mk-kpi-val">11.4%</div>
          <div className="mk-kpi-delta">+1.1% YoY</div>
        </div>
        <div className="mk-kpi">
          <div className="mk-kpi-lbl">Portfolio NOI (TTM)</div>
          <div className="mk-kpi-val">$412,840</div>
          <div className="mk-kpi-delta">+$28k vs prior TTM</div>
        </div>
        <div className="mk-kpi">
          <div className="mk-kpi-lbl">Occupancy</div>
          <div className="mk-kpi-val">94.1%</div>
          <div className="mk-kpi-delta red">-2.9% vs March</div>
        </div>
      </div>
      <div className="mk-table-head">
        <div>Property</div>
        <div>Rent</div>
        <div className="mk-col-hide">Expenses</div>
        <div>Cap rate</div>
        <div className="mk-col-hide">CoC</div>
        <div>Occupancy</div>
      </div>
      <div className="mk-row">
        <div className="mk-addr">908 Lee Dr NW <small>Huntsville, AL · Blackbear Holdings LLC</small></div>
        <div className="mk-num">$1,495</div>
        <div className="mk-num mk-col-hide">$412</div>
        <div><span className="mk-chip g">8.4%</span></div>
        <div className="mk-num mk-col-hide">12.8%</div>
        <div><span className="mk-occ"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="on" /></span></div>
      </div>
      <div className="mk-row">
        <div className="mk-addr">3026 Turf Ave NW <small>Huntsville, AL · Turf Ventures LLC</small></div>
        <div className="mk-num">$1,850</div>
        <div className="mk-num mk-col-hide">$587</div>
        <div><span className="mk-chip g">7.9%</span></div>
        <div className="mk-num mk-col-hide">11.2%</div>
        <div><span className="mk-occ"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="on" /></span></div>
      </div>
      <div className="mk-row">
        <div className="mk-addr">418 Lee Dr NW <small>Huntsville, AL · Lee Three LLC</small></div>
        <div className="mk-num">$1,625</div>
        <div className="mk-num mk-col-hide">$498</div>
        <div><span className="mk-chip y">6.8%</span></div>
        <div className="mk-num mk-col-hide">9.1%</div>
        <div><span className="mk-occ"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="on" /></span></div>
      </div>
      <div className="mk-row">
        <div className="mk-addr">1142 Signal View <small>Chattanooga, TN · Blackbear Holdings LLC</small></div>
        <div className="mk-num">$2,100</div>
        <div className="mk-num mk-col-hide">$734</div>
        <div><span className="mk-chip g">8.1%</span></div>
        <div className="mk-num mk-col-hide">13.4%</div>
        <div><span className="mk-occ"><span className="on" /><span className="on" /><span className="on" /><span className="on" /><span className="on" /></span></div>
      </div>
      <div className="mk-row">
        <div className="mk-addr">2207 Glenn Oak Ln <small>Memphis, TN · Memphis Holdco LLC</small></div>
        <div className="mk-num">$1,200</div>
        <div className="mk-num mk-col-hide">$489</div>
        <div><span className="mk-chip r">5.2%</span></div>
        <div className="mk-num mk-col-hide">4.8%</div>
        <div><span className="mk-occ"><span className="on" /><span className="on" /><span className="on" /><span /><span /></span></div>
      </div>
      <div className="mk-foot">
        <div>Showing 5 of 34 doors · <strong>29 hitting pro forma</strong> · 3 drifting · 2 need attention</div>
        <div>Export: <strong>CSV · PDF · Schedule E (per LLC)</strong></div>
      </div>
    </div>
  </section>

  
  <section className="replaces">
    <div className="section-head">
      <div className="section-kicker">What your stack actually costs</div>
      <h2>The scattered-SFR investor tax: ~$1,200/mo.</h2>
      <p>Most serious SFR operators we talk to are paying for four tools that don't talk to each other — plus a bookkeeper paid to manually glue them together.</p>
    </div>
    <div className="rep-grid">
      <div className="rep-row">
        <div className="rep-name">AppFolio <small>Per-property accounting (50+ unit minimum)</small></div>
        <div className="rep-price">$280/mo</div>
      </div>
      <div className="rep-row">
        <div className="rep-name">QuickBooks Online Plus <small>Multi-entity bookkeeping, 2 companies</small></div>
        <div className="rep-price">$180/mo</div>
      </div>
      <div className="rep-row">
        <div className="rep-name">Bookkeeper retainer <small>Monthly reconciliation across LLCs</small></div>
        <div className="rep-price">$600/mo</div>
      </div>
      <div className="rep-row">
        <div className="rep-name">DIY investor-report spreadsheet <small>3 hours × $50/hr operator time</small></div>
        <div className="rep-price">$150/mo</div>
      </div>
    </div>
    <div className="rep-total">
      <div className="rep-total-side">
        <div className="rep-total-label">The scattered stack</div>
        <div className="rep-total-amount">$1,210<span style={{fontSize: "15px", color: "var(--text-muted)", fontWeight: "500"}}>/mo</span></div>
      </div>
      <div className="rep-total-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </div>
      <div className="rep-total-side right">
        <div className="rep-total-label">Tenantory Pro</div>
        <div className="rep-total-amount">$99<span style={{fontSize: "15px", fontWeight: "500"}}>/mo</span></div>
        <div className="rep-total-after">Save $13,320/yr. Cancel four subscriptions.</div>
      </div>
    </div>
  </section>

  
  <section className="case">
    <div className="case-card">
      <div>
        <div className="case-label">Case Study · BRRRR operator · 31 doors</div>
        <p className="case-quote">I used to close my laptop on the 5th of every month with no idea whether we'd cleared debt service on the Memphis portfolio. Now I check one dashboard with my coffee. Cap rate across all 31 doors, by LLC, by market — and the Schedule E exports already broken out for my CPA. My bookkeeper bill dropped from $650 to $180 a month.</p>
        <div className="case-who">
          <div className="case-avatar">MR</div>
          <div>
            <div className="case-who-name">Marcus Rowe</div>
            <div className="case-who-role">Principal, Rowe Capital · Huntsville / Chattanooga / Memphis</div>
          </div>
        </div>
      </div>
      <div className="case-stats">
        <div className="case-stat">
          <div className="case-stat-lbl">Doors</div>
          <div className="case-stat-val"><em>31</em></div>
          <div className="case-stat-sub">Across 3 markets, 4 LLCs</div>
        </div>
        <div className="case-stat">
          <div className="case-stat-lbl">Portfolio IRR</div>
          <div className="case-stat-val"><em>18.2%</em></div>
          <div className="case-stat-sub">Up from 15.1% a year ago</div>
        </div>
        <div className="case-stat">
          <div className="case-stat-lbl">Hours saved</div>
          <div className="case-stat-val"><em>14/mo</em></div>
          <div className="case-stat-sub">Mostly reporting &amp; reconciliation</div>
        </div>
        <div className="case-stat">
          <div className="case-stat-lbl">Stack cost</div>
          <div className="case-stat-val"><em>-$1,040</em></div>
          <div className="case-stat-sub">AppFolio + QB + bookkeeper delta</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="pricing-cta">
    <div className="section-head">
      <div className="section-kicker">Pricing for SFR portfolios</div>
      <h2>Two plans. Picked by door count.</h2>
      <p>Under 50 doors → Pro. Over 50 → Scale with unlimited units and API access. Both include portfolio analytics, per-entity exports, and the investor portal.</p>
    </div>
    <div className="pc-grid">
      <div className="pc-card featured">
        <div className="pc-ribbon">Founders · $99 for life</div>
        <div className="pc-name">Pro</div>
        <div className="pc-tag">For SFR investors under 50 doors</div>
        <div className="pc-price">
          <span className="pc-amount">$99</span>
          <span className="pc-period">/mo</span>
        </div>
        <div className="pc-cap"><strong>Up to 50 units.</strong> Branded subdomain, investor portal, portfolio analytics, per-LLC Schedule E. Locked at $99 for life if you claim a Founders' spot.</div>
        <ul className="pc-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Portfolio dashboard across all entities</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Cap rate, CoC, DSCR, NOI — auto</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Per-LLC Schedule E export + 1099s</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>LP investor portal (read-only, branded)</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>RentCast comps on every property</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>CPA read-only seat, unlimited</li>
        </ul>
        <a className="btn btn-pink" href="onboarding.html">Claim Founders' spot</a>
        <div className="pc-note">87 spots left · 13 claimed this week</div>
      </div>

      <div className="pc-card">
        <div className="pc-name">Scale</div>
        <div className="pc-tag">For portfolios over 50 doors</div>
        <div className="pc-price">
          <span className="pc-amount">$299</span>
          <span className="pc-period">/mo</span>
        </div>
        <div className="pc-cap"><strong>Unlimited units.</strong> Custom domain, API access, webhooks, and a 2-hour support SLA. Everything in Pro plus full white-label.</div>
        <ul className="pc-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Everything in Pro</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Unlimited doors &amp; unlimited LLCs</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Custom domain, full white-label</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>API access &amp; webhooks for your ops</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Priority support (2-hour SLA)</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Custom roll-up dashboards</li>
        </ul>
        <a className="btn btn-ghost" href="onboarding.html">Scale my portfolio</a>
        <div className="pc-note">Cancel anytime · no onboarding fee</div>
      </div>
    </div>
    <div className="pc-lock">
      <strong>Founders' lock:</strong> Start Pro today and your rate stays at $99/mo for the life of your account — even after you cross 50 doors and need Scale features. We grandfather you forever. This won't be a line item in next year's board deck.
    </div>
  </section>

  
  <section className="faq">
    <div className="section-head">
      <div className="section-kicker">SFR operator FAQ</div>
      <h2>Questions scattered-SFR operators actually ask.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">Do you handle multi-LLC tax tracking?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">Yes — this is the main reason most SFR investors switch to us. Every property has an owning entity tag. Income, expenses, depreciation, and capex are stored against both the property and the entity. At year end you export a clean Schedule E per LLC, not a single blob you have to manually split. If the IRS ever asks, the audit trail is per-transaction, per-entity.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I split properties across different ownership entities?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">Yes. You can register as many LLCs (or S-corps, partnerships, trusts) as you have. Reassign a property from LLC A to LLC B mid-year — the historical ledger stays tagged correctly to whichever entity owned it on which date. When you sell a door from one LLC and re-buy into another (common in 1031-adjacent moves), the basis trail follows.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What about scattered-site vendor management?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">You build a vendor list per market. Each property inherits the correct vendor pool based on its ZIP code — so a work order at a Chattanooga house routes to Chattanooga HVAC, not the Huntsville guy. Vendor W-9s, insurance certs, and 1099 totals live on the vendor record. At year-end, the 1099-NEC filing runs itself.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I give my CPA read-only access?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">Yes. Unlimited CPA seats at no extra charge on every plan. They log in, see every transaction, every uploaded receipt, every bank-reconciliation status, and can export directly to their tax software. They cannot delete, edit, or move money. Most of our CPAs close the books in half the time versus QuickBooks.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Investor portal vs operator admin — what's different?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">The admin is where you live — rent roll, maintenance, leases, accounting, every moving part. The investor portal is what your LPs see: only the entity they have equity in, only the P&amp;L / NOI / distributions / K-1s. No tenant names, no work orders, no maintenance drama. You control exactly which KPIs are visible per investor. A quiet, boring dashboard is a feature — LPs don't need to see the sausage.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What if I'm in the middle of a BRRRR refinance?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="faq-a">Good — this is actually the best time to switch. You can generate a lender-ready rent roll, trailing-12 P&amp;L per property, and a portfolio DSCR summary in three clicks. We've had investors onboard mid-refi, use our rent roll for their DSCR loan package, and close the refi the following week. Cost basis updates when the new loan books, and your cash-on-cash and CoC recalculate against the refreshed equity position.</div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Stop reconciling. Start compounding.</h2>
      <p>14-day free trial. No credit card. Free data migration from AppFolio, Stessa, Buildium, or your spreadsheet. Lock Pro at $99 for life — even once you cross 50 doors.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Claim a Founders' spot
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="pricing.html">Compare Pro vs Scale</a>
      </div>
      <div className="cta-note">87 Founders' spots left · most investors migrate in under 48 hours</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="for-sfr-investors.html">For investors</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
