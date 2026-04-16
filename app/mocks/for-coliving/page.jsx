"use client";

// Mock ported from ~/Desktop/blackbear/for-coliving.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --red-bg: rgba(214,69,69,0.1);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 72px 32px 48px; text-align: center;\n      position: relative; overflow: hidden;\n    }\n    .hero::before {\n      content: \"\"; position: absolute; top: -280px; left: 50%; transform: translateX(-50%);\n      width: 900px; height: 560px;\n      background: radial-gradient(ellipse at center, var(--pink-bg), transparent 65%);\n      z-index: -1;\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(38px, 5.4vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.03;\n      max-width: 900px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 680px; margin: 0 auto 32px; line-height: 1.55;\n    }\n    .hero-sub strong { color: var(--text); font-weight: 700; }\n    .hero-actions { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center; }\n    .hero-meta {\n      display: inline-flex; gap: 28px; margin-top: 32px;\n      font-size: 13px; color: var(--text-muted); flex-wrap: wrap; justify-content: center;\n    }\n    .hero-meta-item { display: inline-flex; align-items: center; gap: 8px; }\n    .hero-meta-item svg { width: 14px; height: 14px; color: var(--green); }\n\n    /* ===== Operator cred bar ===== */\n    .cred {\n      max-width: 1100px; margin: 48px auto 0; padding: 0 32px;\n    }\n    .cred-card {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 28px 32px;\n      display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: center;\n    }\n    .cred-avatar {\n      width: 72px; height: 72px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--navy-dark), var(--blue));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 24px; letter-spacing: -0.02em;\n      box-shadow: var(--shadow);\n    }\n    .cred-text { font-size: 15px; color: var(--text); line-height: 1.55; }\n    .cred-text strong { color: var(--text); font-weight: 700; }\n    .cred-sig { margin-top: 8px; font-size: 13px; color: var(--text-muted); }\n\n    /* ===== Section shell ===== */\n    .section {\n      max-width: 1200px; margin: 0 auto; padding: 80px 32px 0;\n    }\n    .sec-eyebrow {\n      display: inline-block;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;\n      color: var(--blue); margin-bottom: 12px;\n    }\n    .sec-h2 {\n      font-size: clamp(28px, 3.4vw, 38px); font-weight: 900; letter-spacing: -0.025em;\n      line-height: 1.12; max-width: 780px; margin: 0 0 16px;\n    }\n    .sec-lead {\n      font-size: 17px; color: var(--text-muted); max-width: 680px; line-height: 1.55; margin-bottom: 40px;\n    }\n    .sec-lead strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Break cards (why other PM tools break) ===== */\n    .break-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .break-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      display: flex; flex-direction: column; gap: 12px;\n      position: relative;\n    }\n    .break-card:hover { border-color: var(--border-strong); }\n    .break-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--red-bg); color: var(--red);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .break-icon svg { width: 20px; height: 20px; }\n    .break-card h3 {\n      font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: var(--text);\n    }\n    .break-card p {\n      font-size: 14px; color: var(--text-muted); line-height: 1.55;\n    }\n    .break-card p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Solution grid ===== */\n    .sol-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;\n    }\n    .sol-card {\n      background: linear-gradient(180deg, var(--surface) 0%, var(--blue-softer) 100%);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 26px;\n      display: flex; flex-direction: column; gap: 14px;\n      transition: all 0.2s ease;\n    }\n    .sol-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue); }\n    .sol-icon {\n      width: 44px; height: 44px; border-radius: 12px;\n      background: var(--blue); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 6px 16px rgba(18,81,173,0.22);\n    }\n    .sol-icon svg { width: 22px; height: 22px; }\n    .sol-card h3 {\n      font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: var(--text);\n    }\n    .sol-card p {\n      font-size: 14px; color: var(--text-muted); line-height: 1.55;\n    }\n    .sol-card p strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Screenshot callout (per-room rent roll) ===== */\n    .shot-wrap {\n      margin-top: 40px;\n      background: linear-gradient(135deg, var(--navy-darker), var(--navy-dark) 60%, var(--blue));\n      border-radius: var(--radius-xl);\n      padding: 48px 40px;\n      position: relative; overflow: hidden;\n    }\n    .shot-wrap::before {\n      content: \"\"; position: absolute; top: -100px; right: -100px;\n      width: 420px; height: 420px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 65%);\n    }\n    .shot-header {\n      color: #fff; max-width: 620px; margin-bottom: 32px;\n      position: relative; z-index: 1;\n    }\n    .shot-header h3 {\n      font-size: clamp(22px, 2.6vw, 30px); font-weight: 800; letter-spacing: -0.02em;\n      line-height: 1.18; margin-bottom: 10px;\n    }\n    .shot-header p {\n      font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.55;\n    }\n    .shot-browser {\n      background: var(--surface); border-radius: var(--radius-lg);\n      overflow: hidden; box-shadow: var(--shadow-xl);\n      position: relative; z-index: 1;\n    }\n    .shot-chrome {\n      background: var(--surface-alt); border-bottom: 1px solid var(--border);\n      padding: 10px 16px; display: flex; align-items: center; gap: 10px;\n    }\n    .shot-dots { display: flex; gap: 5px; }\n    .shot-dot { width: 10px; height: 10px; border-radius: 50%; background: #d8deea; }\n    .shot-dot:nth-child(1) { background: #ff5f57; }\n    .shot-dot:nth-child(2) { background: #f5a623; }\n    .shot-dot:nth-child(3) { background: #27c93f; }\n    .shot-url {\n      flex: 1; font-size: 12px; color: var(--text-muted); font-weight: 500;\n      padding: 5px 12px; background: var(--surface); border-radius: 100px;\n      border: 1px solid var(--border); display: inline-flex; align-items: center; gap: 8px;\n    }\n    .shot-url svg { width: 11px; height: 11px; color: var(--green); }\n\n    .shot-body { padding: 28px; }\n    .shot-head-row {\n      display: flex; align-items: center; justify-content: space-between;\n      margin-bottom: 20px; flex-wrap: wrap; gap: 12px;\n    }\n    .shot-title { font-weight: 800; font-size: 18px; letter-spacing: -0.01em; color: var(--text); }\n    .shot-filters { display: inline-flex; gap: 6px; }\n    .shot-chip {\n      padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;\n      background: var(--blue-pale); color: var(--blue); border: 1px solid rgba(18,81,173,0.18);\n    }\n    .shot-chip.muted { background: var(--surface-alt); color: var(--text-muted); border-color: var(--border); }\n\n    .rentroll {\n      border: 1px solid var(--border); border-radius: var(--radius);\n      overflow: hidden; font-size: 13px;\n    }\n    .rr-row {\n      display: grid; grid-template-columns: 2.2fr 1.5fr 1fr 1fr 1fr;\n      padding: 10px 14px; align-items: center;\n      border-bottom: 1px solid var(--border);\n    }\n    .rr-row:last-child { border-bottom: none; }\n    .rr-row.rr-header {\n      background: var(--surface-subtle); font-size: 11px; font-weight: 700;\n      color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase;\n    }\n    .rr-row.rr-property {\n      background: linear-gradient(90deg, var(--blue-softer), transparent);\n      font-weight: 700; color: var(--text);\n    }\n    .rr-row.rr-property .rr-cell.rr-name { display: flex; align-items: center; gap: 8px; }\n    .rr-prop-icon {\n      width: 22px; height: 22px; border-radius: 6px;\n      background: var(--blue); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .rr-prop-icon svg { width: 12px; height: 12px; }\n    .rr-row.rr-room {\n      padding-left: 28px;\n    }\n    .rr-row.rr-room .rr-cell.rr-name {\n      color: var(--text); font-weight: 500;\n      padding-left: 12px; position: relative;\n    }\n    .rr-row.rr-room .rr-cell.rr-name::before {\n      content: \"\"; position: absolute; left: 0; top: 50%;\n      width: 6px; height: 1px; background: var(--border-strong);\n    }\n    .rr-cell.rr-tenant { color: var(--text-muted); }\n    .rr-cell.rr-rent { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--text); }\n    .rr-cell.rr-status {\n      display: inline-flex; align-items: center; justify-content: flex-start;\n    }\n    .rr-badge {\n      padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 700;\n      display: inline-flex; align-items: center; gap: 4px;\n    }\n    .rr-badge.ok { background: var(--green-bg); color: var(--green-dark); }\n    .rr-badge.due { background: var(--pink-bg); color: #c21a6a; }\n    .rr-badge.vac { background: var(--surface-alt); color: var(--text-muted); }\n    .rr-badge.part { background: rgba(245,166,35,0.16); color: #b47500; }\n    .rr-badge svg { width: 10px; height: 10px; }\n\n    .rr-summary {\n      padding: 14px 16px; background: var(--surface-subtle); border-top: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n      font-size: 13px; color: var(--text-muted); flex-wrap: wrap; gap: 12px;\n    }\n    .rr-summary strong { color: var(--text); font-weight: 700; }\n\n    .shot-caption {\n      margin-top: 22px; color: rgba(255,255,255,0.75); font-size: 13px;\n      max-width: 760px; line-height: 1.55; position: relative; z-index: 1;\n    }\n    .shot-caption strong { color: #fff; font-weight: 700; }\n\n    /* ===== Case study ===== */\n    .case-wrap {\n      margin-top: 40px;\n      display: grid; grid-template-columns: 360px 1fr; gap: 32px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px;\n    }\n    .case-side {\n      display: flex; flex-direction: column; gap: 18px;\n      padding-right: 28px; border-right: 1px solid var(--border);\n    }\n    .case-avatar-row { display: flex; align-items: center; gap: 14px; }\n    .case-avatar {\n      width: 56px; height: 56px; border-radius: 50%;\n      background: linear-gradient(135deg, #f5a623, #e67e22);\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 20px;\n    }\n    .case-name { font-weight: 800; font-size: 16px; color: var(--text); }\n    .case-role { font-size: 13px; color: var(--text-muted); }\n\n    .case-stat {\n      padding: 14px 16px; background: var(--surface-subtle);\n      border-radius: var(--radius); border: 1px solid var(--border);\n    }\n    .case-stat-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      color: var(--text-muted); margin-bottom: 4px;\n    }\n    .case-stat-value { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }\n    .case-stat-value em { font-style: normal; color: var(--green-dark); }\n\n    .case-body { padding-left: 4px; }\n    .case-quote {\n      font-size: 19px; font-weight: 600; line-height: 1.45; letter-spacing: -0.01em;\n      color: var(--text); margin-bottom: 20px;\n    }\n    .case-quote::before { content: \"\\201C\"; color: var(--pink); font-size: 40px; line-height: 0; vertical-align: -6px; margin-right: 4px; }\n    .case-quote::after { content: \"\\201D\"; color: var(--pink); font-size: 40px; line-height: 0; vertical-align: -20px; margin-left: 2px; }\n    .case-detail { font-size: 14.5px; color: var(--text-muted); line-height: 1.65; margin-bottom: 14px; }\n    .case-detail strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Pricing note ===== */\n    .pricenote {\n      margin-top: 32px;\n      background: linear-gradient(135deg, var(--blue-softer), #fff);\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 32px 36px;\n      display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;\n    }\n    .pricenote-label { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }\n    .pricenote-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin-bottom: 8px; }\n    .pricenote-sub { font-size: 15px; color: var(--text-muted); line-height: 1.55; max-width: 520px; }\n    .pricenote-sub strong { color: var(--text); font-weight: 700; }\n    .pricenote-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }\n    .pricenote-price { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); }\n    .pricenote-price span { font-size: 15px; color: var(--text-muted); font-weight: 500; }\n\n    /* ===== FAQ ===== */\n    .faq { max-width: 860px; margin: 0 auto; padding: 80px 32px 0; }\n    .faq-h2 { font-size: 32px; font-weight: 900; letter-spacing: -0.025em; text-align: center; margin-bottom: 12px; }\n    .faq-sub { text-align: center; color: var(--text-muted); margin-bottom: 36px; }\n    .faq-item {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); margin-bottom: 10px; overflow: hidden;\n    }\n    .faq-q {\n      width: 100%; text-align: left; padding: 18px 22px;\n      display: flex; align-items: center; justify-content: space-between; gap: 12px;\n      font-weight: 700; font-size: 15.5px; color: var(--text); letter-spacing: -0.01em;\n    }\n    .faq-q:hover { background: var(--surface-subtle); }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--blue); }\n    .faq-a {\n      max-height: 0; overflow: hidden; transition: max-height 0.28s ease, padding 0.28s ease;\n      padding: 0 22px;\n      color: var(--text-muted); font-size: 15px; line-height: 1.65;\n    }\n    .faq-item.open .faq-a { max-height: 520px; padding: 0 22px 20px; }\n    .faq-a strong { color: var(--text); font-weight: 700; }\n    .faq-a p + p { margin-top: 10px; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom { max-width: 1200px; margin: 80px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -120px; left: 50%; transform: translateX(-50%);\n      width: 640px; height: 420px;\n      background: radial-gradient(ellipse, var(--pink-bg), transparent 65%);\n    }\n    .cta-card h2 {\n      font-size: clamp(28px, 3.4vw, 38px); font-weight: 900; letter-spacing: -0.025em;\n      line-height: 1.15; max-width: 720px; margin: 0 auto 16px; position: relative; z-index: 1;\n    }\n    .cta-card p {\n      font-size: 16px; color: rgba(255,255,255,0.75); max-width: 620px;\n      margin: 0 auto 28px; line-height: 1.6; position: relative; z-index: 1;\n    }\n    .cta-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }\n    .cta-card .btn-ghost { border-color: rgba(255,255,255,0.35); color: #fff; background: transparent; }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 18px; position: relative; z-index: 1; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; flex-wrap: wrap; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .break-grid, .sol-grid { grid-template-columns: repeat(2, 1fr); }\n      .case-wrap { grid-template-columns: 1fr; }\n      .case-side { border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; padding-bottom: 24px; }\n      .pricenote { grid-template-columns: 1fr; }\n      .pricenote-actions { align-items: flex-start; }\n    }\n\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .section { padding: 56px 20px 0; }\n      .faq { padding-left: 20px; padding-right: 20px; }\n      .cta-bottom { padding-left: 20px; padding-right: 20px; }\n      .foot { padding-left: 20px; padding-right: 20px; }\n      .break-grid, .sol-grid { grid-template-columns: 1fr; }\n      .cred-card { grid-template-columns: 1fr; text-align: center; }\n      .cred-avatar { margin: 0 auto; }\n      .rr-row { grid-template-columns: 1.8fr 1.2fr 0.8fr 0.9fr; font-size: 12px; padding: 8px 10px; }\n      .rr-row .rr-cell.rr-status { grid-column: 4 / 5; }\n      .rr-row .rr-cell.rr-rent { grid-column: 3 / 4; }\n      .rr-row.rr-header .rr-cell:nth-child(5), .rr-row:not(.rr-header) .rr-cell:nth-child(5) { display: none; }\n      .shot-wrap { padding: 32px 20px; }\n      .shot-body { padding: 18px; }\n      .cta-card { padding: 40px 22px; }\n      .pricenote { padding: 24px; }\n      .case-wrap { padding: 24px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="for-coliving.html">For co-living</a>
      <a className="tb-nav-item" href="vs-appfolio.html">vs. AppFolio</a>
      <a className="tb-nav-item" href="stories.html">Stories</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></svg>
      For co-living, rent-by-the-room, and student housing
    </div>
    <h1>Built for the landlord <em>AppFolio forgot about</em>.</h1>
    <p className="hero-sub">If a "unit" in your world is a <strong>bedroom</strong>, not an apartment, you already know every PM tool on the market breaks in the same four places. Black Bear Rentals is the only one that treats a room as a first-class unit — per-room leases, per-room rent roll, housemate-aware portal, shared utility splitting that doesn't live in a spreadsheet.</p>
    <div className="hero-actions">
      <a className="btn btn-pink btn-lg" href="onboarding.html">Start 14-day trial
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </a>
      <a className="btn btn-ghost btn-lg" href="#rentroll">See the per-room rent roll</a>
    </div>
    <div className="hero-meta">
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        No credit card required
      </div>
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Up to 50 rooms on Pro — $99/mo
      </div>
      <div className="hero-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Built by a 15-room operator
      </div>
    </div>
  </section>

  
  <section className="cred">
    <div className="cred-card">
      <div className="cred-avatar">HC</div>
      <div>
        <div className="cred-text">
          I run <strong>Black Bear Rentals</strong> in Huntsville, Alabama — 15+ rooms across three houses, co-living model. For three years I stitched together AppFolio, QuickBooks, DocuSign, and a Google Sheet with a tab per room. Nothing on the market treated a bedroom as a unit. So I built Black Bear Rentals for operators like us. Every feature on this page I use in production, Monday morning, on my own portfolio.
        </div>
        <div className="cred-sig">— Harrison Cooper, founder</div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">The problem</div>
    <h2 className="sec-h2">Why every PM tool you've tried breaks for co-living.</h2>
    <p className="sec-lead">We've run the AppFolio trial. We've run the Buildium trial. We've paid for Landlord Studio, RentRedi, TurboTenant. <strong>They all break in the same places.</strong> Here's the list, in order of how much it actually costs you.</p>

    <div className="break-grid">
      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /></svg>
        </div>
        <h3>"Unit" means apartment, not room</h3>
        <p>One property, six bedrooms, six leases — every tool sees that as one unit. You either fake it by registering six phantom "units" at the same address (which breaks every report) or you track it in a spreadsheet off to the side. Both cost you hours a week.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 10h12" /><path d="M9 14h12" /><path d="M9 18h12" /><path d="M3 10h3" /><path d="M3 14h3" /><path d="M3 18h3" /></svg>
        </div>
        <h3>The rent roll is aggregate, not per-room</h3>
        <p>When your banker asks for a rent roll on a co-living house, they want to see <strong>every lease, every tenant, every amount</strong>. Not "Oak House: $4,800/mo." That tells them nothing about vacancy risk or per-room performance. Most tools can't produce it without an Excel export and a pivot table.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <h3>No multi-tenant-per-property model</h3>
        <p>Three strangers living in one house are not roommates on one lease — they're three independent leases that happen to share a kitchen. Most tools force them onto one lease, which breaks screening, accounting, and the move-out chain when one leaves.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        <h3>No utility splitting</h3>
        <p>The power bill comes in. Six tenants share it. Do you split it equally? By room size? By days occupied? Every tool expects the <em>landlord</em> to eat utilities or roll them into rent. Co-living operators do neither. We split, and we split in a way that needs to be documented per-person per-month.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <h3>Tenants see each other's data</h3>
        <p>On most portals, a "property" is the ledger — so if six tenants log into the same unit, they see each other's rent amounts, payment history, and late fees. That's a privacy disaster for a co-living house. Tenants are roommates, not business partners.</p>
      </div>

      <div className="break-card">
        <div className="break-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h6" /></svg>
        </div>
        <h3>Lease templates don't cover room-level terms</h3>
        <p>"Exclusive use of Bedroom 3." "Shared use of kitchen, living room, and second bathroom." "Quiet hours." "Guest policy." "Common-area cleaning schedule." Generic single-tenant lease templates miss every one of these. You end up editing leases by hand and praying the Word doc didn't drop a clause.</p>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">The fix</div>
    <h2 className="sec-h2">What Black Bear Rentals does differently.</h2>
    <p className="sec-lead">Every feature below is live today and I use all of them on Black Bear Rentals. <strong>Not on a roadmap. Not a beta.</strong> Open the trial, add a co-living property, and every one of these lights up.</p>

    <div className="sol-grid">
      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V11l7-4v14" /><path d="M19 21V13l-7-4" /><circle cx="8" cy="16" r="1" /><circle cx="15" cy="16" r="1" /></svg>
        </div>
        <h3>Per-room leases</h3>
        <p>Room is the unit. Six leases in one house is six independent agreements — with their own terms, their own rent, their own deposit, their own start/end dates. Tenant A moves out in June, tenant B stays through December. Black Bear Rentals doesn't blink.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M9 10v10" /></svg>
        </div>
        <h3>Per-room rent roll PDFs</h3>
        <p>One-click rent roll that shows every property, every room inside it, the tenant, the rent, and the status. Grouped exactly how a banker wants to see it. Diagonal drill-down: click the property, see the rooms. Click a room, see the lease. Your LP deck writes itself.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10V7a5 5 0 0 1 10 0v3" /><rect x="5" y="10" width="14" height="11" rx="2" /></svg>
        </div>
        <h3>Housemate-aware tenant portal</h3>
        <p>Each tenant sees only their own lease, their own rent, their own maintenance tickets. They can see shared-house info (common-area issues, shared utility splits for the month, house rules, contact info for housemates if the operator opts them in) but never another tenant's private financial data. Privacy by default.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
        </div>
        <h3>Shared utility allocation</h3>
        <p>Upload the power bill, the water bill, the internet bill. Black Bear Rentals splits by person, by room count, by room size, or by a custom formula — whichever you set at the property level. The split appears as a line item on each tenant's next statement. You never touch a spreadsheet.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v7H2V8l6-6h8v4" /><path d="M16 11V7h5l3 4v5h-3" /><circle cx="7" cy="18" r="2" /><circle cx="19" cy="18" r="2" /></svg>
        </div>
        <h3>Room-level maintenance tickets</h3>
        <p>A ticket is scoped to a specific room or to a shared area. Your vendor sees "Bedroom 3, broken window lock" or "Kitchen, dishwasher drain clogged" — not "Oak House, something's broken somewhere." Photos, priority, and SLA are all per-ticket, and only the affected tenant gets the status emails.</p>
      </div>

      <div className="sol-card">
        <div className="sol-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
        </div>
        <h3>Per-room photos + marketing</h3>
        <p>Each room has its own photo set, its own listing copy, its own rent, its own availability date. When a room opens up, you publish a listing for <em>that room</em>, not for the whole house. Applications come in scoped to the room they applied for. No more "I wanted the big room, why did I get the small one?"</p>
      </div>
    </div>
  </section>

  
  <section className="section" id="rentroll">
    <div className="sec-eyebrow">What it looks like</div>
    <h2 className="sec-h2">The rent roll your banker actually wants.</h2>
    <p className="sec-lead">This is a real rent roll from a real co-living portfolio — names changed, numbers real. <strong>Property → room → tenant → status.</strong> One click to PDF. One link to your LPs.</p>

    <div className="shot-wrap">
      <div className="shot-header">
        <h3>Per-room rent roll, generated live.</h3>
        <p>No pivot tables. No Excel gymnastics. The rent roll groups rooms under properties, shows tenant and status for each, and totals the whole portfolio at the bottom.</p>
      </div>

      <div className="shot-browser">
        <div className="shot-chrome">
          <div className="shot-dots">
            <span className="shot-dot" />
            <span className="shot-dot" />
            <span className="shot-dot" />
          </div>
          <div className="shot-url">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            app.rentblackbear.com/reports/rent-roll
          </div>
        </div>

        <div className="shot-body">
          <div className="shot-head-row">
            <div className="shot-title">Rent roll — April 2026</div>
            <div className="shot-filters">
              <span className="shot-chip">Grouped by property</span>
              <span className="shot-chip muted">3 properties</span>
              <span className="shot-chip muted">15 rooms</span>
            </div>
          </div>

          <div className="rentroll">
            <div className="rr-row rr-header">
              <div className="rr-cell">Property / Room</div>
              <div className="rr-cell">Tenant</div>
              <div className="rr-cell">Rent</div>
              <div className="rr-cell">Status</div>
              <div className="rr-cell">Lease ends</div>
            </div>

            
            <div className="rr-row rr-property">
              <div className="rr-cell rr-name">
                <span className="rr-prop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg></span>
                Oak House · 412 Clinton Ave
              </div>
              <div className="rr-cell rr-tenant">6 rooms</div>
              <div className="rr-cell rr-rent">$5,100</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok">6/6 occupied</span></div>
              <div className="rr-cell" />
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 1</div>
              <div className="rr-cell rr-tenant">Marcus K.</div>
              <div className="rr-cell rr-rent">$900</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Sep 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 2</div>
              <div className="rr-cell rr-tenant">Priya S.</div>
              <div className="rr-cell rr-rent">$875</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Jan 2027</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 3</div>
              <div className="rr-cell rr-tenant">David L.</div>
              <div className="rr-cell rr-rent">$850</div>
              <div className="rr-cell rr-status"><span className="rr-badge part">Partial</span></div>
              <div className="rr-cell rr-tenant">Jun 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 4 (master)</div>
              <div className="rr-cell rr-tenant">Elena R.</div>
              <div className="rr-cell rr-rent">$1,050</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Dec 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 5</div>
              <div className="rr-cell rr-tenant">James W.</div>
              <div className="rr-cell rr-rent">$825</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Aug 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 6</div>
              <div className="rr-cell rr-tenant">Nia B.</div>
              <div className="rr-cell rr-rent">$600</div>
              <div className="rr-cell rr-status"><span className="rr-badge due">Past due 3d</span></div>
              <div className="rr-cell rr-tenant">Nov 2026</div>
            </div>

            
            <div className="rr-row rr-property">
              <div className="rr-cell rr-name">
                <span className="rr-prop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg></span>
                Maple House · 1847 Pratt Ave
              </div>
              <div className="rr-cell rr-tenant">5 rooms</div>
              <div className="rr-cell rr-rent">$4,325</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok">5/5 occupied</span></div>
              <div className="rr-cell" />
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 1</div>
              <div className="rr-cell rr-tenant">Zoe H.</div>
              <div className="rr-cell rr-rent">$875</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Autopay</span></div>
              <div className="rr-cell rr-tenant">Apr 2027</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 2</div>
              <div className="rr-cell rr-tenant">Tomás V.</div>
              <div className="rr-cell rr-rent">$825</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Autopay</span></div>
              <div className="rr-cell rr-tenant">Oct 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 3</div>
              <div className="rr-cell rr-tenant">Grace P.</div>
              <div className="rr-cell rr-rent">$825</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Jul 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 4</div>
              <div className="rr-cell rr-tenant">Devon M.</div>
              <div className="rr-cell rr-rent">$875</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">May 2027</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 5 (basement)</div>
              <div className="rr-cell rr-tenant">Anika J.</div>
              <div className="rr-cell rr-rent">$925</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Autopay</span></div>
              <div className="rr-cell rr-tenant">Feb 2027</div>
            </div>

            
            <div className="rr-row rr-property">
              <div className="rr-cell rr-name">
                <span className="rr-prop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg></span>
                Cedar House · 903 Dunn St
              </div>
              <div className="rr-cell rr-tenant">4 rooms</div>
              <div className="rr-cell rr-rent">$3,400</div>
              <div className="rr-cell rr-status"><span className="rr-badge part">3/4 occupied</span></div>
              <div className="rr-cell" />
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 1</div>
              <div className="rr-cell rr-tenant">Ravi T.</div>
              <div className="rr-cell rr-rent">$900</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Autopay</span></div>
              <div className="rr-cell rr-tenant">Mar 2027</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 2</div>
              <div className="rr-cell rr-tenant">Sam O.</div>
              <div className="rr-cell rr-rent">$850</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Dec 2026</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 3</div>
              <div className="rr-cell rr-tenant">Lena F.</div>
              <div className="rr-cell rr-rent">$825</div>
              <div className="rr-cell rr-status"><span className="rr-badge ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Paid</span></div>
              <div className="rr-cell rr-tenant">Jan 2027</div>
            </div>
            <div className="rr-row rr-room">
              <div className="rr-cell rr-name">Bedroom 4</div>
              <div className="rr-cell rr-tenant">—</div>
              <div className="rr-cell rr-rent">$825</div>
              <div className="rr-cell rr-status"><span className="rr-badge vac">Vacant · listing live</span></div>
              <div className="rr-cell rr-tenant">—</div>
            </div>

            <div className="rr-summary">
              <div>Portfolio occupancy: <strong>14 of 15 rooms (93.3%)</strong></div>
              <div>Monthly collected rent: <strong>$12,225</strong> · Annualized: <strong>$146,700</strong></div>
            </div>
          </div>

          <div className="shot-head-row" style={{marginTop: "18px"}}>
            <div className="shot-filters">
              <span className="shot-chip">Export PDF</span>
              <span className="shot-chip muted">Share with LP</span>
              <span className="shot-chip muted">Schedule monthly</span>
            </div>
          </div>
        </div>
      </div>

      <p className="shot-caption">This exact report runs across <strong>Black Bear Rentals</strong> on the first of every month. My LPs get a PDF in their inbox at 8am. The whole job takes me zero minutes — because I never touch it.</p>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">Case study</div>
    <h2 className="sec-h2">18 rooms. Three houses. Atlanta.</h2>
    <p className="sec-lead">Marcus runs a co-living operation across three Atlanta properties — 18 bedrooms total. For three years he held it together with spreadsheets, QuickBooks, and a hand-coded landing page. Here's what changed in his first 90 days on Black Bear Rentals.</p>

    <div className="case-wrap">
      <div className="case-side">
        <div className="case-avatar-row">
          <div className="case-avatar">MA</div>
          <div>
            <div className="case-name">Marcus A.</div>
            <div className="case-role">Founder · co-living operator · Atlanta, GA</div>
          </div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Portfolio</div>
          <div className="case-stat-value">18 rooms · 3 houses</div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Switched from</div>
          <div className="case-stat-value">Spreadsheets + QuickBooks</div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">Maintenance cost change · Q1</div>
          <div className="case-stat-value"><em>-22%</em></div>
        </div>

        <div className="case-stat">
          <div className="case-stat-label">On Black Bear Rentals since</div>
          <div className="case-stat-value">Nov 2025</div>
        </div>
      </div>

      <div className="case-body">
        <p className="case-quote">The per-room rent roll is the killer feature. Other PM tools think a "unit" is an apartment. For co-living, that's useless — I needed a room as the unit. Black Bear Rentals got that on day one. Plus the investor PDF that auto-generates every month? My LPs love it. Makes me look like I have ops.</p>

        <p className="case-detail">Before Black Bear Rentals, Marcus ran rent reconciliation out of a Google Sheet with one tab per property and one row per bedroom. Three payment methods flowed in — Zelle, Venmo, the occasional check — and it took him a full Saturday every month to match rent paid against rent owed. Investor reports were hand-built in PowerPoint.</p>

        <p className="case-detail"><strong>The unlock was per-room accounting.</strong> "I had one LP ask me for year-over-year per-room rent growth on Oak House, and I couldn't answer it without an afternoon of Excel. On Black Bear Rentals it's two clicks."</p>

        <p className="case-detail">The unexpected win was <strong>vendor adoption</strong>. "Maintenance costs dropped 22% in Q1 because vendors adopted the vendor portal — fewer emergency calls, more scheduled visits. Joel, my plumber, says it's the only PM tool he doesn't hate. I think that's a real bar."</p>

        <p className="case-detail">Housemate-aware portal solved a problem he didn't know he had: "Before, if one tenant was late on rent, the other five in the house could see it in our shared group chat when I'd send the reminder. Awkward. Black Bear Rentals sends each tenant their own reminder. Housemates never know."</p>
      </div>
    </div>
  </section>

  
  <section className="section">
    <div className="sec-eyebrow">Pricing</div>
    <h2 className="sec-h2">Most co-living operators live on Pro.</h2>
    <p className="sec-lead">Up to 50 rooms for $99 a month. Flat. A 10-bedroom operator pays $9.90 per room. A 40-bedroom operator pays $2.47 per room. <strong>The math is boring and that's the point.</strong></p>

    <div className="pricenote">
      <div>
        <div className="pricenote-label">Pro</div>
        <div className="pricenote-title">$99/mo. Up to 50 rooms. Everything on this page.</div>
        <div className="pricenote-sub">Per-room leases, per-room rent roll, shared utility splitting, housemate-aware portal, room-level tickets, your own branded subdomain, AI application scoring, 1099 automation, Schedule E export, and a <strong>14-day free trial with no credit card</strong>. If it doesn't save you 12 hours in the first 30 paid days, full refund plus $100 wired for your time.</div>
      </div>
      <div className="pricenote-actions">
        <div className="pricenote-price">$99<span>/mo</span></div>
        <a className="btn btn-primary btn-lg" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a className="btn btn-ghost btn-nav" href="pricing.html">See all plans</a>
      </div>
    </div>
  </section>

  
  <section className="faq">
    <h2 className="faq-h2">Co-living questions we get every week.</h2>
    <p className="faq-sub">The ones I'd ask if I were you.</p>

    <div className="faq-item">
      <button className="faq-q">
        <span>How do leases work per room?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Each room is its own leaseable unit under a parent property. You draft a lease scoped to "Bedroom 3 at 412 Clinton Ave" with its own rent, deposit, start/end dates, and terms. The tenant signs it through DocuSign-level e-sign (built in, no extra fee). Six rooms in a house means six leases — each one independent, each one searchable, each one with its own renewal track.</p>
        <p>Your 20-section state-specific lease template includes co-living clauses: exclusive use of the bedroom, shared use of common spaces, quiet hours, guest policy, cleaning schedule, and shared utility allocation. <strong>All editable. All state-compliant.</strong></p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>What about shared utilities — how do you split them?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Four built-in splitting methods, set at the property level: <strong>equal per person</strong> (power bill ÷ 6), <strong>equal per room</strong> (useful when some rooms have more than one occupant), <strong>proportional to room size</strong> (based on square footage you set at room creation), or a <strong>custom formula</strong> (e.g., master bedroom pays 25%, others split the remaining 75% equally).</p>
        <p>You upload the bill PDF or enter the dollar amount. Black Bear Rentals adds the split as a line item on each tenant's next monthly statement — clearly labeled "Power (shared, April) — your share: $34.50." Tenants see exactly what they owe and why. You never open a spreadsheet.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>Can my tenants see each other's rent and payment info?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>No. Each tenant portal is scoped to that individual tenant's lease. They see their own rent, their own payment history, their own receipts, their own maintenance tickets. They <em>can't</em> see what their housemates are paying, or whether someone else is behind on rent.</p>
        <p>You as the operator optionally let tenants see shared-house info — a housemate directory (names and first-party contact info, with each tenant opting in), shared maintenance tickets for common areas, house rules, shared utility totals for the month (not per-person splits). Everything private stays private by default.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>We run student housing — do you support per-semester leases?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Yes. Lease terms are arbitrary — you set start and end dates per lease. Most of our student-housing operators run 4-month (fall/spring) or 9-month (academic year) leases per room. Summer leases at reduced rent are their own lease entry.</p>
        <p>Renewal automation kicks in 60 days before lease end, so August 15 leases trigger a renewal nudge in mid-June — right before students scatter for summer. You can set per-room different renewal rates (e.g., $50 bump on long-staying tenants, flat rent for new 9-month signers).</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>What about ADUs, backyard cottages, or mother-in-law suites?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>Supported natively. An ADU is modeled as its own leaseable unit under a parent property — same data model as a bedroom, with its own address suffix ("412 Clinton Ave, Rear Cottage"), its own rent, its own utility metering, its own lease template. You can also mix models on one property: 3 bedrooms under the co-living model plus a detached ADU rented as a full private unit. Black Bear Rentals treats each correctly — the ADU tenant gets their own private portal, the bedroom tenants get the housemate-aware view.</p>
      </div>
    </div>

    <div className="faq-item">
      <button className="faq-q">
        <span>Is there a cap on rooms per property?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      </button>
      <div className="faq-a">
        <p>No per-property cap. One property can have 12 bedrooms if that's how your building is zoned. The only cap is on your plan: <strong>Pro supports up to 50 total rooms across all properties</strong>, Scale is unlimited. Every co-living operator I know under 50 rooms fits Pro with room to grow.</p>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>If you run rent-by-the-room, Black Bear Rentals is the only tool built for you. Try it for 14 days.</h2>
      <p>14-day free trial. No card. If it doesn't save you 12 hours a week in the first 30 paid days, I refund every dollar and wire you $100 for your time. I have not paid it once.</p>
      <div className="cta-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="mailto:harrison@rentblackbear.com?subject=Co-living%20operator%20question">Email Harrison directly</a>
      </div>
      <div className="cta-note">Built in Huntsville, AL by an operator with 15+ rooms of his own.</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="for-coliving.html">For co-living</a>
      <a href="vs-appfolio.html">vs. AppFolio</a>
      <a href="stories.html">Stories</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
    </div>
  </footer>

  

    </>
  );
}
