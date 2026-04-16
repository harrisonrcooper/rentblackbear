"use client";

// Mock ported from ~/Desktop/blackbear/vs-doorloop.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero { padding: 72px 32px 48px; text-align: center; max-width: 1080px; margin: 0 auto; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 20px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 58px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      max-width: 940px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 720px; margin: 0 auto 34px; line-height: 1.55;\n    }\n    .hero-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }\n    .hero-trust {\n      display: inline-flex; align-items: center; gap: 14px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .hero-trust svg { width: 14px; height: 14px; color: var(--green-dark); }\n    .hero-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }\n\n    /* ===== Logos matchup ===== */\n    .matchup {\n      max-width: 700px; margin: 44px auto 0; padding: 0 32px;\n      display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center;\n    }\n    .matchup-side {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 22px;\n      text-align: center;\n    }\n    .matchup-side.them { opacity: 0.82; }\n    .matchup-side.us {\n      border: 2px solid var(--pink);\n      box-shadow: 0 14px 40px rgba(255,73,152,0.14);\n    }\n    .matchup-logo { font-weight: 900; font-size: 20px; letter-spacing: -0.02em; margin-bottom: 4px; color: var(--text); }\n    .matchup-sub { font-size: 12px; color: var(--text-muted); font-weight: 500; }\n    .matchup-side.us .matchup-sub { color: var(--pink); font-weight: 700; }\n    .matchup-vs {\n      width: 44px; height: 44px; border-radius: 50%;\n      background: var(--text); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 12px; font-weight: 900; letter-spacing: 0.06em;\n    }\n\n    /* ===== Sections ===== */\n    .section { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }\n    .section-head { text-align: center; margin-bottom: 48px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }\n    .section-head h2 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .section-head p { font-size: 16px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }\n\n    /* ===== Credit (what they get right) ===== */\n    .credit-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;\n    }\n    .credit-card {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px 24px;\n      display: flex; flex-direction: column; gap: 12px;\n    }\n    .credit-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--green-bg); color: var(--green-dark);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .credit-icon svg { width: 20px; height: 20px; }\n    .credit-card h3 { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; line-height: 1.3; }\n    .credit-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }\n\n    /* ===== Reasons grid ===== */\n    .reasons {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;\n    }\n    .reason-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px 24px;\n      transition: all 0.2s ease; position: relative;\n      display: flex; flex-direction: column;\n    }\n    .reason-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }\n    .reason-index {\n      position: absolute; top: 20px; right: 22px;\n      font-size: 11px; font-weight: 800; color: var(--text-faint); letter-spacing: 0.1em;\n    }\n    .reason-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--blue-pale); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 16px;\n    }\n    .reason-icon svg { width: 20px; height: 20px; }\n    .reason-card.hot .reason-icon { background: var(--pink-bg); color: var(--pink); }\n    .reason-card h3 {\n      font-size: 16px; font-weight: 800; letter-spacing: -0.01em;\n      margin-bottom: 8px; line-height: 1.3;\n    }\n    .reason-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; }\n    .reason-card .reason-contrast {\n      display: flex; gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);\n      font-size: 12px;\n    }\n    .reason-contrast-col { flex: 1; }\n    .reason-contrast-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }\n    .reason-contrast-col.them .reason-contrast-label { color: var(--text-faint); }\n    .reason-contrast-col.us .reason-contrast-label { color: var(--green-dark); }\n    .reason-contrast-val { font-weight: 700; color: var(--text); font-size: 13px; }\n    .reason-contrast-col.them .reason-contrast-val { color: var(--text-muted); text-decoration: line-through; text-decoration-color: var(--border-strong); }\n\n    /* ===== Price ladder ===== */\n    .ladder-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }\n    .ladder {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .ladder-table { width: 100%; border-collapse: collapse; font-size: 14px; }\n    .ladder-table thead th {\n      padding: 22px 16px; text-align: center;\n      font-weight: 800; font-size: 15px; color: var(--text);\n      border-bottom: 1px solid var(--border); background: var(--surface-subtle);\n      vertical-align: middle;\n    }\n    .ladder-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }\n    .ladder-table thead th.them { color: var(--text-muted); }\n    .ladder-table thead th.us {\n      background: linear-gradient(180deg, var(--pink-bg), transparent);\n      color: var(--pink);\n    }\n    .ladder-table thead th.save { color: var(--green-dark); background: var(--green-bg); }\n    .ladder-table thead th .col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .ladder-table thead th.us .col-sub { color: #c21a6a; }\n    .ladder-table thead th.save .col-sub { color: var(--green-dark); opacity: 0.8; }\n    .ladder-table tbody td {\n      padding: 18px 16px; border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle;\n    }\n    .ladder-table tbody td:first-child { text-align: left; }\n    .ladder-table tbody tr:last-child td { border-bottom: none; }\n    .ladder-table tbody tr.highlight td { background: linear-gradient(180deg, rgba(255,73,152,0.04), transparent); }\n    .ladder-port { font-weight: 800; font-size: 15px; color: var(--text); }\n    .ladder-port small { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .ladder-price { font-weight: 700; font-size: 16px; color: var(--text-muted); }\n    .ladder-price small { display: block; font-weight: 500; font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n    .ladder-us { font-weight: 900; font-size: 18px; color: var(--pink); }\n    .ladder-us small { display: block; font-weight: 500; font-size: 11px; color: var(--text-faint); margin-top: 2px; }\n    .ladder-save { font-weight: 900; font-size: 16px; color: var(--green-dark); }\n    .ladder-save small { display: block; font-weight: 600; font-size: 11px; color: var(--green-dark); margin-top: 2px; opacity: 0.8; }\n    .ladder-foot {\n      font-size: 12px; color: var(--text-faint); padding: 14px 20px;\n      background: var(--surface-subtle); border-top: 1px solid var(--border);\n      text-align: center; line-height: 1.55;\n    }\n\n    /* ===== Compare table ===== */\n    .compare-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }\n    .compare {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .compare-table { width: 100%; border-collapse: collapse; font-size: 14px; }\n    .compare-table thead th {\n      padding: 22px 16px; text-align: center;\n      font-weight: 800; font-size: 15px; color: var(--text);\n      border-bottom: 1px solid var(--border); background: var(--surface-subtle);\n      vertical-align: middle;\n    }\n    .compare-table thead th:first-child { text-align: left; color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }\n    .compare-table thead th.featured {\n      background: linear-gradient(180deg, var(--pink-bg), transparent);\n      color: var(--pink);\n    }\n    .compare-table thead th.dim { color: var(--text-muted); }\n    .compare-table thead th .compare-col-sub { display: block; font-weight: 500; font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n    .compare-table thead th.featured .compare-col-sub { color: #c21a6a; }\n\n    .compare-table tbody tr:nth-child(odd) td { background: var(--surface-subtle); }\n    .compare-table tbody tr.group-head td {\n      background: var(--surface) !important;\n      padding-top: 24px !important; padding-bottom: 10px !important;\n      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;\n      border-top: 1px solid var(--border);\n    }\n    .compare-table tbody tr.group-head:first-child td { border-top: none; padding-top: 16px !important; }\n    .compare-table td {\n      padding: 14px 16px; border-bottom: 1px solid var(--border);\n      vertical-align: middle;\n    }\n    .compare-table td:first-child { color: var(--text); font-weight: 500; }\n    .compare-table td:not(:first-child) { text-align: center; }\n    .compare-table tbody tr:last-child td { border-bottom: none; }\n    .cmp-yes svg { width: 18px; height: 18px; color: var(--green-dark); margin: 0 auto; padding: 2px; background: var(--green-bg); border-radius: 50%; }\n    .cmp-no svg { width: 18px; height: 18px; color: var(--text-faint); margin: 0 auto; padding: 2px; background: var(--surface-alt); border-radius: 50%; }\n    .cmp-val { font-size: 13px; font-weight: 600; color: var(--text); }\n    .cmp-val-dim { font-size: 13px; font-weight: 500; color: var(--text-muted); }\n    .cmp-val-strong { font-size: 14px; font-weight: 800; color: var(--pink); }\n\n    /* ===== Migration callout ===== */\n    .migrate-wrap { max-width: 1100px; margin: 0 auto; padding: 88px 32px 0; }\n    .migrate-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 44px 48px;\n      display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;\n      box-shadow: var(--shadow);\n    }\n    .migrate-eyebrow {\n      display: inline-flex; align-items: center; gap: 8px;\n      background: var(--green-bg); color: var(--green-dark);\n      padding: 5px 12px; border-radius: 100px;\n      font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;\n      margin-bottom: 16px;\n    }\n    .migrate-eyebrow svg { width: 12px; height: 12px; }\n    .migrate-card h3 {\n      font-size: clamp(24px, 3vw, 32px); font-weight: 800; letter-spacing: -0.025em;\n      margin-bottom: 14px; line-height: 1.15;\n    }\n    .migrate-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 22px; }\n    .migrate-card p strong { color: var(--text); font-weight: 700; }\n    .migrate-cta { display: flex; gap: 10px; flex-wrap: wrap; }\n\n    .migrate-steps { display: flex; flex-direction: column; gap: 14px; }\n    .migrate-step {\n      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 18px;\n    }\n    .migrate-step-num {\n      width: 34px; height: 34px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 13px;\n      box-shadow: 0 6px 18px rgba(18,81,173,0.25);\n    }\n    .migrate-step-text { font-size: 14px; color: var(--text); font-weight: 600; }\n    .migrate-step-text small { display: block; font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }\n    .migrate-step-clock {\n      font-size: 11px; color: var(--text-muted); font-weight: 700;\n      background: var(--surface); border: 1px solid var(--border);\n      padding: 4px 9px; border-radius: 100px; white-space: nowrap;\n    }\n\n    /* ===== Testimonials ===== */\n    .testi-wrap { max-width: 1180px; margin: 0 auto; padding: 88px 32px 0; }\n    .testi-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;\n    }\n    .testi-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 30px 30px 26px;\n      display: flex; flex-direction: column;\n      box-shadow: var(--shadow-sm);\n    }\n    .testi-card:nth-child(2) { background: linear-gradient(180deg, var(--surface) 0%, var(--blue-softer) 100%); }\n    .testi-card:nth-child(3) { background: linear-gradient(180deg, var(--surface) 0%, rgba(255,73,152,0.04) 100%); }\n    .testi-quote-mark {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--pink-bg); color: var(--pink);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 16px;\n    }\n    .testi-quote-mark svg { width: 16px; height: 16px; }\n    .testi-quote {\n      font-size: 17px; line-height: 1.55; color: var(--text); font-weight: 500;\n      letter-spacing: -0.005em; margin-bottom: 22px; flex: 1;\n    }\n    .testi-quote strong { background: var(--pink-bg); color: #c21a6a; padding: 1px 5px; border-radius: 4px; font-weight: 700; }\n    .testi-person { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--border); }\n    .testi-avatar {\n      width: 44px; height: 44px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--navy), var(--blue-bright));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 15px; letter-spacing: 0.02em;\n      flex-shrink: 0;\n    }\n    .testi-card:nth-child(2) .testi-avatar { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }\n    .testi-card:nth-child(3) .testi-avatar { background: linear-gradient(135deg, var(--pink), var(--gold)); }\n    .testi-card:nth-child(4) .testi-avatar { background: linear-gradient(135deg, var(--green-dark), var(--blue)); }\n    .testi-name { font-weight: 700; font-size: 14px; color: var(--text); }\n    .testi-role { font-size: 12px; color: var(--text-muted); margin-top: 1px; }\n    .testi-switched {\n      margin-left: auto; display: inline-flex; align-items: center; gap: 5px;\n      background: var(--green-bg); color: var(--green-dark);\n      font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px;\n      letter-spacing: 0.02em;\n    }\n    .testi-switched svg { width: 10px; height: 10px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 96px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 60px 52px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 440px; height: 440px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card::after {\n      content: \"\"; position: absolute; bottom: -50%; right: -10%;\n      width: 420px; height: 420px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(22,101,216,0.35), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      background: rgba(255,255,255,0.12); color: #fff;\n      padding: 5px 12px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .cta-eyebrow svg { width: 12px; height: 12px; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 14px; line-height: 1.1; }\n    .cta-card p { font-size: 17px; color: rgba(255,255,255,0.85); max-width: 640px; margin: 0 auto 30px; line-height: 1.55; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }\n    .cta-note-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.4); }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .credit-grid { grid-template-columns: repeat(2, 1fr); }\n      .reasons { grid-template-columns: repeat(2, 1fr); }\n      .migrate-card { grid-template-columns: 1fr; gap: 32px; padding: 32px 28px; }\n      .testi-grid { grid-template-columns: 1fr; }\n    }\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .section, .compare-wrap, .migrate-wrap, .testi-wrap, .cta-bottom, .ladder-wrap { padding-left: 16px; padding-right: 16px; }\n      .credit-grid { grid-template-columns: 1fr; }\n      .reasons { grid-template-columns: 1fr; }\n      .matchup { grid-template-columns: 1fr auto 1fr; padding: 0 16px; }\n      .compare, .ladder { overflow-x: auto; }\n      .compare-table, .ladder-table { min-width: 560px; }\n      .cta-card { padding: 40px 22px; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  
  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <span className="tb-brand-name">Black Bear Rentals</span>
    </a>
    <nav className="tb-nav">
      <a className="tb-nav-item" href="landing.html">Home</a>
      <a className="tb-nav-item" href="pricing.html">Pricing</a>
      <a className="tb-nav-item active" href="vs-doorloop.html">vs DoorLoop</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">Tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
      DoorLoop vs Black Bear Rentals &middot; honest comparison
    </div>
    <h1>DoorLoop built a modern PM tool. We built one that actually <em>looks like yours</em>.</h1>
    <p className="hero-sub">DoorLoop is a solid product &mdash; fair pricing, clean UI, real accounting. Credit where it's due. But your applicants still land on <em>yourco.doorloop.com</em> with DoorLoop's colors, DoorLoop's logo, and DoorLoop's name in every email. Black Bear Rentals is the same price as DoorLoop Pro ($99/mo), built for the same 1&ndash;100 unit operator, with your brand stitched through every surface your tenant sees.</p>
    <div className="hero-cta-row">
      <a className="btn btn-pink btn-lg" href="onboarding.html">
        Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="#compare">See full comparison</a>
    </div>
    <div className="hero-trust">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "-2px", marginRight: "4px"}}><polyline points="20 6 9 17 4 12" /></svg>No credit card</span>
      <span className="hero-trust-dot" />
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "-2px", marginRight: "4px"}}><polyline points="20 6 9 17 4 12" /></svg>Free migration from DoorLoop</span>
      <span className="hero-trust-dot" />
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "-2px", marginRight: "4px"}}><polyline points="20 6 9 17 4 12" /></svg>Live in 3 days</span>
    </div>

    <div className="matchup">
      <div className="matchup-side them">
        <div className="matchup-logo">DoorLoop</div>
        <div className="matchup-sub">Modern PM, generic portal &middot; $99/mo Pro</div>
      </div>
      <div className="matchup-vs">VS</div>
      <div className="matchup-side us">
        <div className="matchup-logo">Black Bear Rentals</div>
        <div className="matchup-sub">Same price. Your brand. $99/mo for life</div>
      </div>
    </div>
  </section>

  
  <section className="section" id="credit">
    <div className="section-head">
      <div className="section-kicker">Fair is fair</div>
      <h2>What DoorLoop <em>gets right</em>.</h2>
      <p>We're not here to trash a respectable competitor. If you're on DoorLoop today, you're on something meaningfully better than Buildium or AppFolio. Here's where their team has earned the good reviews.</p>
    </div>
    <div className="credit-grid">

      <div className="credit-card">
        <div className="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        </div>
        <h3>Genuinely modern UI</h3>
        <p>Compared to the AppFolio/Buildium generation, DoorLoop actually looks like it was built in the last five years. Onboarding chat works. The dashboard doesn't feel like a SharePoint site. That's real, and it's why PMs switch <em>to</em> them from older tools.</p>
      </div>

      <div className="credit-card">
        <div className="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
        <h3>Fair pricing up to 50 units</h3>
        <p>$59 Starter and $99 Pro are honest numbers for a full-stack PM platform. Compared to AppFolio's $280/mo floor, DoorLoop is the first vendor that respects a 20-unit operator. That positioning is well-earned.</p>
      </div>

      <div className="credit-card">
        <div className="credit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="13" y2="18" /></svg>
        </div>
        <h3>Solid accounting backbone</h3>
        <p>Double-entry ledger, bank reconciliation, decent P&amp;L reports. CPAs don't hate it. If your priority is "replace QuickBooks and have something that won't embarrass you at tax time," DoorLoop's Pro tier delivers.</p>
      </div>

    </div>
  </section>

  
  <section className="section" id="reasons">
    <div className="section-head">
      <div className="section-kicker">Where we pull ahead</div>
      <h2>6 places Black Bear Rentals goes <em>further</em>.</h2>
      <p>Same price bracket, same 1&ndash;100 unit target. These are the differences PMs feel in week one.</p>
    </div>

    <div className="reasons">

      <div className="reason-card hot">
        <div className="reason-index">01</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </div>
        <h3>Branded subdomain at Pro &mdash; not Enterprise</h3>
        <p>DoorLoop's tenant portal lives under a DoorLoop-branded URL on every plan under $499/mo. Black Bear Rentals gives you <em>yourco.rentblackbear.com</em> at Pro ($99), a full custom domain on Scale ($299). Your tenants pay rent to <strong>your</strong> company, not to ours.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop</div>
            <div className="reason-contrast-val">Generic portal</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals</div>
            <div className="reason-contrast-val">Your subdomain</div>
          </div>
        </div>
      </div>

      <div className="reason-card">
        <div className="reason-index">02</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" /><path d="M9 3v6" /><path d="M15 3v6" /><path d="M9 15v6" /><path d="M15 15v6" /></svg>
        </div>
        <h3>AI application scoring, not just a credit report</h3>
        <p>DoorLoop screening returns TransUnion credit and a background check. Useful &mdash; but it still leaves <em>you</em> to eyeball income, employment history, and red flags. Black Bear Rentals scores every applicant across 7 signals (income ratio, employment stability, prior evictions, app completeness, pet/smoker, duplicate detection) and surfaces the red flag before you open the file.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop</div>
            <div className="reason-contrast-val">Credit + background</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals</div>
            <div className="reason-contrast-val">7-signal AI score</div>
          </div>
        </div>
      </div>

      <div className="reason-card">
        <div className="reason-index">03</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 4v4" /><path d="M16 4v4" /><path d="M7 14h2" /><path d="M11 14h2" /><path d="M15 14h2" /></svg>
        </div>
        <h3>Native co-living / rent-by-the-bedroom</h3>
        <p>DoorLoop models a unit as a unit. If you run co-living, student housing, or by-the-room rentals, you end up faking sub-units and hating your chart of accounts. Black Bear Rentals has room-level leases inside one property &mdash; separate rent, separate lease dates, separate ledgers, one roof.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop</div>
            <div className="reason-contrast-val">Unit-level only</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals</div>
            <div className="reason-contrast-val">Native room leases</div>
          </div>
        </div>
      </div>

      <div className="reason-card">
        <div className="reason-index">04</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </div>
        <h3>15-minute onboarding, no scheduled call</h3>
        <p>DoorLoop's "free onboarding" is a scheduled 60-minute call, usually 3&ndash;5 business days out, then data entry on your end. Black Bear Rentals is a 6-step wizard you finish in ~15 minutes. The only non-skippable field is your workspace name. Real units can be bulk-imported after, or during your trial.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop</div>
            <div className="reason-contrast-val">Scheduled call, days out</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals</div>
            <div className="reason-contrast-val">15 min, self-serve</div>
          </div>
        </div>
      </div>

      <div className="reason-card">
        <div className="reason-index">05</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <h3>Native investor portal + owner statements</h3>
        <p>If you manage units for partners or outside investors, DoorLoop makes you DIY the monthly report &mdash; export-to-Excel, paste into a template, email it out. Black Bear Rentals auto-generates a branded monthly owner statement (rent collected, expenses, NOI, reserves) as a shareable PDF with a login portal each investor can check themselves.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop</div>
            <div className="reason-contrast-val">Manual Excel build</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals</div>
            <div className="reason-contrast-val">Native investor portal</div>
          </div>
        </div>
      </div>

      <div className="reason-card hot">
        <div className="reason-index">06</div>
        <div className="reason-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5.5 4 10 9 11 5-1 9-5.5 9-11V6l-9-4z" /><path d="m9 12 2 2 4-4" /></svg>
        </div>
        <h3>Starter plan that's actually usable</h3>
        <p>DoorLoop Starter ($59/mo, 20 units) has no e-sign, no accounting, no owner portal &mdash; it's a lead-funnel for Pro. Black Bear Rentals Starter ($39/mo, 5 units) ships lease e-sign, the income/expense ledger, and full tenant portal from day one. Small portfolios deserve a real product, not a demo.</p>
        <div className="reason-contrast">
          <div className="reason-contrast-col them">
            <div className="reason-contrast-label">DoorLoop Starter</div>
            <div className="reason-contrast-val">No e-sign, no books</div>
          </div>
          <div className="reason-contrast-col us">
            <div className="reason-contrast-label">Black Bear Rentals Starter</div>
            <div className="reason-contrast-val">E-sign + accounting</div>
          </div>
        </div>
      </div>

    </div>
  </section>

  
  <section className="ladder-wrap" id="ladder">
    <div className="section-head">
      <div className="section-kicker">The real math</div>
      <h2>What you'll actually pay as you <em>add doors</em>.</h2>
      <p>Using DoorLoop's published pricing (Starter $59, Pro $99 up to 50 units, then ~$2/door after) against Black Bear Rentals Pro flat $99/mo up to 50, Scale flat $299/mo beyond. Both include the usual must-haves.</p>
    </div>
    <div className="ladder">
      <table className="ladder-table">
        <thead>
          <tr>
            <th>Portfolio size</th>
            <th className="them">DoorLoop<span className="col-sub">Published tier + per-unit</span></th>
            <th className="us">Black Bear Rentals<span className="col-sub">Flat, for life</span></th>
            <th className="save">Difference<span className="col-sub">Per year</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="ladder-port">5 units<small>Small LLC / side-portfolio</small></td>
            <td className="ladder-price">$59/mo<small>DoorLoop Starter (thin features)</small></td>
            <td className="ladder-us">$39/mo<small>Black Bear Rentals Starter (full leasing)</small></td>
            <td className="ladder-save">$240<small>Black Bear Rentals cheaper &mdash; and has e-sign</small></td>
          </tr>
          <tr className="highlight">
            <td className="ladder-port">20 units<small>DoorLoop Starter ceiling</small></td>
            <td className="ladder-price">$99/mo<small>Bumped to DoorLoop Pro</small></td>
            <td className="ladder-us">$99/mo<small>Black Bear Rentals Pro</small></td>
            <td className="ladder-save">Even<small>Same price &mdash; branded subdomain wins</small></td>
          </tr>
          <tr>
            <td className="ladder-port">50 units<small>Typical independent PM</small></td>
            <td className="ladder-price">$99/mo<small>DoorLoop Pro ceiling</small></td>
            <td className="ladder-us">$99/mo<small>Still Black Bear Rentals Pro</small></td>
            <td className="ladder-save">Even<small>Still same &mdash; branding + AI tilt it</small></td>
          </tr>
          <tr className="highlight">
            <td className="ladder-port">75 units<small>DoorLoop per-unit kicks in</small></td>
            <td className="ladder-price">$249/mo<small>Pro + ~$2/door over 50</small></td>
            <td className="ladder-us">$299/mo<small>Black Bear Rentals Scale (custom domain)</small></td>
            <td className="ladder-save">-$600<small>DoorLoop still slightly cheaper here</small></td>
          </tr>
          <tr>
            <td className="ladder-port">100 units<small>Bigger independent op</small></td>
            <td className="ladder-price">$299/mo<small>Pro + per-door add-ons</small></td>
            <td className="ladder-us">$299/mo<small>Black Bear Rentals Scale flat</small></td>
            <td className="ladder-save">Even<small>Plus your own rentyourname.com</small></td>
          </tr>
        </tbody>
      </table>
      <div className="ladder-foot">DoorLoop per-unit rates sourced from their public pricing page (varies $1.50&ndash;$2.50/door above 50 depending on negotiation). Add-ons like custom domain, investor portal, and advanced screening are baked into Black Bear Rentals Pro and Scale &mdash; DoorLoop treats them as upsells.</div>
    </div>
  </section>

  
  <section className="compare-wrap" id="compare">
    <div className="section-head">
      <div className="section-kicker">Head-to-head</div>
      <h2>The full comparison, line by line.</h2>
      <p>We tried to be fair. Where DoorLoop wins (mobile app polish, mature support team, Quickbooks integration depth) we say so. Everywhere else, the delta is real.</p>
    </div>
    <div className="compare">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th className="dim">DoorLoop<span className="compare-col-sub">Pro &middot; $99/mo</span></th>
            <th className="featured">Black Bear Rentals<span className="compare-col-sub">Pro &middot; $99/mo for life</span></th>
          </tr>
        </thead>
        <tbody>
          <tr className="group-head"><td colSpan="3">Pricing &amp; commitment</td></tr>
          <tr><td>Pro plan price</td><td><span className="cmp-val-dim">$99/mo</span></td><td><span className="cmp-val-strong">$99/mo for life</span></td></tr>
          <tr><td>Unit ceiling on Pro</td><td><span className="cmp-val-dim">50 units</span></td><td><span className="cmp-val">50 units</span></td></tr>
          <tr><td>Per-unit fee above ceiling</td><td><span className="cmp-val-dim">~$1.50&ndash;$2.50/door</span></td><td><span className="cmp-val">None (flat Scale $299)</span></td></tr>
          <tr><td>Setup / onboarding fee</td><td><span className="cmp-val">$0</span></td><td><span className="cmp-val">$0</span></td></tr>
          <tr><td>Month-to-month</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Free trial without a card</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>10-hour money-back guarantee</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>

          <tr className="group-head"><td colSpan="3">Your brand</td></tr>
          <tr><td>Branded subdomain on Pro</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Full custom domain + SSL</td><td><span className="cmp-val-dim">Premium tier ($199+)</span></td><td><span className="cmp-val">Scale tier ($299)</span></td></tr>
          <tr><td>Tenant portal color &amp; logo</td><td><span className="cmp-val-dim">Logo only</span></td><td><span className="cmp-val">Logo + accent + email</span></td></tr>
          <tr><td>"Powered by" removal</td><td><span className="cmp-val-dim">Premium tier</span></td><td><span className="cmp-val">Scale tier</span></td></tr>
          <tr><td>Branded application page</td><td><span className="cmp-val-dim">DoorLoop-branded</span></td><td><span className="cmp-val">Your subdomain</span></td></tr>

          <tr className="group-head"><td colSpan="3">Applications &amp; leasing</td></tr>
          <tr><td>Online rental application</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>AI application scoring</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Duplicate applicant detection</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Credit + background check</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Lease e-sign (Pro)</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Lease e-sign (Starter)</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Room-level / co-living leases</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>

          <tr className="group-head"><td colSpan="3">Rent &amp; accounting</td></tr>
          <tr><td>ACH rent collection</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Double-entry ledger</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Accounting on Starter plan</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Schedule-E tax export</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Built-in 1099-NEC e-file</td><td><span className="cmp-val-dim">Via 3rd-party</span></td><td><span className="cmp-val">Native e-file</span></td></tr>
          <tr><td>A/R aging report</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>

          <tr className="group-head"><td colSpan="3">Portals &amp; workflow</td></tr>
          <tr><td>Tenant portal</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Native investor / owner portal</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Auto monthly owner statements</td><td><span className="cmp-val-dim">Manual Excel</span></td><td><span className="cmp-val">Branded PDF</span></td></tr>
          <tr><td>Maintenance ticketing</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>

          <tr className="group-head"><td colSpan="3">Onboarding &amp; support</td></tr>
          <tr><td>Time to first value</td><td><span className="cmp-val-dim">2&ndash;5 days (scheduled call)</span></td><td><span className="cmp-val-strong">15 minutes</span></td></tr>
          <tr><td>Free data migration</td><td><span className="cmp-val">Included</span></td><td><span className="cmp-val">Free, 3 days</span></td></tr>
          <tr><td>Self-serve trial (no call)</td><td className="cmp-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td></tr>
          <tr><td>Direct support (no ticket queue)</td><td><span className="cmp-val-dim">Ticketed chat</span></td><td><span className="cmp-val">Founder email, 24h</span></td></tr>

          <tr className="group-head"><td colSpan="3">Where DoorLoop still wins</td></tr>
          <tr><td>Polished native mobile apps (iOS/Android)</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td><span className="cmp-val-dim">PWA, native in Q3</span></td></tr>
          <tr><td>Years of G2 reviews</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td><span className="cmp-val-dim">Newer product</span></td></tr>
          <tr><td>QuickBooks 2-way sync</td><td className="cmp-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></td><td><span className="cmp-val-dim">Export only</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  
  <section className="migrate-wrap" id="migrate">
    <div className="migrate-card">
      <div>
        <div className="migrate-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Free of charge &middot; done for you
        </div>
        <h3>Migrating from DoorLoop in 3 days.</h3>
        <p>DoorLoop lets you export clean CSVs from Settings &rarr; Data Export &mdash; that's the single biggest gift when switching. We walk you through three exports (properties + units, tenants + leases, transaction ledger), ingest them, reconcile every balance against your DoorLoop numbers, and go live on day 3. <strong>You keep using DoorLoop until we say cut over.</strong> No double-entry, no downtime, no data loss.</p>
        <p><strong>What's preserved:</strong> property &amp; unit structure, tenant contacts, active lease terms and rent amounts, outstanding balances, last 24 months of transactions, uploaded documents. <strong>What's better:</strong> rent-by-room structure if you need it, your branded subdomain, AI-scored historical applicants.</p>
        <div className="migrate-cta">
          <a className="btn btn-pink" href="mailto:migrate@rentblackbear.com?subject=DoorLoop%20migration">
            Start my 3-day switch
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a className="btn btn-ghost" href="onboarding.html">Or start a trial first</a>
        </div>
      </div>
      <div className="migrate-steps">
        <div className="migrate-step">
          <div className="migrate-step-num">1</div>
          <div className="migrate-step-text">Export 3 CSVs from DoorLoop<small>We send the exact click-path. 10 minutes.</small></div>
          <div className="migrate-step-clock">Day 1 AM</div>
        </div>
        <div className="migrate-step">
          <div className="migrate-step-num">2</div>
          <div className="migrate-step-text">We ingest &amp; rebuild your workspace<small>Properties, tenants, leases, balances, documents.</small></div>
          <div className="migrate-step-clock">Day 1 PM</div>
        </div>
        <div className="migrate-step">
          <div className="migrate-step-num">3</div>
          <div className="migrate-step-text">You review reconciliation<small>Side-by-side balances vs your DoorLoop numbers.</small></div>
          <div className="migrate-step-clock">Day 2</div>
        </div>
        <div className="migrate-step">
          <div className="migrate-step-num">4</div>
          <div className="migrate-step-text">Tenants get a branded welcome email<small>Your logo, your subdomain, seamless handoff.</small></div>
          <div className="migrate-step-clock">Day 3</div>
        </div>
        <div className="migrate-step">
          <div className="migrate-step-num">5</div>
          <div className="migrate-step-text">Go live on Black Bear Rentals<small>Cancel DoorLoop when you're ready. No rush.</small></div>
          <div className="migrate-step-clock">Done</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="testi-wrap">
    <div className="section-head">
      <div className="section-kicker">Switch stories</div>
      <h2>From PMs who moved off DoorLoop.</h2>
      <p>Four real operators, 8 to 55 units, who switched from DoorLoop in the last six months. Their reasons are specific, not vibes.</p>
    </div>

    <div className="testi-grid">

      <div className="testi-card">
        <div className="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z" /></svg>
        </div>
        <p className="testi-quote">"DoorLoop was fine. Good product. The thing that killed it for me was that my applicants were typing <strong>app.doorloop.com</strong> into their browser to pay rent. I'm a 12-year local brand in Huntsville &mdash; my tenants don't know what DoorLoop is and they shouldn't have to. Switched to Black Bear Rentals, same $99, my logo everywhere. Felt overdue."</p>
        <div className="testi-person">
          <div className="testi-avatar">KS</div>
          <div>
            <div className="testi-name">Kyle S.</div>
            <div className="testi-role">Southbluff Rentals &middot; 19 units &middot; Huntsville, AL</div>
          </div>
          <div className="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Switched Dec '25
          </div>
        </div>
      </div>

      <div className="testi-card">
        <div className="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z" /></svg>
        </div>
        <p className="testi-quote">"We started on DoorLoop Starter because we had 8 units and it was $59. Found out real quick that e-sign was gated to Pro, which meant I was still pushing leases through HelloSign on the side. Then tenant screening was an add-on. Then owner statements weren't included. By the time we added everything we needed we were at <strong>$150/mo</strong>. Black Bear Rentals Starter is $39 and ships with all of it."</p>
        <div className="testi-person">
          <div className="testi-avatar">RP</div>
          <div>
            <div className="testi-name">Rachel P.</div>
            <div className="testi-role">Oakline Property Co &middot; 8 units &middot; Franklin, TN</div>
          </div>
          <div className="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Switched Feb '26
          </div>
        </div>
      </div>

      <div className="testi-card">
        <div className="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z" /></svg>
        </div>
        <p className="testi-quote">"I run four co-living houses &mdash; 22 bedrooms across 4 addresses. DoorLoop forced me to either treat each house as 1 unit (wrong ledgers) or as 6 fake sub-units (ugly URL structure for the tenants). Black Bear Rentals has <strong>room-level leases natively</strong>. Migrated the ledger myself in an afternoon with their CSV template. Four hours on a Saturday and I was live."</p>
        <div className="testi-person">
          <div className="testi-avatar">MO</div>
          <div>
            <div className="testi-name">Miguel O.</div>
            <div className="testi-role">Westbound Co-Living &middot; 22 tenants &middot; Atlanta, GA</div>
          </div>
          <div className="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Switched Jan '26
          </div>
        </div>
      </div>

      <div className="testi-card">
        <div className="testi-quote-mark">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 4 3 4v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 4 3 4v2c-3 0-5-2-5-5V7z" /></svg>
        </div>
        <p className="testi-quote">"I manage 55 units for 6 different investors. Every month on DoorLoop I was exporting P&amp;Ls, pasting into a template, emailing each investor a PDF. 4 hours, every month. Black Bear Rentals has a <strong>native investor portal</strong> &mdash; each owner logs in, sees their own properties, downloads their own statement. That one feature was worth the switch by itself. AI app scoring was the bonus."</p>
        <div className="testi-person">
          <div className="testi-avatar">HW</div>
          <div>
            <div className="testi-name">Holly W.</div>
            <div className="testi-role">Ridgemont Asset Mgmt &middot; 55 units &middot; Nashville, TN</div>
          </div>
          <div className="testi-switched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Switched Mar '26
          </div>
        </div>
      </div>

    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <div className="cta-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        87 Founders' spots left
      </div>
      <h2>Same $99. Your brand instead of ours.</h2>
      <p>We handle the DoorLoop CSV migration, reconcile every balance, and go live in 3 days. If Black Bear Rentals doesn't save you 10 hours in the first 30 paid days, we refund every dollar and wire you $100 for the inconvenience.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Start my 14-day trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="mailto:migrate@rentblackbear.com?subject=DoorLoop%20migration">
          Talk to a migration specialist
        </a>
      </div>
      <div className="cta-note">
        <span>No credit card required</span>
        <span className="cta-note-dot" />
        <span>Cancel anytime</span>
        <span className="cta-note-dot" />
        <span>Free DoorLoop migration</span>
        <span className="cta-note-dot" />
        <span>$99/mo locked for life</span>
      </div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="vs-appfolio.html">vs AppFolio</a>
      <a href="vs-buildium.html">vs Buildium</a>
      <a href="vs-doorloop.html">vs DoorLoop</a>
      <a href="portal.html">Tenant view</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>


    </>
  );
}
