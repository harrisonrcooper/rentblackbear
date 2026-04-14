"use client";

// Mock ported from ~/Desktop/tenantory/demo.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar (matches pricing.html) ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 100;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 15px 28px; font-size: 15px; }\n    .btn-xl { padding: 18px 34px; font-size: 16px; border-radius: 100px; font-weight: 700; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 80px 32px 60px; text-align: center;\n      background: radial-gradient(ellipse at 50% 0%, var(--blue-softer), transparent 60%);\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 8px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n      margin-bottom: 20px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5.6vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      color: var(--text);\n      max-width: 860px; margin: 0 auto 20px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub {\n      font-size: 18px; color: var(--text-muted);\n      max-width: 620px; margin: 0 auto 34px; line-height: 1.55;\n    }\n    .hero-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; }\n    .hero-meta {\n      margin-top: 22px; display: flex; gap: 22px; justify-content: center;\n      font-size: 13px; color: var(--text-faint); flex-wrap: wrap;\n    }\n    .hero-meta span { display: inline-flex; align-items: center; gap: 6px; }\n    .hero-meta svg { width: 14px; height: 14px; color: var(--green); }\n\n    /* ===== Tour layout ===== */\n    .tour {\n      max-width: 1280px; margin: 0 auto; padding: 40px 32px 80px;\n      display: grid; grid-template-columns: 240px 1fr; gap: 48px;\n      align-items: flex-start;\n    }\n    .rail {\n      position: sticky; top: 96px;\n      display: flex; flex-direction: column; gap: 6px;\n      padding: 8px 0;\n    }\n    .rail-title {\n      font-size: 11px; font-weight: 700; color: var(--text-muted);\n      letter-spacing: 0.14em; text-transform: uppercase;\n      padding: 6px 12px 12px;\n    }\n    .rail-pill {\n      display: flex; align-items: center; gap: 12px;\n      padding: 10px 12px; border-radius: 10px;\n      font-size: 13.5px; font-weight: 600; color: var(--text-muted);\n      cursor: pointer; border: 1px solid transparent;\n      transition: all 0.18s ease; text-align: left; width: 100%;\n      line-height: 1.3;\n    }\n    .rail-pill:hover { background: var(--surface-alt); color: var(--text); }\n    .rail-num {\n      flex-shrink: 0;\n      width: 24px; height: 24px; border-radius: 50%;\n      background: var(--surface-alt); color: var(--text-muted);\n      display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 800; border: 1px solid var(--border);\n      transition: all 0.18s ease;\n    }\n    .rail-pill.active {\n      background: var(--blue-softer); color: var(--navy);\n      border-color: rgba(18,81,173,0.15);\n    }\n    .rail-pill.active .rail-num {\n      background: var(--blue); color: #fff; border-color: var(--blue);\n    }\n    .rail-pill.done .rail-num {\n      background: var(--green-bg); color: var(--green-dark); border-color: transparent;\n    }\n\n    .scenes { display: flex; flex-direction: column; gap: 56px; }\n    .scene {\n      opacity: 0; transform: translateY(18px);\n      transition: opacity 0.6s ease, transform 0.6s ease;\n      scroll-margin-top: 96px;\n    }\n    .scene.in-view { opacity: 1; transform: none; }\n\n    .scene-head { margin-bottom: 18px; }\n    .scene-num {\n      display: inline-flex; align-items: center; gap: 10px;\n      font-size: 12px; font-weight: 700; color: var(--blue);\n      letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 10px;\n    }\n    .scene-num-dot {\n      width: 22px; height: 22px; border-radius: 50%;\n      background: var(--blue); color: #fff;\n      display: inline-flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 800; letter-spacing: 0;\n    }\n    .scene-title {\n      font-size: clamp(26px, 3vw, 34px); font-weight: 800;\n      letter-spacing: -0.025em; color: var(--text); margin-bottom: 8px;\n    }\n    .scene-desc { font-size: 16px; color: var(--text-muted); max-width: 640px; }\n\n    /* ===== Browser frame ===== */\n    .frame {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      box-shadow: var(--shadow-lg);\n      margin-top: 22px; position: relative;\n    }\n    .frame-bar {\n      display: flex; align-items: center; gap: 10px;\n      padding: 11px 16px; border-bottom: 1px solid var(--border);\n      background: var(--surface-subtle);\n    }\n    .frame-dots { display: flex; gap: 6px; }\n    .frame-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--border-strong); }\n    .frame-dot.r { background: #ff6159; }\n    .frame-dot.y { background: #ffbd2e; }\n    .frame-dot.g { background: #28c941; }\n    .frame-url {\n      flex: 1; background: var(--surface); border: 1px solid var(--border);\n      border-radius: 100px; padding: 5px 12px; font-size: 12px; color: var(--text-muted);\n      font-variant-numeric: tabular-nums;\n      display: flex; align-items: center; gap: 6px;\n    }\n    .frame-url svg { width: 11px; height: 11px; color: var(--green-dark); flex-shrink: 0; }\n\n    .frame-body { padding: 22px; background: var(--surface-subtle); position: relative; min-height: 360px; }\n\n    /* ===== Callouts ===== */\n    .callout {\n      position: absolute; z-index: 3;\n      background: #14204a; color: #fff;\n      padding: 9px 13px; border-radius: 10px;\n      font-size: 12.5px; font-weight: 600; line-height: 1.35;\n      box-shadow: 0 12px 30px rgba(20,32,74,0.25);\n      max-width: 220px;\n      border: 1px solid rgba(255,255,255,0.08);\n    }\n    .callout::before {\n      content: \"\"; position: absolute; width: 10px; height: 10px;\n      background: #14204a; transform: rotate(45deg);\n    }\n    .callout.left::before { left: -4px; top: 50%; margin-top: -5px; border-left: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }\n    .callout.right::before { right: -4px; top: 50%; margin-top: -5px; }\n    .callout.top::before { top: -4px; left: 50%; margin-left: -5px; }\n    .callout.bottom::before { bottom: -4px; left: 50%; margin-left: -5px; }\n    .callout strong { color: var(--pink); font-weight: 700; display: block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }\n\n    /* SVG line overlay for call-outs */\n    .frame-lines { position: absolute; inset: 0; pointer-events: none; z-index: 2; }\n    .frame-lines path { stroke: var(--pink); stroke-width: 1.5; fill: none; stroke-dasharray: 4 3; opacity: 0.7; }\n    .frame-lines circle { fill: var(--pink); }\n\n    /* ===== Next scene button ===== */\n    .scene-next {\n      display: inline-flex; align-items: center; gap: 8px;\n      margin-top: 18px; padding: 12px 22px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border-strong);\n      font-size: 14px; font-weight: 600; color: var(--text);\n      cursor: pointer; transition: all 0.15s ease;\n    }\n    .scene-next:hover {\n      background: var(--navy); color: #fff; border-color: var(--navy);\n      transform: translateY(-1px); box-shadow: var(--shadow);\n    }\n    .scene-next svg { width: 14px; height: 14px; transition: transform 0.15s ease; }\n    .scene-next:hover svg { transform: translateX(3px); }\n\n    /* ===== Mockup components ===== */\n    .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 14px; }\n    .kpi {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 14px;\n    }\n    .kpi-label { font-size: 10.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }\n    .kpi-value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }\n    .kpi-delta { font-size: 11px; color: var(--green-dark); font-weight: 700; margin-top: 4px; display: inline-flex; align-items: center; gap: 3px; }\n    .kpi-delta.neg { color: var(--red); }\n    .kpi-delta svg { width: 10px; height: 10px; }\n\n    .panel {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 16px;\n    }\n    .panel-head {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-bottom: 12px;\n    }\n    .panel-title { font-size: 13px; font-weight: 700; color: var(--text); }\n    .panel-link { font-size: 11px; color: var(--blue); font-weight: 600; }\n\n    .rentroll { font-size: 12.5px; }\n    .rentroll-row {\n      display: grid; grid-template-columns: 1.5fr 1fr 0.7fr 0.8fr; gap: 10px;\n      padding: 9px 0; border-bottom: 1px solid var(--border);\n      align-items: center;\n    }\n    .rentroll-row:last-child { border-bottom: none; }\n    .rentroll-row.head {\n      font-size: 10.5px; font-weight: 700; color: var(--text-muted);\n      letter-spacing: 0.08em; text-transform: uppercase;\n      padding-top: 2px;\n    }\n    .rentroll-name { font-weight: 600; color: var(--text); }\n    .rentroll-name small { display: block; color: var(--text-faint); font-weight: 500; font-size: 11px; margin-top: 1px; }\n    .pill {\n      display: inline-flex; align-items: center; gap: 5px;\n      font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px;\n      letter-spacing: 0.02em;\n    }\n    .pill-green { background: var(--green-bg); color: var(--green-dark); }\n    .pill-red { background: rgba(214,69,69,0.12); color: var(--red); }\n    .pill-gold { background: rgba(245,166,35,0.14); color: #a66c0a; }\n    .pill-blue { background: var(--blue-pale); color: var(--blue); }\n    .pill-muted { background: var(--surface-alt); color: var(--text-muted); }\n    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n\n    /* Payment flow */\n    .pay-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      max-width: 440px; margin: 10px auto;\n      box-shadow: var(--shadow-sm);\n    }\n    .pay-amount { text-align: center; padding: 6px 0 14px; }\n    .pay-amount-label { font-size: 11px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }\n    .pay-amount-val { font-size: 40px; font-weight: 900; letter-spacing: -0.03em; color: var(--text); font-variant-numeric: tabular-nums; margin-top: 4px; }\n    .pay-meta { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n    .pay-method {\n      display: flex; justify-content: space-between; align-items: center;\n      padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius);\n      margin-bottom: 10px;\n    }\n    .pay-method.active { border-color: var(--blue); background: var(--blue-softer); }\n    .pay-method-label { font-size: 13px; font-weight: 600; color: var(--text); }\n    .pay-method-label small { display: block; color: var(--text-muted); font-weight: 500; font-size: 11px; }\n    .pay-method-fee { font-size: 12px; font-weight: 700; color: var(--green-dark); }\n    .pay-autopay {\n      display: flex; align-items: center; gap: 10px; margin: 14px 0;\n      padding: 10px 12px; border-radius: var(--radius);\n      background: var(--blue-softer); border: 1px solid rgba(18,81,173,0.18);\n      font-size: 12.5px; color: var(--navy);\n    }\n    .switch {\n      width: 32px; height: 18px; border-radius: 100px;\n      background: var(--blue); position: relative; flex-shrink: 0;\n    }\n    .switch::after {\n      content: \"\"; position: absolute; top: 2px; right: 2px;\n      width: 14px; height: 14px; border-radius: 50%; background: #fff;\n    }\n    .pay-btn {\n      display: block; width: 100%;\n      background: var(--blue); color: #fff;\n      padding: 12px; border-radius: 100px;\n      font-weight: 700; font-size: 14px; text-align: center;\n    }\n\n    /* Kanban applications */\n    .kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n    .kan-col {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 12px;\n    }\n    .kan-title {\n      font-size: 11px; font-weight: 800; color: var(--text-muted);\n      letter-spacing: 0.1em; text-transform: uppercase;\n      display: flex; justify-content: space-between; align-items: center;\n      margin-bottom: 10px;\n    }\n    .kan-count {\n      font-size: 10px; background: var(--surface-alt); color: var(--text);\n      padding: 2px 7px; border-radius: 100px; font-weight: 700;\n    }\n    .app-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 10px 11px; margin-bottom: 8px;\n      box-shadow: var(--shadow-sm);\n    }\n    .app-card.highlight {\n      border-color: var(--pink); box-shadow: 0 6px 18px rgba(255,73,152,0.18);\n    }\n    .app-name { font-size: 12.5px; font-weight: 700; color: var(--text); }\n    .app-prop { font-size: 11px; color: var(--text-muted); margin-top: 1px; }\n    .app-score-row {\n      display: flex; justify-content: space-between; align-items: center;\n      margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);\n    }\n    .ai-score {\n      display: inline-flex; align-items: center; gap: 5px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; font-size: 11px; font-weight: 800;\n      padding: 3px 9px; border-radius: 100px; letter-spacing: 0.02em;\n    }\n    .ai-score svg { width: 9px; height: 9px; }\n    .doc-status { display: inline-flex; gap: 3px; align-items: center; font-size: 10.5px; color: var(--green-dark); font-weight: 700; }\n    .doc-status svg { width: 10px; height: 10px; }\n\n    /* Maintenance split */\n    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n    .split-pane {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n    }\n    .split-pane-label {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 10.5px; font-weight: 800; color: var(--text-muted);\n      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;\n    }\n    .split-pane-label .dot { width: 7px; height: 7px; }\n    .mnt-ticket {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: 8px; padding: 10px 12px;\n    }\n    .mnt-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }\n    .mnt-body { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; line-height: 1.45; }\n    .mnt-photos { display: flex; gap: 5px; margin-bottom: 8px; }\n    .mnt-photo {\n      width: 42px; height: 42px; border-radius: 6px;\n      background: linear-gradient(135deg, #c9d1dd, #8a93a5);\n      border: 1px solid var(--border);\n    }\n    .mnt-meta { font-size: 11px; color: var(--text-faint); }\n    .mnt-assign {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: 8px; padding: 10px 12px; margin-top: 8px;\n      display: flex; align-items: center; gap: 10px;\n    }\n    .avatar {\n      width: 30px; height: 30px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--blue-bright), var(--navy));\n      color: #fff; display: flex; align-items: center; justify-content: center;\n      font-size: 11px; font-weight: 800; flex-shrink: 0;\n    }\n    .avatar.vendor { background: linear-gradient(135deg, #f5a623, #e09110); }\n\n    /* Lease signing */\n    .lease-doc {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 22px 26px;\n      max-width: 540px; margin: 0 auto;\n      box-shadow: var(--shadow);\n      position: relative;\n    }\n    .lease-h { font-size: 14px; font-weight: 800; text-align: center; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text); margin-bottom: 4px; }\n    .lease-sub { font-size: 11px; text-align: center; color: var(--text-muted); margin-bottom: 16px; }\n    .lease-line {\n      height: 7px; border-radius: 3px; background: var(--surface-alt);\n      margin-bottom: 7px;\n    }\n    .lease-line.short { width: 58%; }\n    .lease-line.mid { width: 80%; }\n    .lease-sig-block {\n      margin-top: 18px; padding-top: 14px; border-top: 2px dashed var(--border-strong);\n      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;\n    }\n    .lease-sig-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }\n    .lease-sig-field {\n      height: 34px; border: 1.5px solid var(--blue); border-radius: 6px;\n      background: var(--blue-softer);\n      margin-top: 5px; display: flex; align-items: center; padding: 0 10px;\n      font-family: 'Caveat', 'Brush Script MT', cursive; font-size: 22px;\n      color: var(--navy); font-weight: 500; letter-spacing: 0.01em;\n    }\n    .lease-sig-field.empty {\n      border-style: dashed; background: transparent; color: var(--text-faint);\n      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;\n      letter-spacing: 0.08em; text-transform: uppercase;\n    }\n    .lease-cursor {\n      display: inline-block; width: 1.5px; height: 22px; background: var(--navy);\n      animation: blink 1s step-start infinite; margin-left: 1px;\n    }\n    @keyframes blink { 50% { opacity: 0; } }\n\n    /* Investor report */\n    .report-doc {\n      background: #fff; border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 22px 26px;\n      box-shadow: var(--shadow);\n      max-width: 520px; margin: 0 auto;\n    }\n    .report-brand {\n      display: flex; align-items: center; justify-content: space-between;\n      padding-bottom: 12px; border-bottom: 2px solid var(--navy);\n      margin-bottom: 16px;\n    }\n    .report-logo {\n      display: flex; align-items: center; gap: 8px;\n      font-weight: 800; font-size: 13px; color: var(--navy);\n    }\n    .report-logo-mark {\n      width: 22px; height: 22px; border-radius: 5px;\n      background: linear-gradient(135deg, var(--navy), var(--blue-bright));\n    }\n    .report-period { font-size: 11px; color: var(--text-muted); font-weight: 600; }\n    .report-title { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; color: var(--text); }\n    .report-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }\n    .report-kpi {\n      padding: 10px 12px; background: var(--surface-subtle);\n      border: 1px solid var(--border); border-radius: 6px;\n    }\n    .report-kpi-l { font-size: 9.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }\n    .report-kpi-v { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin-top: 2px; }\n    .report-chart {\n      height: 80px; background: var(--blue-softer); border-radius: 6px;\n      position: relative; overflow: hidden; border: 1px solid var(--border);\n    }\n    .report-chart svg { width: 100%; height: 100%; }\n\n    /* Tax pack */\n    .tax-wrap {\n      display: grid; grid-template-columns: 300px 1fr; gap: 16px;\n      align-items: flex-start;\n    }\n    .tax-action {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 18px;\n    }\n    .tax-doc-stack { position: relative; min-height: 280px; }\n    .tax-doc {\n      position: absolute; left: 50%; top: 0;\n      width: 240px; background: #fff;\n      border: 1px solid var(--border); border-radius: 6px;\n      box-shadow: var(--shadow);\n      padding: 14px 14px;\n      transform-origin: top center;\n    }\n    .tax-doc-h { font-size: 11px; font-weight: 800; color: var(--navy); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }\n    .tax-doc-sub { font-size: 10px; color: var(--text-muted); margin-bottom: 10px; }\n    .tax-doc-row {\n      display: flex; justify-content: space-between;\n      font-size: 10.5px; color: var(--text);\n      padding: 4px 0; border-bottom: 1px solid var(--border);\n    }\n    .tax-doc-row:last-child { border-bottom: none; font-weight: 700; }\n\n    /* Brand comparison */\n    .brand-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }\n    .brand-card {\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg); overflow: hidden;\n      background: var(--surface);\n    }\n    .brand-card-head {\n      padding: 12px 14px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: center; justify-content: space-between;\n      font-size: 11px; font-variant-numeric: tabular-nums;\n      background: var(--surface-subtle); color: var(--text-muted);\n    }\n    .brand-card-head .lock { display: inline-flex; align-items: center; gap: 5px; }\n    .brand-card-head svg { width: 10px; height: 10px; }\n    .brand-card-body { padding: 16px; min-height: 180px; display: flex; flex-direction: column; gap: 10px; }\n    .brand-logo-row { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }\n    .brand-mark {\n      width: 28px; height: 28px; border-radius: 6px;\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .brand-mark.tenantory { background: linear-gradient(135deg, var(--blue-bright), var(--pink)); }\n    .brand-mark.workspace { background: linear-gradient(135deg, #0f9b6a, #1ea97c); }\n    .brand-mark svg { width: 14px; height: 14px; }\n    .brand-name { font-size: 13px; font-weight: 800; color: var(--text); }\n    .brand-domain { font-size: 11px; color: var(--text-faint); font-variant-numeric: tabular-nums; margin-left: auto; }\n    .brand-hero { font-size: 14px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }\n    .brand-ctas { display: flex; gap: 6px; margin-top: auto; padding-top: 10px; }\n    .brand-ctas .mini-btn {\n      padding: 6px 12px; border-radius: 100px; font-size: 10.5px; font-weight: 700;\n    }\n    .mini-btn.p1 { background: var(--blue); color: #fff; }\n    .mini-btn.p2 { background: #0f9b6a; color: #fff; }\n    .mini-btn.ghost { background: var(--surface); border: 1px solid var(--border); color: var(--text); }\n\n    /* ===== Final CTA ===== */\n    .final-cta {\n      max-width: 1000px; margin: 40px auto 0; padding: 0 32px;\n    }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl);\n      padding: 56px 40px; text-align: center;\n      position: relative; overflow: hidden;\n    }\n    .cta-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 300px; height: 300px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .cta-card h2 {\n      font-size: clamp(26px, 3vw, 36px); font-weight: 800;\n      letter-spacing: -0.025em; margin-bottom: 12px;\n      color: #fff; position: relative; z-index: 1;\n    }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.82); max-width: 540px; margin: 0 auto 26px; position: relative; z-index: 1; }\n    .cta-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 14px; position: relative; z-index: 1; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 960px) {\n      .tour { grid-template-columns: 1fr; gap: 24px; padding: 24px 20px 48px; }\n      .rail {\n        position: static;\n        flex-direction: row; flex-wrap: wrap; gap: 6px;\n        padding: 0; overflow-x: auto;\n      }\n      .rail-title { display: none; }\n      .rail-pill { flex: 1 0 auto; }\n      .kpi-row { grid-template-columns: repeat(2,1fr); }\n      .kanban { grid-template-columns: 1fr; }\n      .split, .brand-compare, .tax-wrap { grid-template-columns: 1fr; }\n      .tax-doc { position: static; width: 100%; margin-bottom: 10px; transform: none !important; }\n      .tax-doc-stack { min-height: 0; }\n      .callout { position: static !important; max-width: none; margin-top: 10px; }\n      .callout::before { display: none; }\n      .frame-lines { display: none; }\n    }\n    @media (max-width: 640px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 56px 20px 40px; }\n      .rentroll-row { grid-template-columns: 1.5fr 0.8fr 0.8fr; }\n      .rentroll-row > :nth-child(3) { display: none; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="demo.html">Demo</a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="10 8 16 12 10 16 10 8" /></svg>
      Self-guided tour &middot; 8 scenes &middot; ~2 min
    </div>
    <h1>See Tenantory in <em>2 minutes</em>.</h1>
    <p className="hero-sub">No signup, no sales call, no email gate. Click through the actual product — the flows you&rsquo;ll use every week.</p>
    <div className="hero-actions">
      <a href="#scene-1" className="btn btn-primary btn-xl">
        Start the tour
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <a href="onboarding.html" className="btn btn-ghost btn-xl">Skip — start free trial</a>
    </div>
    <div className="hero-meta">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>No account required</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>No email to watch this</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Real product, not a video</span>
    </div>
  </section>

  
  <section className="tour" id="tour">

    
    <aside className="rail" id="rail">
      <div className="rail-title">The tour</div>
      <button className="rail-pill" data-target="scene-1"><span className="rail-num">1</span>Dashboard at a glance</button>
      <button className="rail-pill" data-target="scene-2"><span className="rail-num">2</span>A tenant pays rent</button>
      <button className="rail-pill" data-target="scene-3"><span className="rail-num">3</span>An application arrives</button>
      <button className="rail-pill" data-target="scene-4"><span className="rail-num">4</span>Maintenance, end-to-end</button>
      <button className="rail-pill" data-target="scene-5"><span className="rail-num">5</span>Lease e-signed</button>
      <button className="rail-pill" data-target="scene-6"><span className="rail-num">6</span>Monthly investor report</button>
      <button className="rail-pill" data-target="scene-7"><span className="rail-num">7</span>Month-end tax pack</button>
      <button className="rail-pill" data-target="scene-8"><span className="rail-num">8</span>Your tenants see your brand</button>
    </aside>

    
    <div className="scenes">

      
      <article className="scene" id="scene-1" data-next="scene-2">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">1</span>Scene 01</div>
          <h2 className="scene-title">Dashboard at a glance</h2>
          <p className="scene-desc">Open Tenantory. Every number you care about — this week, this month, right now.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>app.tenantory.com/dashboard</div>
          </div>
          <div className="frame-body">
            <div className="kpi-row">
              <div className="kpi" id="s1-k1">
                <div className="kpi-label">Collected (MTD)</div>
                <div className="kpi-value">$24,180</div>
                <div className="kpi-delta">+8.2% vs last mo</div>
              </div>
              <div className="kpi" id="s1-k2">
                <div className="kpi-label">Occupancy</div>
                <div className="kpi-value">96%</div>
                <div className="kpi-delta">23 / 24 units</div>
              </div>
              <div className="kpi" id="s1-k3">
                <div className="kpi-label">Late today</div>
                <div className="kpi-value">1</div>
                <div className="kpi-delta neg">$1,450 outstanding</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Vacant</div>
                <div className="kpi-value">1</div>
                <div className="kpi-delta">18 days on market</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Rent roll &middot; April</div>
                <span className="panel-link">View all 24 units</span>
              </div>
              <div className="rentroll">
                <div className="rentroll-row head"><div>Unit</div><div>Tenant</div><div>Due</div><div>Status</div></div>
                <div className="rentroll-row"><div className="rentroll-name">908 Lee Dr NW <small>Unit A</small></div><div>M. Patterson</div><div>$1,450</div><div><span className="pill pill-green"><span className="dot" />Paid</span></div></div>
                <div className="rentroll-row"><div className="rentroll-name">3026 Turf Ave <small>Main</small></div><div>J. Alvarez</div><div>$1,675</div><div><span className="pill pill-green"><span className="dot" />Paid</span></div></div>
                <div className="rentroll-row"><div className="rentroll-name">412 Pratt St SE <small>Unit 2</small></div><div>R. Thompson</div><div>$1,450</div><div><span className="pill pill-red"><span className="dot" />Late 3d</span></div></div>
                <div className="rentroll-row"><div className="rentroll-name">88 Holmes Pl <small>Unit 4</small></div><div>K. Nguyen</div><div>$1,200</div><div><span className="pill pill-green"><span className="dot" />Paid</span></div></div>
                <div className="rentroll-row"><div className="rentroll-name">705 Oak Park <small>Unit B</small></div><div>&mdash;</div><div>$1,395</div><div><span className="pill pill-muted"><span className="dot" />Vacant</span></div></div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 230,40 C 280,10 340,10 380,40" />
              <circle cx="228" cy="42" r="3" />
              <path d="M 420,40 C 460,10 520,10 560,40" />
              <circle cx="418" cy="42" r="3" />
              <path d="M 640,180 C 690,200 720,240 720,260" />
              <circle cx="638" cy="178" r="3" />
            </svg>

            <div className="callout top" style={{top: "56px", left: "58%", transform: "translateX(-50%)"}}>
              <strong>KPI</strong>96% occupancy — live across all properties
            </div>
            <div className="callout top" style={{top: "56px", left: "18%"}}>
              <strong>Cash in</strong>$24,180 collected this month
            </div>
            <div className="callout right" style={{top: "230px", right: "22px"}}>
              <strong>Flagged</strong>One late payment — you&rsquo;ll know before a tenant does
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-2">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-2" data-next="scene-3">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">2</span>Scene 02</div>
          <h2 className="scene-title">A tenant pays rent.</h2>
          <p className="scene-desc">Your tenant logs into the portal, two taps, done — and your books update themselves.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>pay.lee-three.com/april</div>
          </div>
          <div className="frame-body" style={{minHeight: "440px", background: "linear-gradient(180deg, var(--surface-subtle), var(--surface))"}}>
            <div className="pay-card">
              <div className="pay-amount">
                <div className="pay-amount-label">April rent &middot; 908 Lee Dr NW</div>
                <div className="pay-amount-val">$1,450.00</div>
                <div className="pay-meta">Due Apr 1 &middot; Paid on time, every time</div>
              </div>
              <div className="pay-method active">
                <div>
                  <div className="pay-method-label">Checking &bull;&bull;&bull;&bull; 4821 <small>Regions Bank</small></div>
                </div>
                <div className="pay-method-fee">ACH &middot; $0 fee</div>
              </div>
              <div className="pay-method">
                <div>
                  <div className="pay-method-label">Visa &bull;&bull;&bull;&bull; 2340 <small>Backup card</small></div>
                </div>
                <div className="pay-method-fee" style={{color: "var(--text-muted)"}}>2.95%</div>
              </div>
              <div className="pay-autopay">
                <div className="switch" />
                <div><strong style={{color: "var(--navy)", fontWeight: "700"}}>Autopay on</strong> &middot; draft 1st of each month</div>
              </div>
              <button className="pay-btn">Pay $1,450.00 now</button>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 540,160 C 620,160 680,180 700,220" />
              <circle cx="538" cy="160" r="3" />
              <path d="M 560,290 C 640,290 690,310 700,340" />
              <circle cx="558" cy="290" r="3" />
              <path d="M 240,160 C 160,150 110,180 90,220" />
              <circle cx="242" cy="160" r="3" />
            </svg>

            <div className="callout right" style={{top: "150px", right: "24px"}}>
              <strong>Fees</strong>ACH is free for tenants. Always.
            </div>
            <div className="callout right" style={{top: "310px", right: "24px"}}>
              <strong>Default</strong>Autopay is the default, not the upsell.
            </div>
            <div className="callout left" style={{top: "210px", left: "24px"}}>
              <strong>Auto-posted</strong>Reconciled to the right ledger the second it clears.
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-3">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-3" data-next="scene-4">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">3</span>Scene 03</div>
          <h2 className="scene-title">An application arrives.</h2>
          <p className="scene-desc">Every applicant is scored before you read a word — so you spend time on the ones worth calling.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>app.tenantory.com/applications</div>
          </div>
          <div className="frame-body">
            <div className="kanban">
              <div className="kan-col">
                <div className="kan-title">New <span className="kan-count">4</span></div>
                <div className="app-card highlight">
                  <div className="app-name">Maya Okafor</div>
                  <div className="app-prop">705 Oak Park &middot; Unit B</div>
                  <div className="app-score-row">
                    <span className="ai-score"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" /></svg>94 AI</span>
                    <span className="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>5 / 5 docs</span>
                  </div>
                </div>
                <div className="app-card">
                  <div className="app-name">Jordan Reeves</div>
                  <div className="app-prop">705 Oak Park &middot; Unit B</div>
                  <div className="app-score-row">
                    <span className="ai-score" style={{background: "linear-gradient(135deg, #f5a623, #e09110)"}}>71 AI</span>
                    <span className="doc-status" style={{color: "var(--gold)"}}>3 / 5 docs</span>
                  </div>
                </div>
                <div className="app-card">
                  <div className="app-name">Tyler Brooks</div>
                  <div className="app-prop">412 Pratt St &middot; Unit 3</div>
                  <div className="app-score-row">
                    <span className="ai-score" style={{background: "linear-gradient(135deg, #d64545, #a83737)"}}>48 AI</span>
                    <span className="doc-status" style={{color: "var(--red)"}}>2 / 5 docs</span>
                  </div>
                </div>
              </div>
              <div className="kan-col">
                <div className="kan-title">Screening <span className="kan-count">2</span></div>
                <div className="app-card">
                  <div className="app-name">Priya Shah</div>
                  <div className="app-prop">412 Pratt St &middot; Unit 3</div>
                  <div className="app-score-row">
                    <span className="ai-score">88 AI</span>
                    <span className="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Credit: 742</span>
                  </div>
                </div>
                <div className="app-card">
                  <div className="app-name">Dev Ramirez</div>
                  <div className="app-prop">88 Holmes Pl &middot; Unit 1</div>
                  <div className="app-score-row">
                    <span className="ai-score">81 AI</span>
                    <span className="doc-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>BG: pending</span>
                  </div>
                </div>
              </div>
              <div className="kan-col">
                <div className="kan-title">Offer <span className="kan-count">1</span></div>
                <div className="app-card">
                  <div className="app-name">Alex Chen</div>
                  <div className="app-prop">3026 Turf Ave &middot; Unit B</div>
                  <div className="app-score-row">
                    <span className="pill pill-blue"><span className="dot" />Lease sent</span>
                    <span className="doc-status">Offer sent 2d</span>
                  </div>
                </div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 220,130 C 280,80 340,70 400,80" />
              <circle cx="218" cy="130" r="3" />
              <path d="M 130,170 C 80,200 70,240 90,290" />
              <circle cx="132" cy="168" r="3" />
              <path d="M 220,170 C 300,220 400,260 520,290" />
              <circle cx="218" cy="168" r="3" />
            </svg>

            <div className="callout top" style={{top: "42px", left: "48%"}}>
              <strong>AI pre-score</strong>Income, credit, history &mdash; weighed for you
            </div>
            <div className="callout left" style={{top: "278px", left: "24px"}}>
              <strong>Docs</strong>Completeness checked at a glance
            </div>
            <div className="callout bottom" style={{bottom: "22px", left: "58%"}}>
              <strong>One click</strong>Run background + credit without leaving the card
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-4">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-4" data-next="scene-5">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">4</span>Scene 04</div>
          <h2 className="scene-title">Maintenance, end-to-end.</h2>
          <p className="scene-desc">Tenant reports it. Vendor accepts it. You never touch an email thread.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>app.tenantory.com/maintenance/T-2641</div>
          </div>
          <div className="frame-body" style={{minHeight: "420px"}}>
            <div className="split">
              <div className="split-pane">
                <div className="split-pane-label"><span className="dot" style={{color: "var(--blue)"}} />Tenant view &middot; portal.lee-three.com</div>
                <div className="mnt-ticket">
                  <div className="mnt-title">Kitchen sink is leaking under the cabinet</div>
                  <div className="mnt-body">Started this morning. Placed a bucket under it. Water smells clean, not sewage.</div>
                  <div className="mnt-photos"><div className="mnt-photo" /><div className="mnt-photo" /><div className="mnt-photo" /></div>
                  <div className="mnt-meta">Submitted 9:14 AM &middot; 908 Lee Dr NW, Unit A &middot; Priority: Normal</div>
                </div>
                <div style={{marginTop: "10px", fontSize: "11.5px", color: "var(--text-muted)"}}>Auto-routed to <strong style={{color: "var(--text)"}}>Huntsville Plumbing Co.</strong> (primary plumbing vendor)</div>
              </div>
              <div className="split-pane">
                <div className="split-pane-label"><span className="dot" style={{color: "var(--gold)"}} />Vendor view &middot; vendor.tenantory.com</div>
                <div className="mnt-ticket">
                  <div className="mnt-title">Dispatch #T-2641 &middot; Plumbing</div>
                  <div className="mnt-body">908 Lee Dr NW, Huntsville AL &middot; Gate code 4821 &middot; Tenant prefers afternoon.</div>
                  <div style={{display: "flex", gap: "6px", marginTop: "8px"}}>
                    <span className="mini-btn p1">Accept &amp; schedule</span>
                    <span className="mini-btn ghost">Decline</span>
                  </div>
                </div>
                <div className="mnt-assign">
                  <div className="avatar vendor">HP</div>
                  <div style={{flex: "1"}}>
                    <div style={{fontSize: "12.5px", fontWeight: "700"}}>Huntsville Plumbing Co.</div>
                    <div style={{fontSize: "11px", color: "var(--text-muted)"}}>Avg response 14 min &middot; 96 jobs completed</div>
                  </div>
                  <span className="pill pill-green"><span className="dot" />Assigned</span>
                </div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 380,220 C 400,180 420,180 440,220" />
              <circle cx="378" cy="222" r="3" />
              <circle cx="442" cy="222" r="3" />
            </svg>

            <div className="callout left" style={{top: "105px", left: "24px"}}>
              <strong>Tenant</strong>Submits with photos, priority, right unit
            </div>
            <div className="callout right" style={{top: "105px", right: "24px"}}>
              <strong>Vendor</strong>Auto-assigned based on category + priority
            </div>
            <div className="callout bottom" style={{bottom: "30px", left: "50%", transform: "translateX(-50%)"}}>
              <strong>You</strong>Stay out of the email chain &mdash; you only see exceptions
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-5">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-5" data-next="scene-6">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">5</span>Scene 05</div>
          <h2 className="scene-title">Lease e-signed.</h2>
          <p className="scene-desc">No DocuSign account, no printed PDF, no scanner. Tenant types their name — and it&rsquo;s filed.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>sign.lee-three.com/lease/2641-okafor</div>
          </div>
          <div className="frame-body" style={{minHeight: "440px", background: "linear-gradient(180deg, #f0f3f8, var(--surface-subtle))"}}>
            <div className="lease-doc">
              <div className="lease-h">Residential Lease Agreement</div>
              <div className="lease-sub">908 Lee Dr NW, Unit A &middot; 12-month term &middot; May 1, 2026</div>
              <div className="lease-line mid" />
              <div className="lease-line" />
              <div className="lease-line short" />
              <div className="lease-line" />
              <div className="lease-line mid" />
              <div className="lease-sig-block">
                <div>
                  <div className="lease-sig-label">Tenant signature</div>
                  <div className="lease-sig-field">Maya Okafor<span className="lease-cursor" /></div>
                </div>
                <div>
                  <div className="lease-sig-label">Landlord signature</div>
                  <div className="lease-sig-field empty">Pending &middot; H. Cooper</div>
                </div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 260,340 C 200,340 120,330 90,310" />
              <circle cx="262" cy="340" r="3" />
              <path d="M 540,340 C 620,340 680,330 720,310" />
              <circle cx="538" cy="340" r="3" />
              <path d="M 400,100 C 400,60 500,40 620,60" />
              <circle cx="400" cy="100" r="3" />
            </svg>

            <div className="callout left" style={{top: "300px", left: "24px"}}>
              <strong>Typed sig</strong>Legally binding &middot; ESIGN Act + UETA compliant
            </div>
            <div className="callout right" style={{top: "300px", right: "24px"}}>
              <strong>No DocuSign</strong>Unlimited e-sign on every plan
            </div>
            <div className="callout right" style={{top: "60px", right: "24px"}}>
              <strong>Auto-filed</strong>Saved to tenant&rsquo;s documents on sign
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-6">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-6" data-next="scene-7">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">6</span>Scene 06</div>
          <h2 className="scene-title">Monthly investor report.</h2>
          <p className="scene-desc">The 1st of the month, every LP on your list gets a branded PDF in their inbox. You didn&rsquo;t lift a finger.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>app.tenantory.com/reports/investor-april-2026.pdf</div>
          </div>
          <div className="frame-body" style={{minHeight: "440px", background: "linear-gradient(180deg, #e8ecf3, #f0f3f8)"}}>
            <div className="report-doc">
              <div className="report-brand">
                <div className="report-logo">
                  <div className="report-logo-mark" />
                  The Lee Three LLC
                </div>
                <div className="report-period">Q2 &middot; April 2026</div>
              </div>
              <div className="report-title">Monthly performance &middot; portfolio summary</div>
              <div className="report-kpis">
                <div className="report-kpi"><div className="report-kpi-l">NOI</div><div className="report-kpi-v">$18,420</div></div>
                <div className="report-kpi"><div className="report-kpi-l">Occupancy</div><div className="report-kpi-v">96%</div></div>
                <div className="report-kpi"><div className="report-kpi-l">CoC return</div><div className="report-kpi-v">11.8%</div></div>
              </div>
              <div className="report-chart">
                <svg viewBox="0 0 400 80" preserveAspectRatio="none">
                  <defs>
                    <lineargradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1665D8" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#1665D8" stopOpacity="0" />
                    </lineargradient>
                  </defs>
                  <path d="M 0,60 L 40,52 L 80,48 L 120,42 L 160,36 L 200,30 L 240,32 L 280,24 L 320,20 L 360,14 L 400,10 L 400,80 L 0,80 Z" fill="url(#chartFill)" />
                  <path d="M 0,60 L 40,52 L 80,48 L 120,42 L 160,36 L 200,30 L 240,32 L 280,24 L 320,20 L 360,14 L 400,10" fill="none" stroke="#1665D8" strokeWidth="2" />
                </svg>
              </div>
              <div style={{marginTop: "14px", fontSize: "10.5px", color: "var(--text-muted)", lineHeight: "1.5"}}>
                Delivered April 1 at 6:00 AM CT to 4 investors &middot; 3.2 MB PDF &middot; IRR updated through period close
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 260,80 C 200,60 140,60 90,80" />
              <circle cx="262" cy="80" r="3" />
              <path d="M 560,110 C 640,90 700,100 720,130" />
              <circle cx="558" cy="110" r="3" />
              <path d="M 560,390 C 640,390 700,370 720,340" />
              <circle cx="558" cy="390" r="3" />
            </svg>

            <div className="callout left" style={{top: "70px", left: "24px"}}>
              <strong>Auto-sent</strong>Generated and mailed on the 1st
            </div>
            <div className="callout right" style={{top: "100px", right: "24px"}}>
              <strong>Branded</strong>Your logo, your LLC, your colors
            </div>
            <div className="callout right" style={{top: "380px", right: "24px"}}>
              <strong>Every LP</strong>Each investor configured once, delivered forever
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-7">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-7" data-next="scene-8">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">7</span>Scene 07</div>
          <h2 className="scene-title">Month-end tax pack, one click.</h2>
          <p className="scene-desc">Every property, every receipt, every depreciation entry — in a Schedule E your CPA will thank you for.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>app.tenantory.com/reports/schedule-e</div>
          </div>
          <div className="frame-body" style={{minHeight: "420px"}}>
            <div className="tax-wrap">
              <div className="tax-action">
                <div style={{fontSize: "11px", fontWeight: "800", color: "var(--blue)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px"}}>Schedule E &middot; 2026 tax year</div>
                <div style={{fontSize: "18px", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "6px"}}>Export full tax pack</div>
                <div style={{fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "18px"}}>One PDF. All 7 properties. Income, expenses, depreciation, receipts attached.</div>
                <button className="pay-btn" style={{background: "var(--pink)"}}>Generate PDF &middot; 24 units</button>
                <div style={{marginTop: "14px", fontSize: "11.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px"}}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--green-dark)"}}><polyline points="20 6 9 17 4 12" /></svg>
                  QuickBooks optional &middot; not required
                </div>
              </div>
              <div className="tax-doc-stack">
                <div className="tax-doc" style={{transform: "translateX(-60%) rotate(-4deg)"}}>
                  <div className="tax-doc-h">Form 1040 Schedule E</div>
                  <div className="tax-doc-sub">908 Lee Dr NW &middot; 2026</div>
                  <div className="tax-doc-row"><span>Rents received</span><span>$17,400</span></div>
                  <div className="tax-doc-row"><span>Repairs</span><span>$1,184</span></div>
                  <div className="tax-doc-row"><span>Mgmt fees</span><span>$0</span></div>
                  <div className="tax-doc-row"><span>Depreciation</span><span>$6,218</span></div>
                  <div className="tax-doc-row"><span>Net income</span><span>$9,998</span></div>
                </div>
                <div className="tax-doc" style={{transform: "translateX(-50%) rotate(0deg)", top: "20px"}}>
                  <div className="tax-doc-h">Form 1040 Schedule E</div>
                  <div className="tax-doc-sub">3026 Turf Ave &middot; 2026</div>
                  <div className="tax-doc-row"><span>Rents received</span><span>$20,100</span></div>
                  <div className="tax-doc-row"><span>Repairs</span><span>$847</span></div>
                  <div className="tax-doc-row"><span>Mgmt fees</span><span>$0</span></div>
                  <div className="tax-doc-row"><span>Depreciation</span><span>$7,445</span></div>
                  <div className="tax-doc-row"><span>Net income</span><span>$11,808</span></div>
                </div>
                <div className="tax-doc" style={{transform: "translateX(-40%) rotate(4deg)", top: "40px"}}>
                  <div className="tax-doc-h">Summary &middot; 7 props</div>
                  <div className="tax-doc-sub">Portfolio total &middot; 2026</div>
                  <div className="tax-doc-row"><span>Gross rents</span><span>$148,200</span></div>
                  <div className="tax-doc-row"><span>Expenses</span><span>$42,180</span></div>
                  <div className="tax-doc-row"><span>Depreciation</span><span>$38,405</span></div>
                  <div className="tax-doc-row"><span>Taxable net</span><span>$67,615</span></div>
                </div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 580,130 C 640,110 690,120 720,140" />
              <circle cx="578" cy="130" r="3" />
            </svg>

            <div className="callout top" style={{top: "16px", left: "62%"}}>
              <strong>One PDF</strong>Every property on one pack &mdash; no spreadsheet sorcery
            </div>
            <div className="callout bottom" style={{bottom: "18px", left: "18%"}}>
              <strong>Your CPA</strong>Ready for e-file &middot; no rework
            </div>
            <div className="callout right" style={{top: "160px", right: "24px"}}>
              <strong>No QB</strong>Accounting is built in, not bolted on
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="scene-8">Next scene <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

      
      <article className="scene" id="scene-8" data-next="final">
        <div className="scene-head">
          <div className="scene-num"><span className="scene-num-dot">8</span>Scene 08</div>
          <h2 className="scene-title">Your tenants see your brand.</h2>
          <p className="scene-desc">Tenantory is invisible to your renters. The portal, the domain, the emails — all yours.</p>
        </div>
        <div className="frame">
          <div className="frame-bar">
            <div className="frame-dots"><span className="frame-dot r" /><span className="frame-dot y" /><span className="frame-dot g" /></div>
            <div className="frame-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>two tenant portals &middot; side by side</div>
          </div>
          <div className="frame-body" style={{minHeight: "360px"}}>
            <div className="brand-compare">
              <div className="brand-card">
                <div className="brand-card-head">
                  <span className="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> portal.tenantory.com</span>
                  <span>Starter plan</span>
                </div>
                <div className="brand-card-body">
                  <div className="brand-logo-row">
                    <div className="brand-mark tenantory">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
                    </div>
                    <div className="brand-name">Tenantory</div>
                    <div className="brand-domain">portal.tenantory.com</div>
                  </div>
                  <div className="brand-hero">Welcome back, Maya.</div>
                  <div style={{fontSize: "12px", color: "var(--text-muted)"}}>April rent &middot; $1,450 &middot; Due in 6 days</div>
                  <div style={{height: "6px", background: "var(--blue)", borderRadius: "3px", width: "72%"}} />
                  <div style={{fontSize: "11px", color: "var(--text-faint)", marginTop: "auto"}}>Powered by Tenantory</div>
                  <div className="brand-ctas"><span className="mini-btn p1">Pay now</span><span className="mini-btn ghost">Request maintenance</span></div>
                </div>
              </div>
              <div className="brand-card" style={{borderColor: "var(--green)", boxShadow: "0 10px 30px rgba(30,169,124,0.15)"}}>
                <div className="brand-card-head" style={{background: "rgba(30,169,124,0.05)"}}>
                  <span className="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: "var(--green-dark)"}}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> portal.lee-three.com</span>
                  <span style={{color: "var(--green-dark)", fontWeight: "700"}}>Workspace plan</span>
                </div>
                <div className="brand-card-body">
                  <div className="brand-logo-row">
                    <div className="brand-mark workspace">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /></svg>
                    </div>
                    <div className="brand-name">The Lee Three</div>
                    <div className="brand-domain">portal.lee-three.com</div>
                  </div>
                  <div className="brand-hero">Welcome back, Maya.</div>
                  <div style={{fontSize: "12px", color: "var(--text-muted)"}}>April rent &middot; $1,450 &middot; Due in 6 days</div>
                  <div style={{height: "6px", background: "#0f9b6a", borderRadius: "3px", width: "72%"}} />
                  <div style={{fontSize: "11px", color: "var(--text-faint)", marginTop: "auto"}}>A service of The Lee Three LLC</div>
                  <div className="brand-ctas"><span className="mini-btn p2">Pay now</span><span className="mini-btn ghost">Request maintenance</span></div>
                </div>
              </div>
            </div>

            <svg className="frame-lines" viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 640,80 C 700,60 720,40 720,20" />
              <circle cx="638" cy="80" r="3" />
            </svg>

            <div className="callout top" style={{top: "14px", right: "10%"}}>
              <strong>Your brand</strong>Logo, domain, color, sender email &mdash; all yours
            </div>
          </div>
        </div>
        <button className="scene-next" data-next="final">See what's next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
      </article>

    </div>
  </section>

  
  <section className="final-cta" id="final">
    <div className="cta-card">
      <h2>Ready for the real thing?</h2>
      <p>Start your 14-day free trial. No credit card. Move your whole portfolio in under an hour — or we&rsquo;ll do it for you.</p>
      <div className="cta-actions">
        <a className="btn btn-pink btn-xl" href="onboarding.html">Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-xl" href="mailto:hello@tenantory.com?subject=Book%20a%20call">Book a 20-min call</a>
      </div>
      <div className="cta-note">No card required &middot; Cancel anytime &middot; Keep your data on export</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="demo.html">Demo</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
