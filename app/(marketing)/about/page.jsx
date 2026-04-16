"use client";

// Mock ported from ~/Desktop/blackbear/about.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* ===== Hero ===== */\n    .hero-wrap { max-width: 1200px; margin: 0 auto; padding: 72px 32px 48px; }\n    .hero-grid {\n      display: grid; grid-template-columns: 1.25fr 1fr; gap: 56px; align-items: center;\n    }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;\n      margin-bottom: 20px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(38px, 5vw, 60px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.02;\n      margin-bottom: 22px;\n    }\n    .hero h1 em {\n      font-style: normal;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      -webkit-background-clip: text; background-clip: text; color: transparent;\n    }\n    .hero-sub { font-size: 18px; color: var(--text-muted); line-height: 1.6; max-width: 560px; margin-bottom: 32px; }\n    .hero-meta { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; font-size: 13px; color: var(--text-muted); }\n    .hero-meta .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-faint); }\n    .hero-meta strong { color: var(--text); font-weight: 700; }\n\n    /* ===== Avatar + photo ===== */\n    .hero-visual { position: relative; }\n    .avatar-big {\n      width: 220px; height: 220px; border-radius: 28px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 900; font-size: 90px; letter-spacing: -0.04em;\n      box-shadow: var(--shadow-xl);\n      position: relative; z-index: 2;\n    }\n    .photo-plate {\n      width: 280px; height: 340px; border-radius: 22px;\n      background: linear-gradient(135deg, #f7f9fc, #eef3ff);\n      border: 1px solid var(--border);\n      position: absolute; top: 40px; right: 0;\n      display: flex; flex-direction: column; align-items: center; justify-content: center;\n      color: var(--text-faint); gap: 10px;\n      overflow: hidden;\n    }\n    .photo-plate::after {\n      content: \"\"; position: absolute; inset: 0;\n      background:\n        radial-gradient(circle at 30% 20%, rgba(22,101,216,0.08), transparent 50%),\n        radial-gradient(circle at 70% 80%, rgba(255,73,152,0.08), transparent 50%);\n    }\n    .photo-plate svg { width: 40px; height: 40px; opacity: 0.5; position: relative; z-index: 1; }\n    .photo-plate-cap { font-size: 12px; font-weight: 600; position: relative; z-index: 1; text-align: center; padding: 0 20px; line-height: 1.4; }\n    .hero-visual-stack { position: relative; height: 380px; margin-left: auto; max-width: 460px; }\n    .hero-visual-stack .avatar-big { position: absolute; top: 0; left: 0; }\n    .hero-visual-stack .photo-plate { position: absolute; bottom: 0; right: 0; top: auto; }\n\n    /* ===== Section scaffolding ===== */\n    .section { max-width: 1040px; margin: 0 auto; padding: 72px 32px; }\n    .section-narrow { max-width: 760px; }\n    .section-wide { max-width: 1200px; }\n    .kicker {\n      display: inline-block;\n      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n      color: var(--blue); margin-bottom: 14px;\n    }\n    .h2 { font-size: clamp(30px, 3.5vw, 42px); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 18px; }\n    .lede { font-size: 18px; color: var(--text-muted); line-height: 1.65; }\n\n    /* ===== Short version card ===== */\n    .tldr {\n      background: var(--surface-alt); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 36px 40px;\n      display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;\n    }\n    .tldr-label {\n      font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;\n      color: var(--pink); padding: 8px 14px;\n      background: var(--pink-bg); border-radius: 100px; white-space: nowrap;\n    }\n    .tldr p { font-size: 17px; line-height: 1.65; color: var(--text); }\n\n    /* ===== Narrative story ===== */\n    .story { max-width: 720px; margin: 0 auto; padding: 72px 32px; }\n    .story-beat + .story-beat { margin-top: 56px; }\n    .story-beat h3 {\n      font-size: 26px; font-weight: 800; letter-spacing: -0.02em;\n      margin-bottom: 10px;\n    }\n    .story-beat .year {\n      display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 0.1em;\n      color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px;\n    }\n    .story-beat p { font-size: 17px; line-height: 1.75; color: var(--text); margin-bottom: 16px; }\n    .story-beat p:last-child { margin-bottom: 0; }\n    .story-beat p em {\n      font-family: 'Source Serif 4', Georgia, serif;\n      font-style: italic; color: var(--navy-dark); font-weight: 500;\n    }\n\n    /* ===== Lessons list ===== */\n    .lessons-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 36px;\n    }\n    .lesson {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 28px 26px;\n      position: relative; transition: all 0.2s ease;\n    }\n    .lesson:hover { border-color: var(--blue-bright); transform: translateY(-2px); box-shadow: var(--shadow); }\n    .lesson-num {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      color: #fff; font-weight: 800; font-size: 16px;\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 14px;\n    }\n    .lesson h4 { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin-bottom: 8px; }\n    .lesson p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }\n\n    /* ===== Big quote ===== */\n    .quote-wrap {\n      max-width: 900px; margin: 0 auto; padding: 72px 32px;\n    }\n    .quote-card {\n      background: linear-gradient(135deg, var(--navy), var(--navy-darker));\n      border-radius: var(--radius-xl); padding: 64px 56px;\n      color: #fff; position: relative; overflow: hidden;\n    }\n    .quote-card::before {\n      content: \"\\201C\"; position: absolute; top: -20px; left: 20px;\n      font-family: 'Source Serif 4', Georgia, serif;\n      font-size: 260px; line-height: 1; color: rgba(255,73,152,0.15); font-weight: 700;\n    }\n    .quote-card blockquote {\n      font-family: 'Source Serif 4', Georgia, serif;\n      font-size: clamp(24px, 3vw, 34px); line-height: 1.35; font-weight: 500;\n      letter-spacing: -0.01em; position: relative; z-index: 1;\n      margin-bottom: 28px;\n    }\n    .quote-card blockquote em { font-style: italic; color: #ffb4d3; }\n    .quote-attr { display: flex; align-items: center; gap: 14px; position: relative; z-index: 1; }\n    .quote-avatar {\n      width: 48px; height: 48px; border-radius: 12px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 800; font-size: 17px;\n    }\n    .quote-attr-text { font-size: 14px; }\n    .quote-attr-name { font-weight: 700; }\n    .quote-attr-role { color: rgba(255,255,255,0.6); font-size: 13px; }\n\n    /* ===== NOT section ===== */\n    .not-grid {\n      display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 32px;\n    }\n    .not-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px;\n      display: flex; gap: 14px; align-items: flex-start;\n    }\n    .not-x {\n      width: 28px; height: 28px; border-radius: 8px;\n      background: rgba(214,69,69,0.1); color: var(--red);\n      display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n    }\n    .not-x svg { width: 16px; height: 16px; }\n    .not-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.01em; }\n    .not-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }\n\n    /* ===== Values cards ===== */\n    .values-grid {\n      display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 36px;\n    }\n    .value {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px 20px;\n      text-align: left; transition: all 0.2s ease;\n    }\n    .value:hover { border-color: var(--pink); transform: translateY(-2px); }\n    .value-icon {\n      width: 36px; height: 36px; border-radius: 10px;\n      background: var(--blue-softer); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n      margin-bottom: 14px;\n    }\n    .value-icon svg { width: 18px; height: 18px; }\n    .value h4 { font-size: 15px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.01em; }\n    .value p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n\n    /* ===== Timeline ===== */\n    .timeline-wrap { max-width: 1200px; margin: 0 auto; padding: 72px 32px; }\n    .timeline {\n      position: relative; padding: 40px 0 20px;\n    }\n    .timeline::before {\n      content: \"\"; position: absolute; top: 72px; left: 5%; right: 5%;\n      height: 2px; background: linear-gradient(90deg, var(--blue-pale), var(--blue-bright), var(--pink), var(--pink-bg));\n    }\n    .timeline-items {\n      display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; position: relative;\n    }\n    .tl-item { text-align: center; padding-top: 72px; position: relative; }\n    .tl-dot {\n      position: absolute; top: 64px; left: 50%; transform: translateX(-50%);\n      width: 18px; height: 18px; border-radius: 50%;\n      background: var(--surface); border: 3px solid var(--blue-bright);\n      box-shadow: 0 0 0 5px rgba(22,101,216,0.12);\n      z-index: 2;\n    }\n    .tl-item.pink .tl-dot { border-color: var(--pink); box-shadow: 0 0 0 5px rgba(255,73,152,0.15); }\n    .tl-item.now .tl-dot { background: var(--pink); border-color: var(--pink); }\n    .tl-year { font-weight: 900; font-size: 22px; letter-spacing: -0.02em; margin-bottom: 6px; }\n    .tl-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; }\n    .tl-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n\n    /* ===== Dogfood ===== */\n    .dogfood {\n      max-width: 1040px; margin: 0 auto; padding: 48px 32px 72px;\n    }\n    .dogfood-card {\n      background: linear-gradient(135deg, var(--surface-alt), var(--blue-softer));\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 40px; display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center;\n    }\n    .dogfood-badge {\n      width: 80px; height: 80px; border-radius: 20px;\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 900; font-size: 11px; letter-spacing: 0.05em; text-align: center;\n      line-height: 1.2;\n    }\n    .dogfood-text h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }\n    .dogfood-text p { font-size: 15px; color: var(--text-muted); line-height: 1.65; }\n    .dogfood-text strong { color: var(--text); }\n\n    /* ===== Team ===== */\n    .team-grid { display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 520px; margin: 36px auto 0; }\n    .team-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px;\n      display: flex; gap: 22px; align-items: center;\n    }\n    .team-avatar {\n      width: 72px; height: 72px; border-radius: 18px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center;\n      color: #fff; font-weight: 900; font-size: 26px; flex-shrink: 0;\n    }\n    .team-info h4 { font-size: 18px; font-weight: 800; letter-spacing: -0.015em; }\n    .team-info .role { font-size: 13px; color: var(--blue); font-weight: 600; margin-bottom: 6px; }\n    .team-info p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }\n    .team-empty {\n      background: var(--surface-subtle); border: 1px dashed var(--border-strong);\n      border-radius: var(--radius-xl); padding: 24px 28px;\n      font-size: 14px; color: var(--text-muted); text-align: center; line-height: 1.6;\n    }\n    .team-empty strong { color: var(--text); }\n\n    /* ===== Contact ===== */\n    .contact-grid {\n      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px;\n    }\n    .contact-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 24px;\n      display: flex; flex-direction: column; gap: 10px; transition: all 0.2s ease;\n    }\n    .contact-card:hover { border-color: var(--blue-bright); box-shadow: var(--shadow); transform: translateY(-2px); }\n    .contact-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--blue-softer); color: var(--blue);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .contact-icon svg { width: 20px; height: 20px; }\n    .contact-card h4 { font-size: 14px; font-weight: 700; }\n    .contact-card .val { font-size: 15px; font-weight: 600; color: var(--text); }\n    .contact-card .desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }\n\n    /* ===== Bottom CTA ===== */\n    .cta-bottom {\n      max-width: 1200px; margin: 88px auto 0; padding: 0 32px;\n    }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto 28px; }\n    .cta-card-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 980px) {\n      .hero-grid { grid-template-columns: 1fr; gap: 40px; }\n      .hero-visual-stack { height: auto; max-width: 100%; display: flex; gap: 20px; align-items: flex-start; }\n      .hero-visual-stack .avatar-big { position: relative; width: 140px; height: 140px; font-size: 56px; border-radius: 22px; }\n      .hero-visual-stack .photo-plate { position: relative; width: auto; flex: 1; height: 180px; }\n      .lessons-grid { grid-template-columns: 1fr; }\n      .not-grid { grid-template-columns: 1fr; }\n      .values-grid { grid-template-columns: repeat(2, 1fr); }\n      .timeline::before { display: none; }\n      .timeline-items { grid-template-columns: 1fr; gap: 28px; }\n      .tl-item { padding-top: 0; text-align: left; padding-left: 32px; }\n      .tl-dot { top: 4px; left: 6px; transform: none; }\n      .dogfood-card { grid-template-columns: 1fr; text-align: center; }\n      .dogfood-badge { margin: 0 auto; }\n      .contact-grid { grid-template-columns: 1fr; }\n      .tldr { grid-template-columns: 1fr; gap: 16px; padding: 28px; }\n      .quote-card { padding: 44px 32px; }\n    }\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero-wrap { padding: 48px 20px 32px; }\n      .section, .story, .quote-wrap, .timeline-wrap, .dogfood { padding-left: 20px; padding-right: 20px; }\n      .values-grid { grid-template-columns: 1fr; }\n      .cta-bottom { padding: 0 16px; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item active" href="about.html">About</a>
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero-wrap">
    <div className="hero-grid">
      <div className="hero-copy">
        <div className="hero-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 9.1 8.3 2 9.3l5.1 5-1.2 7 6.1-3.3 6.1 3.3-1.2-7 5.1-5-7.1-1z" /></svg>
          Founder note · Huntsville, AL
        </div>
        <h1>I wasn't supposed to <em>build software.</em></h1>
        <p className="hero-sub">I'm an operator first. I own rental houses, I clean gutters, I unclog toilets at 11pm, and somewhere along the way I also wrote the property management platform I wished existed. This is the story of how that happened and why it matters if you run rentals.</p>
        <div className="hero-meta">
          <span><strong>Harrison Cooper</strong></span>
          <span className="dot" />
          <span>Founder, Black Bear Rentals</span>
          <span className="dot" />
          <span>Operator, <strong>Black Bear Rentals</strong></span>
          <span className="dot" />
          <span>15+ rooms</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual-stack">
          <div className="avatar-big">HC</div>
          <div className="photo-plate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="m21 15-5-5L8 18" /></svg>
            <div className="photo-plate-cap">Photo dropping soon.<br />Probably of me on the roof of 908 Lee Dr with a ladder I shouldn't be on.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section section-narrow">
    <div className="tldr">
      <div className="tldr-label">The short version</div>
      <p>I bought my first rental in 2019. By 2024 I was running 15 rooms across four houses and paying AppFolio <strong>$280/month</strong> to send rent receipts that said AppFolio instead of Black Bear Rentals on them. In January 2026 I got fed up and started writing my own. Six weeks later it was better than what I was paying for. Then other operators asked to use it. Here we are.</p>
    </div>
  </section>

  
  <div className="story">

    <div className="story-beat">
      <div className="year">2019 · Beat 1</div>
      <h3>My first rental was a mistake.</h3>
      <p>I was 24, living in a 3-bedroom starter home in southwest Huntsville that I'd bought with an FHA loan because the rent on my apartment had gone up twice in 18 months. Six months in I got a job offer in Nashville. I did the math: either sell the house and eat closing costs, or rent it out. My dad, who's been a general contractor for 40 years, said <em>"you can always sell it next year, but you can't un-sell it."</em> So I put it on Craigslist for $1,150 and moved.</p>
      <p>The tenant broke the garbage disposal the first week. I drove back on a Saturday to fix it. That's when I learned rule one: the landlord business isn't the real-estate business, it's the maintenance-coordination-plus-emotional-regulation business.</p>
    </div>

    <div className="story-beat">
      <div className="year">2020 – 2023 · Beat 2</div>
      <h3>The spreadsheet era.</h3>
      <p>I moved back to Huntsville in 2020 and bought two more houses the same year, both fixers. By 2022 I was converting single-family houses into co-living because the unit economics were absurd: instead of $1,300/mo for a 3-bed, I was getting $700 per room, per room, with utilities bundled, furnished, with a standardized lease. Four houses, 13 rooms. Later 15.</p>
      <p>I ran all of it on a Google Sheet called <em>"BBR MASTER v7_FINAL_actually.xlsx."</em> It had tabs for rent roll, a tab per house for expenses, a tab of phone numbers, and a column where I tracked whether each tenant had paid by the 5th, highlighted red, yellow, or green. When a lease ended I'd copy the row to an "archive" tab. My bookkeeper would email me every quarter asking for receipts and I'd spend a weekend re-creating them from bank statements.</p>
      <p>It worked. Kind of. Until I missed a late fee three months in a row on one tenant because I forgot to check the tab. That tenant eventually left owing $2,400 I never collected. That was the real cost of the spreadsheet: not the 10 hours a month, but the $2,400 I gave up by being sloppy.</p>
    </div>

    <div className="story-beat">
      <div className="year">Early 2024 · Beat 3</div>
      <h3>When I tried AppFolio.</h3>
      <p>A bigger operator I respect told me over coffee at Honest Coffee that if I was running 10+ doors I needed "real software." He paid for AppFolio. So I signed up. $280/month minimum, plus a $400 setup fee, plus 3.5 weeks of onboarding calls with someone in a headset reading from a script.</p>
      <p>Three things I'll say in AppFolio's favor: the accounting is legit, the bank reconciliation works, and the reporting is better than a spreadsheet. I'd be lying if I said otherwise.</p>
      <p>But: my tenants logged into a portal that said <strong>AppFolio</strong> at the top. The payment receipts were branded <strong>AppFolio</strong>. The late notices came from an <strong>@appfolio.com</strong> email. I'd spent four years building a name — <em>Black Bear Rentals</em> — and my tenants' first impression of "the landlord" was somebody else's logo. It felt like franchising a McDonald's when I'd actually been running a neighborhood diner.</p>
      <p>On top of that, every feature that actually mattered to me — online applications, electronic lease signing, the owner statements my CPA wanted — was an add-on. By month four I was at $340/mo. I cancelled in May 2024 and went back to the spreadsheet. That was the low point.</p>
    </div>

    <div className="story-beat">
      <div className="year">January 2026 · Beat 4</div>
      <h3>The weekend I started building.</h3>
      <p>Here's the embarrassing part. I'm not a professional developer. I built a couple of internal tools during my last corporate job, I can move around in a codebase, but I'm not the kind of person who "ships a SaaS on a weekend" — that tweet never resonated with me.</p>
      <p>What actually happened: on January 10th, 2026, a tenant at the Turf Ave house emailed me asking for a paid-in-full statement for her tax return. I went to the Google Sheet. The sheet was wrong. Her February rent had been logged under the wrong house. I spent ninety minutes reconciling, apologized twice, and sent the statement at midnight. I closed the laptop and said out loud, <em>"I am not doing this in 2027."</em></p>
      <p>The next morning I started Black Bear Rentals. First commit was January 11. First tenant paid rent through it on February 14 — my wife Megan thought I was joking when I said my Valentine's was a Stripe webhook firing correctly. By March 1st all 15 rooms were on it. Black Bear Rentals has not touched a spreadsheet since.</p>
    </div>

    <div className="story-beat">
      <div className="year">April 2026 · Beat 5</div>
      <h3>Why this works for other operators now.</h3>
      <p>Two operators in Birmingham found me through a Twitter thread I wrote in late February about the $280/mo sticker shock. They asked if they could pay me to let them use it. I said yes, awkwardly, because I hadn't designed it for anyone but myself. It turns out "designed for one guy with 15 rooms" ports surprisingly well to "a woman with 22 doors in Mountain Brook" and "a retired electrician with 8 houses in Bessemer." Because we have the same problems.</p>
      <p>Black Bear Rentals is now open to anyone running 1 – 300 units. It replaces AppFolio, most of QuickBooks, DocuSign, and the line item on your ledger called "bookkeeper." It costs $39 – $99/mo depending on portfolio size. And — this is the whole point — <em>it shows your brand, not mine.</em> Your tenant portal says your company name. Your lease PDFs have your logo. Your emails come from your domain. Black Bear Rentals is plumbing. You're the house.</p>
    </div>

  </div>

  
  <section className="section">
    <span className="kicker">Design philosophy</span>
    <h2 className="h2">Three things I've learned running 15 rooms.</h2>
    <p className="lede">Every product decision in Black Bear Rentals traces back to one of these. If something in the app feels obvious, it's because I lost money on it first.</p>
    <div className="lessons-grid">
      <div className="lesson">
        <div className="lesson-num">1</div>
        <h4>Your tenants should never see a tool's brand, only yours.</h4>
        <p>You are the relationship. The software is a clipboard. The clipboard doesn't get to put its logo on the rent receipt. This is why white-label is free on every Black Bear Rentals plan and always will be.</p>
      </div>
      <div className="lesson">
        <div className="lesson-num">2</div>
        <h4>Every 5-minute task is a 10-hour task once a year.</h4>
        <p>One late fee I forgot to charge = $50. Fifteen rooms times twelve months times "I'll get to it Saturday" = a real number. Automation isn't about saving time, it's about not leaving money on the table because you're tired.</p>
      </div>
      <div className="lesson">
        <div className="lesson-num">3</div>
        <h4>Default settings are policy.</h4>
        <p>If the late fee is a checkbox nobody remembers to tick, then in practice your policy is "no late fee." Black Bear Rentals ships with opinionated defaults — late at 5pm on day 6, 5% fee, auto-applied — because unopinionated software is just a form you fill out badly.</p>
      </div>
    </div>
  </section>

  
  <div className="quote-wrap">
    <div className="quote-card">
      <blockquote>
        Most property management software feels like it was designed by people who've never met a tenant. I wanted to build the opposite — software that looks like it was <em>built by someone who fixes toilets,</em> because it was.
      </blockquote>
      <div className="quote-attr">
        <div className="quote-avatar">HC</div>
        <div className="quote-attr-text">
          <div className="quote-attr-name">Harrison Cooper</div>
          <div className="quote-attr-role">Founder, Black Bear Rentals · Operator, Black Bear Rentals</div>
        </div>
      </div>
    </div>
  </div>

  
  <section className="section">
    <span className="kicker">Counter-positioning</span>
    <h2 className="h2">What Black Bear Rentals is not.</h2>
    <p className="lede">We're small on purpose. Here's what you're explicitly not buying.</p>
    <div className="not-grid">
      <div className="not-card">
        <div className="not-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
        <div>
          <h4>Not venture-funded.</h4>
          <p>Zero investors. No board. No growth-at-all-costs pressure. If we 10x, great. If we 2x and stay profitable, also great. The incentives are aligned with yours — keep you happy, keep you a customer.</p>
        </div>
      </div>
      <div className="not-card">
        <div className="not-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
        <div>
          <h4>Not built by people who've never owned a rental.</h4>
          <p>Every flow in the app was written against my own 15 rooms first. If it doesn't work for a real operator, it doesn't ship. My lease is the first one in the system. My deposit rules are the defaults.</p>
        </div>
      </div>
      <div className="not-card">
        <div className="not-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
        <div>
          <h4>Not trying to replace your judgment.</h4>
          <p>I will not auto-evict your tenant. I will not screen out an applicant because an algorithm said so. Black Bear Rentals surfaces information and handles paperwork. The call is always yours. Always.</p>
        </div>
      </div>
      <div className="not-card">
        <div className="not-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
        <div>
          <h4>Not an enterprise product pretending to be simple.</h4>
          <p>If you run 800 doors and need ACH positive pay workflows and HUD compliance, you want AppFolio or Yardi. I'll tell you that on the sales call. Black Bear Rentals is designed for 1 – 300 units run by an operator who also swings a hammer.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="section">
    <span className="kicker">How we operate</span>
    <h2 className="h2">Five principles I won't compromise.</h2>
    <p className="lede">Pin these on the wall. If we ever violate one of them, email me personally and I'll fix it.</p>
    <div className="values-grid">
      <div className="value">
        <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg></div>
        <h4>Operator-first</h4>
        <p>Every feature is measured against: does this save a real operator real time or real money?</p>
      </div>
      <div className="value">
        <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>
        <h4>Transparent</h4>
        <p>Pricing on the website. Changelog public. Roadmap public. We publish MRR quarterly on Twitter.</p>
      </div>
      <div className="value">
        <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
        <h4>No lock-in</h4>
        <p>Export your full tenant, lease, and ledger data as CSV any time. Cancel in-app. No exit interview.</p>
      </div>
      <div className="value">
        <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg></div>
        <h4>Bootstrapped and proud</h4>
        <p>Our only investor is our customers. Every new hire gets paid out of cash flow, not a Series A.</p>
      </div>
      <div className="value">
        <div className="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg></div>
        <h4>Built in public</h4>
        <p>Ship log in the app. Weekly email with what changed. Bugs on a Trello anyone can read.</p>
      </div>
    </div>
  </section>

  
  <section className="timeline-wrap">
    <div style={{textAlign: "center", maxWidth: "720px", margin: "0 auto 12px"}}>
      <span className="kicker">The path here</span>
      <h2 className="h2">Seven years, one detour through AppFolio.</h2>
    </div>
    <div className="timeline">
      <div className="timeline-items">
        <div className="tl-item">
          <div className="tl-dot" />
          <div className="tl-year">2019</div>
          <div className="tl-title">First rental</div>
          <div className="tl-desc">Accidental-landlord starter home in southwest Huntsville. $1,150 a month.</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot" />
          <div className="tl-year">2020 – 2023</div>
          <div className="tl-title">The spreadsheet era</div>
          <div className="tl-desc">Grew from 3 rooms to 15 across four co-living houses. All run on one Google Sheet.</div>
        </div>
        <div className="tl-item">
          <div className="tl-dot" />
          <div className="tl-year">2024</div>
          <div className="tl-title">AppFolio trial</div>
          <div className="tl-desc">Paid $280/mo for five months. Tenants saw AppFolio's brand, not mine. Cancelled in May.</div>
        </div>
        <div className="tl-item pink">
          <div className="tl-dot" />
          <div className="tl-year">Jan 2026</div>
          <div className="tl-title">First commit</div>
          <div className="tl-desc">Tenant emailed about a tax statement. Sheet was wrong. I opened a repo the next morning.</div>
        </div>
        <div className="tl-item now">
          <div className="tl-dot" />
          <div className="tl-year">Today</div>
          <div className="tl-title">Public launch</div>
          <div className="tl-desc">Black Bear runs fully on Black Bear Rentals. Two paying operators in Birmingham. You could be #3.</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="dogfood">
    <div className="dogfood-card">
      <div className="dogfood-badge">WE EAT<br />OUR OWN<br />COOKING</div>
      <div className="dogfood-text">
        <h3>Black Bear Rentals runs entirely on Black Bear Rentals.</h3>
        <p>Every tenant at every one of my houses logs into <strong>portal.blackbearrentals.com</strong> — which is just Black Bear Rentals with my logo on top. Rent, applications, renewals, maintenance tickets, lease signing — all of it. <strong>If you see a bug, I see it first, because my tenants hit it first.</strong> Which means the thing you're complaining about on a Tuesday is the thing that makes me miss a Stripe deposit on Wednesday. That's the kind of alignment you can't fake.</p>
      </div>
    </div>
  </section>

  
  <section className="section section-narrow">
    <span className="kicker">The team</span>
    <h2 className="h2">Currently, a team of one.</h2>
    <p className="lede">I'd rather move slow and hire the right second person than raise a round and hire four wrong ones.</p>
    <div className="team-grid">
      <div className="team-card">
        <div className="team-avatar">HC</div>
        <div className="team-info">
          <h4>Harrison Cooper</h4>
          <div className="role">Founder · Engineer · Plunger-in-chief</div>
          <p>Writes the code. Answers the support emails. Fixes the water heater at 908 Lee Dr. Former corporate ops person, now full-time operator and builder. Reachable at the address below.</p>
        </div>
      </div>
      <div className="team-empty">
        <strong>Hire #2 is open.</strong> Probably a senior full-stack engineer who has also rented a bedroom out in their life. If that's you, <a href="mailto:harrison@rentblackbear.com" style={{color: "var(--blue)", fontWeight: "600"}}>say hello.</a>
      </div>
    </div>
  </section>

  
  <section className="section section-narrow">
    <span className="kicker">Get in touch</span>
    <h2 className="h2">I read every email. Seriously.</h2>
    <p className="lede">There is no support tier. There is me. If you hit a wall, I'd rather know about it than not.</p>
    <div className="contact-grid">
      <a className="contact-card" href="mailto:harrison@rentblackbear.com">
        <div className="contact-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        </div>
        <h4>Email</h4>
        <div className="val">harrison@rentblackbear.com</div>
        <div className="desc">Best channel. Response usually within 4 business hours.</div>
      </a>
      <a className="contact-card" href="https://twitter.com/blackbear" target="_blank" rel="noopener">
        <div className="contact-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H22L14.5 10.5 23 22H16L11 15L5 22H1L9 13L0.5 2H7.5L12 8L18 2Z" /></svg>
        </div>
        <h4>Twitter / X</h4>
        <div className="val">@blackbear</div>
        <div className="desc">Where I post build-log updates and roast bad PM software.</div>
      </a>
      <a className="contact-card" href="#calendly">
        <div className="contact-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        </div>
        <h4>Book 15 minutes with me</h4>
        <div className="val">cal.com/harrison-cooper</div>
        <div className="desc">Free, no demo pitch. Bring questions or just say hi.</div>
      </a>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Come run your rentals on operator software.</h2>
      <p>14-day free trial, no card required. Lock in $99/mo for life while Founder pricing is open. If Black Bear Rentals doesn't save you 10 hours in your first 30 paid days, we refund you and wire $100 for your trouble.</p>
      <div className="cta-card-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Claim a Founders' spot
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
      <div className="cta-note">87 spots left · Built in Huntsville, AL</div>
    </div>
  </section>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals · Built in Huntsville, AL by Harrison Cooper</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="about.html">About</a>
      <a href="mailto:harrison@rentblackbear.com">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>


    </>
  );
}
