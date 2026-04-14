"use client";

// Mock ported verbatim from ~/Desktop/tenantory/stories.html.
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
      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545; --orange: #ea8c3a; --purple: #7c4dff;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);
    }

    /* ===== Topbar ===== */
    .topbar {
      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
    }
    .tb-brand { display: flex; align-items: center; gap: 10px; }
    .tb-logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--blue-bright), var(--pink));
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }
    .tb-nav { display: flex; gap: 4px; }
    .tb-nav-item {
      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);
      transition: all 0.15s ease;
    }
    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }
    .tb-nav-item.active { color: var(--blue); }
    .tb-cta { display: flex; gap: 10px; }
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
    .hero { padding: 80px 32px 36px; text-align: center; max-width: 920px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--green-bg); color: var(--green-dark);
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      margin-bottom: 18px;
    }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 { font-size: clamp(36px, 5vw, 54px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; margin-bottom: 18px; }
    .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }

    /* ===== Quick stats strip ===== */
    .strip {
      max-width: 1100px; margin: 36px auto 0; padding: 0 32px;
    }
    .strip-grid {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 100%);
      color: #fff; border-radius: var(--radius-xl); padding: 32px 36px;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;
      position: relative; overflow: hidden;
    }
    .strip-grid::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 260px; height: 260px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);
    }
    .strip-stat { position: relative; z-index: 1; }
    .strip-num { font-size: 38px; font-weight: 900; letter-spacing: -0.03em; line-height: 1; margin-bottom: 8px; }
    .strip-label { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; }

    /* ===== Filter pills ===== */
    .filters-wrap {
      max-width: 1100px; margin: 64px auto 28px; padding: 0 32px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
    }
    .filters-title { font-weight: 800; font-size: 22px; letter-spacing: -0.02em; }
    .filters {
      display: flex; gap: 6px; flex-wrap: wrap;
    }
    .pill {
      padding: 8px 16px; border-radius: 100px;
      background: var(--surface-alt); color: var(--text-muted);
      border: 1px solid var(--border);
      font-size: 13px; font-weight: 600;
      transition: all 0.15s ease;
    }
    .pill:hover { color: var(--text); border-color: var(--border-strong); }
    .pill.active { background: var(--text); color: #fff; border-color: var(--text); }

    /* ===== Featured story card ===== */
    .stories {
      max-width: 1100px; margin: 0 auto; padding: 0 32px;
      display: flex; flex-direction: column; gap: 32px;
    }
    .story {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm);
      display: grid; grid-template-columns: 320px 1fr;
      transition: all 0.2s ease;
    }
    .story:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
    .story.flip { grid-template-columns: 1fr 320px; }

    .story-side {
      background: linear-gradient(180deg, var(--surface-alt) 0%, var(--surface) 100%);
      padding: 32px 28px;
      display: flex; flex-direction: column; align-items: center; text-align: center;
      border-right: 1px solid var(--border);
    }
    .story.flip .story-side { border-right: none; border-left: 1px solid var(--border); order: 2; }

    .story-avatar {
      width: 96px; height: 96px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 800; font-size: 32px; letter-spacing: -0.02em;
      box-shadow: 0 12px 32px rgba(26,31,54,0.18);
      margin-bottom: 18px;
    }
    .story-avatar.green { background: linear-gradient(135deg, #1ea97c, #138a60); }
    .story-avatar.pink { background: linear-gradient(135deg, #FF4998, #c21a6a); }
    .story-avatar.gold { background: linear-gradient(135deg, #f5a623, #c47913); }
    .story-name { font-weight: 800; font-size: 18px; letter-spacing: -0.01em; margin-bottom: 4px; }
    .story-role { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
    .story-tags {
      display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 18px;
    }
    .story-tag {
      padding: 4px 10px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 11px; font-weight: 600; color: var(--text-muted);
    }

    .story-mini-stats {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      width: 100%; padding-top: 18px; border-top: 1px solid var(--border);
    }
    .story-mini-stat {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 12px;
      text-align: left;
    }
    .story-mini-stat-num { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1; }
    .story-mini-stat-label { font-size: 10.5px; color: var(--text-muted); margin-top: 4px; line-height: 1.3; font-weight: 500; }

    /* Story body */
    .story-body { padding: 36px 36px 28px; display: flex; flex-direction: column; }
    .story-pull {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 24px; font-weight: 600; line-height: 1.4; letter-spacing: -0.01em;
      color: var(--text); margin-bottom: 24px;
      position: relative; padding-left: 18px;
    }
    .story-pull::before {
      content: ""; position: absolute; left: 0; top: 6px; bottom: 6px;
      width: 4px; border-radius: 2px;
      background: linear-gradient(180deg, var(--blue-bright), var(--pink));
    }

    .story-narrative { display: flex; flex-direction: column; gap: 14px; color: var(--text); font-size: 14.5px; line-height: 1.65; }
    .story-narrative p strong { font-weight: 700; }

    .ba-grid {
      display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; align-items: stretch;
      margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border);
    }
    .ba-side {
      background: var(--surface-subtle); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
    }
    .ba-side.after { background: linear-gradient(135deg, var(--blue-pale), var(--blue-softer)); border-color: var(--blue-pale); }
    .ba-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
    .ba-side.after .ba-label { color: var(--blue); }
    .ba-list { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: var(--text); }
    .ba-list-item {
      display: flex; align-items: flex-start; gap: 6px; line-height: 1.4;
    }
    .ba-list-item svg { width: 11px; height: 11px; flex-shrink: 0; margin-top: 4px; opacity: 0.6; }
    .ba-list-item.cost { color: var(--text-muted); font-variant-numeric: tabular-nums; padding-top: 6px; margin-top: 4px; border-top: 1px solid var(--border); font-weight: 600; }
    .ba-side.after .ba-list-item.cost { color: var(--blue); border-top-color: var(--blue-pale); }

    .ba-arrow {
      align-self: center;
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--blue); display: flex; align-items: center; justify-content: center;
    }
    .ba-arrow svg { width: 16px; height: 16px; }

    .story-meta {
      display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
      margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border);
      font-size: 12px; color: var(--text-muted);
    }
    .story-meta-item { display: inline-flex; align-items: center; gap: 5px; }
    .story-meta-item svg { width: 13px; height: 13px; color: var(--text-faint); }
    .story-meta-item strong { color: var(--text); font-weight: 700; }
    .read-more { color: var(--blue); font-weight: 600; font-size: 13px; margin-left: auto; }
    .read-more:hover { text-decoration: underline; }

    /* ===== Mini quotes grid ===== */
    .quotes-section {
      max-width: 1100px; margin: 64px auto 0; padding: 0 32px;
    }
    .quotes-head {
      text-align: center; margin-bottom: 36px;
    }
    .quotes-head h2 { font-size: 30px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 10px; }
    .quotes-head p { color: var(--text-muted); font-size: 15px; max-width: 520px; margin: 0 auto; }
    .quotes-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    .quote {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      transition: all 0.15s ease;
      display: flex; flex-direction: column;
    }
    .quote:hover { border-color: var(--blue); box-shadow: var(--shadow-sm); transform: translateY(-2px); }
    .quote-stars { color: var(--gold); margin-bottom: 12px; display: flex; gap: 2px; }
    .quote-stars svg { width: 14px; height: 14px; fill: var(--gold); stroke: var(--gold); }
    .quote-text {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 15px; line-height: 1.55; color: var(--text);
      flex: 1; margin-bottom: 18px;
    }
    .quote-author { display: flex; align-items: center; gap: 12px; padding-top: 14px; border-top: 1px solid var(--border); }
    .quote-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; flex-shrink: 0;
    }
    .quote-avatar.a { background: linear-gradient(135deg, var(--blue), var(--blue-bright)); }
    .quote-avatar.b { background: linear-gradient(135deg, var(--pink), #c21a6a); }
    .quote-avatar.c { background: linear-gradient(135deg, var(--green), var(--green-dark)); }
    .quote-avatar.d { background: linear-gradient(135deg, var(--gold), #c47913); }
    .quote-avatar.e { background: linear-gradient(135deg, var(--purple), #5a36c2); }
    .quote-avatar.f { background: linear-gradient(135deg, var(--orange), #c66a23); }
    .quote-name { font-weight: 700; font-size: 13px; }
    .quote-role { font-size: 11px; color: var(--text-muted); }

    /* ===== Logos strip ===== */
    .logos {
      max-width: 1100px; margin: 64px auto 0; padding: 36px 32px;
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      text-align: center;
    }
    .logos-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 22px; }
    .logos-row {
      display: flex; gap: 36px; justify-content: center; flex-wrap: wrap; align-items: center;
    }
    .logo-name {
      font-family: 'Source Serif 4', Georgia, serif;
      font-weight: 700; font-size: 17px; color: var(--text-faint);
      letter-spacing: -0.01em; opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    .logo-name:hover { opacity: 1; }

    /* ===== Bottom CTA ===== */
    .cta-bottom { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 60%, var(--pink) 180%);
      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-card::before {
      content: ""; position: absolute; top: -40%; left: -10%;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);
    }
    .cta-card > * { position: relative; z-index: 1; }
    .cta-card h2 { font-size: clamp(28px, 4vw, 38px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 28px; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }
    .cta-note { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 16px; }

    /* ===== Footer ===== */
    .foot {
      max-width: 1100px; margin: 64px auto 0; padding: 36px 32px 28px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 18px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 880px) {
      .topbar { padding: 12px 16px; }
      .tb-nav { display: none; }
      .hero { padding: 48px 20px 28px; }
      .strip-grid { grid-template-columns: repeat(2, 1fr); padding: 22px; gap: 18px; }
      .filters-wrap { padding: 0 16px; }
      .stories { padding: 0 16px; }
      .story, .story.flip { grid-template-columns: 1fr; }
      .story.flip .story-side { order: 0; border-left: none; border-bottom: 1px solid var(--border); }
      .story-side { border-right: none; border-bottom: 1px solid var(--border); padding: 24px; }
      .story-body { padding: 24px; }
      .ba-grid { grid-template-columns: 1fr; }
      .ba-arrow { transform: rotate(90deg); margin: 0 auto; }
      .quotes-section, .logos, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .quotes-grid { grid-template-columns: 1fr; }
      .cta-card { padding: 36px 22px; }
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
      <a class="tb-nav-item active" href="stories.html">Stories</a>
      <a class="tb-nav-item" href="landing.html#faq">FAQ</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Real numbers · real operators · zero VC-funded testimonials
    </div>
    <h1>Operators getting their <em>weekends back.</em></h1>
    <p class="hero-sub">No paid testimonials. No "amazing platform" stock quotes. Just three working PMs, what they were doing before, and what changed after switching to Tenantory.</p>
  </section>

  <!-- Stats strip -->
  <div class="strip">
    <div class="strip-grid">
      <div class="strip-stat">
        <div class="strip-num">11.2 hrs</div>
        <div class="strip-label">Average weekly time saved</div>
      </div>
      <div class="strip-stat">
        <div class="strip-num">$1,146</div>
        <div class="strip-label">Average monthly tool savings</div>
      </div>
      <div class="strip-stat">
        <div class="strip-num">96%</div>
        <div class="strip-label">Stay past the 14-day trial</div>
      </div>
      <div class="strip-stat">
        <div class="strip-num">&lt;2%</div>
        <div class="strip-label">Claim the $100 refund guarantee</div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters-wrap">
    <div class="filters-title">3 featured stories · 12 quick wins</div>
    <div class="filters" id="filters">
      <button class="pill active" data-filter="all">All</button>
      <button class="pill" data-filter="solo">Solo landlord</button>
      <button class="pill" data-filter="coliving">Co-living</button>
      <button class="pill" data-filter="growing">Growing portfolio</button>
      <button class="pill" data-filter="switch">Switched from AppFolio</button>
    </div>
  </div>

  <!-- Featured stories -->
  <section class="stories">

    <!-- Story 1: Diane (solo landlord) -->
    <article class="story" data-tags="solo switch">
      <div class="story-side">
        <div class="story-avatar pink">DM</div>
        <div class="story-name">Diane Morales</div>
        <div class="story-role">Solo landlord · Birmingham, AL</div>
        <div class="story-tags">
          <span class="story-tag">4 doors</span>
          <span class="story-tag">Pro plan</span>
          <span class="story-tag">Switched from AppFolio</span>
        </div>
        <div class="story-mini-stats">
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">9 hrs</div>
            <div class="story-mini-stat-label">Saved per week</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">$181</div>
            <div class="story-mini-stat-label">Monthly tool savings</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">7 days</div>
            <div class="story-mini-stat-label">Migration time</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">100%</div>
            <div class="story-mini-stat-label">On autopay now</div>
          </div>
        </div>
      </div>

      <div class="story-body">
        <p class="story-pull">"AppFolio was charging me $280/mo to do what I now do for $99. Plus my tenants used to ask me 'who is AppFolio?' — now they just see <em>Morales Properties</em>."</p>
        <div class="story-narrative">
          <p><strong>The before:</strong> Diane bought her first rental in 2019 and added three more by 2024. She started on AppFolio because that's what her real estate agent recommended. Within a year she was paying $280/mo for a tool that was overkill — and her tenants kept asking her about confusing AppFolio emails.</p>
          <p><strong>The switch:</strong> A friend in her REIA group mentioned Tenantory. She did the migration on a Saturday — exported her tenants and lease data from AppFolio, sent the CSV to Tenantory's support, was fully live by Monday morning.</p>
          <p><strong>The change:</strong> "The biggest thing isn't even the money — it's that everything is on my brand now. My tenants pay rent at <span style="color:var(--blue);font-weight:700;">morales-properties.tenantory.com</span>. They get emails from <span style="color:var(--blue);font-weight:700;">hello@moralesproperties.com</span>. They think I built it. I just signed up."</p>
        </div>

        <div class="ba-grid">
          <div class="ba-side">
            <div class="ba-label">Before · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>AppFolio Lite</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>QuickBooks Self-Employed</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Squarespace site</div>
              <div class="ba-list-item cost">$280/mo</div>
            </div>
          </div>
          <div class="ba-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div class="ba-side after">
            <div class="ba-label">After · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenantory Pro</div>
              <div class="ba-list-item cost">$99/mo · saves $181/mo</div>
            </div>
          </div>
        </div>

        <div class="story-meta">
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Customer since <strong>Jan 2026</strong></span>
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Founders' cohort</span>
          <a class="read-more" href="#" onclick="event.preventDefault();">Read full case study →</a>
        </div>
      </div>
    </article>

    <!-- Story 2: Marcus (co-living) -->
    <article class="story flip" data-tags="coliving growing">
      <div class="story-body">
        <p class="story-pull">"My 18 rooms used to take an entire weekend a month to reconcile. Now I close out the month in 35 minutes — including investor reports."</p>
        <div class="story-narrative">
          <p><strong>The before:</strong> Marcus runs three co-living houses in Atlanta with 18 individual rooms. He had spreadsheets feeding QuickBooks feeding a hand-coded landing page. Tenants paid through three different methods. Reconciling rent at month-end took an entire Saturday — and his investors wanted monthly reports he was building in PowerPoint.</p>
          <p><strong>The change that mattered most:</strong> "The per-room rent roll is the killer feature. Other PM tools think a 'unit' is an apartment. For co-living, that's useless — I needed a room as the unit. Tenantory got that on day one. Plus the investor PDF that auto-generates every month? My LPs love it. Makes me look like I have ops."</p>
          <p><strong>One unexpected win:</strong> his maintenance costs dropped 22% in the first quarter because his vendors actually adopted the vendor portal — fewer emergency calls, more scheduled visits. "Joel my plumber says it's the only PM tool he doesn't hate. I think that's a real bar."</p>
        </div>

        <div class="ba-grid">
          <div class="ba-side">
            <div class="ba-label">Before · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Google Sheets (3 tabs deep)</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>QuickBooks Online</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>DocuSign + Stripe + manual receipts</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>PowerPoint investor reports</div>
              <div class="ba-list-item cost">~$700/mo</div>
            </div>
          </div>
          <div class="ba-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div class="ba-side after">
            <div class="ba-label">After · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenantory Scale</div>
              <div class="ba-list-item cost">$299/mo · saves $401/mo</div>
            </div>
          </div>
        </div>

        <div class="story-meta">
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Customer since <strong>Nov 2025</strong></span>
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v12H3zM3 9l9-6 9 6"/></svg>Custom domain (atlcoliving.com)</span>
          <a class="read-more" href="#" onclick="event.preventDefault();">Read full case study →</a>
        </div>
      </div>

      <div class="story-side">
        <div class="story-avatar green">MJ</div>
        <div class="story-name">Marcus Johnson</div>
        <div class="story-role">ATL Co-Living · Atlanta, GA</div>
        <div class="story-tags">
          <span class="story-tag">18 rooms · 3 houses</span>
          <span class="story-tag">Scale plan</span>
          <span class="story-tag">White-label</span>
        </div>
        <div class="story-mini-stats">
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">14 hrs</div>
            <div class="story-mini-stat-label">Saved per week</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">22%</div>
            <div class="story-mini-stat-label">Lower maintenance cost</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">35 min</div>
            <div class="story-mini-stat-label">Month-end close</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">100%</div>
            <div class="story-mini-stat-label">Investor adoption</div>
          </div>
        </div>
      </div>
    </article>

    <!-- Story 3: Sarah & Tom -->
    <article class="story" data-tags="growing">
      <div class="story-side">
        <div class="story-avatar gold">ST</div>
        <div class="story-name">Sarah &amp; Tom Pruitt</div>
        <div class="story-role">Pruitt Family Rentals · Mobile, AL</div>
        <div class="story-tags">
          <span class="story-tag">12 SFH</span>
          <span class="story-tag">Pro plan</span>
          <span class="story-tag">First time using software</span>
        </div>
        <div class="story-mini-stats">
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">10 hrs</div>
            <div class="story-mini-stat-label">Saved per week</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">2 days</div>
            <div class="story-mini-stat-label">From late rent to paid</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">$0</div>
            <div class="story-mini-stat-label">Spent on software before</div>
          </div>
          <div class="story-mini-stat">
            <div class="story-mini-stat-num">12/12</div>
            <div class="story-mini-stat-label">Tenants on autopay</div>
          </div>
        </div>
      </div>

      <div class="story-body">
        <p class="story-pull">"We were running 12 properties out of a binder and Tom's iPhone notes app. Last tax season we paid our CPA $2,400 to figure it all out. This year, we'll print the Tax Pack and email it."</p>
        <div class="story-narrative">
          <p><strong>The before:</strong> Sarah and Tom inherited their first rental from Tom's father in 2018. They added one or two a year by buying foreclosures. Twelve houses later, they were still operating like they had two — paper leases in a binder, rent collected by mailed checks, repairs coordinated through Tom's contractor brother-in-law via text.</p>
          <p><strong>What broke them:</strong> Last tax season took 6 weekends. Their CPA charged $2,400 to reconstruct the year from receipts shoved in shoeboxes. "We knew we were leaving money on the table — depreciation, mileage, repairs we forgot to log. We just didn't know what to do about it."</p>
          <p><strong>The switch:</strong> "We'd never used PM software before. Tenantory's onboarding wizard literally walked us through everything. Fifteen minutes in, we had our first property up. By end of week one, all 12 tenants were on autopay. By end of month one, we'd recovered $4,800 in late fees and missed charges that we'd been forgetting to bill."</p>
        </div>

        <div class="ba-grid">
          <div class="ba-side">
            <div class="ba-label">Before · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Three-ring binder + iPhone notes</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Mailed paper checks</div>
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>$2,400/yr CPA reconstruction</div>
              <div class="ba-list-item cost">$200/mo equivalent</div>
            </div>
          </div>
          <div class="ba-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div class="ba-side after">
            <div class="ba-label">After · stack</div>
            <div class="ba-list">
              <div class="ba-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenantory Pro</div>
              <div class="ba-list-item cost">$99/mo · plus $4,800 recovered</div>
            </div>
          </div>
        </div>

        <div class="story-meta">
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Customer since <strong>Feb 2026</strong></span>
          <span class="story-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Founders' cohort</span>
          <a class="read-more" href="#" onclick="event.preventDefault();">Read full case study →</a>
        </div>
      </div>
    </article>

  </section>

  <!-- ===== Mini quotes ===== -->
  <section class="quotes-section">
    <div class="quotes-head">
      <h2>What other operators are saying.</h2>
      <p>Pulled from the in-app feedback prompt, Slack DMs, and emails. Lightly edited for length, never for content.</p>
    </div>
    <div class="quotes-grid">

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"The Tax Pack export literally saved my CPA two days of work. He gave me a $400 credit on my bill. Tenantory paid for itself in one click."</div>
        <div class="quote-author">
          <div class="quote-avatar a">RH</div>
          <div>
            <div class="quote-name">Rebecca Han</div>
            <div class="quote-role">9 doors · Charlotte, NC</div>
          </div>
        </div>
      </div>

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"Switched from Buildium last week. The migration team did everything — I literally just had to confirm. Smoothest software change I've ever done."</div>
        <div class="quote-author">
          <div class="quote-avatar b">DK</div>
          <div>
            <div class="quote-name">Devon Kim</div>
            <div class="quote-role">23 units · Nashville, TN</div>
          </div>
        </div>
      </div>

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"The AI scoring on applications cut my screening time by 70%. I still read every file but I know within 30 seconds which ones to focus on."</div>
        <div class="quote-author">
          <div class="quote-avatar c">AM</div>
          <div>
            <div class="quote-name">Alicia Mensah</div>
            <div class="quote-role">31 units · Houston, TX</div>
          </div>
        </div>
      </div>

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"My tenants love that they can pay rent from a portal that has my logo on it. One of them asked if I built it. I had to explain what white-label means."</div>
        <div class="quote-author">
          <div class="quote-avatar d">JT</div>
          <div>
            <div class="quote-name">Jamal Thompson</div>
            <div class="quote-role">7 units · Memphis, TN</div>
          </div>
        </div>
      </div>

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"Locked the $99 Founders price two weeks ago. Already talked three other landlords in my REIA into signing up before the price goes up."</div>
        <div class="quote-author">
          <div class="quote-avatar e">LR</div>
          <div>
            <div class="quote-name">Luis Ruiz</div>
            <div class="quote-role">15 doors · San Antonio, TX</div>
          </div>
        </div>
      </div>

      <div class="quote">
        <div class="quote-stars">
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg viewBox="0 0 24 24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="quote-text">"Support reply time is shockingly fast. Emailed at 11pm on a Saturday about a Stripe webhook issue, had a fix by 8am Sunday. Who does that?"</div>
        <div class="quote-author">
          <div class="quote-avatar f">PI</div>
          <div>
            <div class="quote-name">Priya Iyer</div>
            <div class="quote-role">22 units · Raleigh, NC</div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ===== Logos / cities strip ===== -->
  <section class="logos">
    <div class="logos-label">Trusted by operators in</div>
    <div class="logos-row">
      <span class="logo-name">Atlanta</span>
      <span class="logo-name">Birmingham</span>
      <span class="logo-name">Charlotte</span>
      <span class="logo-name">Houston</span>
      <span class="logo-name">Huntsville</span>
      <span class="logo-name">Memphis</span>
      <span class="logo-name">Mobile</span>
      <span class="logo-name">Nashville</span>
      <span class="logo-name">Raleigh</span>
      <span class="logo-name">San Antonio</span>
    </div>
  </section>

  <!-- ===== Bottom CTA ===== -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>Want your story here next year?</h2>
      <p>Lock the $99 Founders rate, get the $3,850 bonus stack, and become customer story #4. We'll send a photographer if you say yes.</p>
      <div class="cta-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Claim a Founders' spot
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="pricing.html">
          See pricing
        </a>
      </div>
      <div class="cta-note">14-day trial · no credit card · $100 if it doesn't save you 10 hours</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
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
