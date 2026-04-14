"use client";

// Mock ported verbatim from ~/Desktop/tenantory/integrations.html.
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
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --red: #d64545; --purple: #7c4dff;
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);
    }

    .topbar {
      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
    }
    .tb-brand { display: flex; align-items: center; gap: 10px; }
    .tb-logo { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; color: #fff; }
    .tb-logo svg { width: 18px; height: 18px; }
    .tb-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }
    .tb-nav { display: flex; gap: 4px; }
    .tb-nav-item { padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted); transition: all 0.15s ease; }
    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }
    .tb-nav-item.active { color: var(--blue); }
    .tb-cta { display: flex; gap: 10px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }
    .btn svg { width: 16px; height: 16px; }
    .btn-primary { background: var(--blue); color: #fff; }
    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }
    .btn-pink { background: var(--pink); color: #fff; }
    .btn-pink:hover { background: #e63882; transform: translateY(-1px); }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }
    .btn-nav { padding: 9px 16px; font-size: 13px; }
    .btn-lg { padding: 14px 28px; font-size: 15px; }

    /* Hero */
    .hero { padding: 72px 32px 36px; text-align: center; max-width: 880px; margin: 0 auto; }
    .hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; background: var(--blue-pale); color: var(--blue); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 18px; }
    .hero-eyebrow svg { width: 12px; height: 12px; }
    .hero h1 { font-size: clamp(36px, 5vw, 54px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; margin-bottom: 18px; }
    .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }

    /* Filter tabs */
    .filters { max-width: 1100px; margin: 40px auto 28px; padding: 0 32px; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }
    .f-pill { padding: 8px 16px; border-radius: 100px; background: var(--surface); border: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--text-muted); transition: all 0.15s ease; }
    .f-pill:hover { color: var(--text); border-color: var(--border-strong); }
    .f-pill.active { background: var(--text); color: #fff; border-color: var(--text); }

    /* Integration grid */
    .grid-wrap { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
    .int-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
    .int-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      display: flex; flex-direction: column; gap: 12px;
      transition: all 0.2s ease; position: relative;
    }
    .int-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue-pale); }
    .int-card.featured { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue); }

    .int-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .int-logo {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; color: #fff;
      font-weight: 800; font-size: 15px; letter-spacing: -0.02em; flex-shrink: 0;
    }
    .int-logo.stripe { background: linear-gradient(135deg, #635bff, #4a44d1); }
    .int-logo.plaid { background: linear-gradient(135deg, #111, #444); }
    .int-logo.transunion { background: linear-gradient(135deg, #0081c9, #00659c); }
    .int-logo.qb { background: linear-gradient(135deg, #2ca01c, #1f7a14); }
    .int-logo.resend { background: linear-gradient(135deg, #000, #333); }
    .int-logo.twilio { background: linear-gradient(135deg, #f22f46, #c41c31); }
    .int-logo.clerk { background: linear-gradient(135deg, #6c47ff, #4930cc); }
    .int-logo.google { background: linear-gradient(135deg, #4285f4, #34a853); }
    .int-logo.microsoft { background: linear-gradient(135deg, #0078d4, #005a9e); }
    .int-logo.okta { background: linear-gradient(135deg, #007dc1, #005a8a); }
    .int-logo.rentcast { background: linear-gradient(135deg, var(--gold), #c47913); }
    .int-logo.zillow { background: linear-gradient(135deg, #006aff, #004fbf); }
    .int-logo.slack { background: linear-gradient(135deg, #4a154b, #611f5f); }
    .int-logo.zapier { background: linear-gradient(135deg, #ff4a00, #c93a00); }
    .int-logo.api { background: linear-gradient(135deg, var(--navy), var(--navy-darker)); }
    .int-logo.webhook { background: linear-gradient(135deg, var(--pink), #c21a6a); }
    .int-logo.ical { background: linear-gradient(135deg, var(--purple), #5a36c2); }
    .int-logo.google-cal { background: linear-gradient(135deg, #1a73e8, #0d58c0); }
    .int-logo.august { background: linear-gradient(135deg, #d4281f, #a51c14); }
    .int-logo.schlage { background: linear-gradient(135deg, #7c4dff, #5a36c2); }
    .int-logo.mailchimp { background: linear-gradient(135deg, #ffe01b, #c4ac14); color: #222; }

    .int-status {
      font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px;
      letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
    }
    .int-status.live { background: var(--green-bg); color: var(--green-dark); }
    .int-status.soon { background: var(--blue-pale); color: var(--blue); }
    .int-status.scale { background: var(--pink-bg); color: #c21a6a; }

    .int-name { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
    .int-category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
    .int-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; flex: 1; }
    .int-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }
    .int-foot strong { color: var(--text); font-weight: 700; }

    /* Featured section */
    .featured-wrap { max-width: 1100px; margin: 60px auto 0; padding: 0 32px; }
    .section-head { text-align: center; margin-bottom: 36px; }
    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }
    .section-head h2 { font-size: clamp(26px, 3.2vw, 36px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }
    .section-head p { font-size: 15px; color: var(--text-muted); max-width: 560px; margin: 0 auto; }

    .deep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .deep {
      background: linear-gradient(180deg, var(--surface) 0%, var(--surface-alt) 100%);
      border: 1px solid var(--border); border-radius: var(--radius-xl);
      padding: 26px; transition: all 0.2s ease;
    }
    .deep:hover { border-color: var(--blue); transform: translateY(-3px); box-shadow: var(--shadow); }
    .deep-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .deep-head .int-logo { width: 48px; height: 48px; }
    .deep-head-text { flex: 1; }
    .deep-title { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
    .deep-meta { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
    .deep-body { font-size: 13.5px; color: var(--text); line-height: 1.6; margin-bottom: 14px; }
    .deep-bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    .deep-bullets li { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }
    .deep-bullets svg { width: 13px; height: 13px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }

    /* Developer block */
    .dev-wrap { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }
    .dev-card {
      background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-darker) 100%);
      color: #fff; border-radius: var(--radius-xl); padding: 40px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center;
      position: relative; overflow: hidden;
    }
    .dev-card::after {
      content: ""; position: absolute; top: -60px; right: -60px;
      width: 280px; height: 280px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);
    }
    .dev-label { font-size: 11px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; position: relative; z-index: 1; }
    .dev-card h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; position: relative; z-index: 1; }
    .dev-card p { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.6; margin-bottom: 18px; position: relative; z-index: 1; }
    .dev-bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; z-index: 1; }
    .dev-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.85); }
    .dev-bullets svg { width: 14px; height: 14px; color: var(--pink); flex-shrink: 0; margin-top: 3px; }
    .dev-code {
      background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.15);
      border-radius: var(--radius); padding: 18px; overflow-x: auto;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;
      color: rgba(255,255,255,0.9); position: relative; z-index: 1;
    }
    .dev-code .c { color: rgba(255,255,255,0.45); }
    .dev-code .k { color: #ff8ac9; }
    .dev-code .s { color: #b5e8b5; }
    .dev-code .n { color: #ffc97d; }

    /* FAQ */
    .faq-wrap { max-width: 820px; margin: 80px auto 0; padding: 0 32px; }
    .faq-list { display: flex; flex-direction: column; gap: 10px; }
    .faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.15s ease; }
    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }
    .faq-q { padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; width: 100%; text-align: left; }
    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }
    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }
    .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6; }
    .faq-item.open .faq-a { max-height: 480px; padding: 0 22px 20px; }

    /* CTA */
    .cta-bottom { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }
    .cta-card {
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);
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
    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto 28px; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }
    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }

    /* Footer */
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
      .filters, .grid-wrap, .featured-wrap, .dev-wrap, .faq-wrap, .cta-bottom { padding-left: 16px; padding-right: 16px; }
      .int-grid, .deep-grid { grid-template-columns: 1fr; }
      .dev-card { grid-template-columns: 1fr; padding: 28px; }
      .cta-card { padding: 36px 22px; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <a class="tb-brand" href="landing.html">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <span class="tb-brand-name">Tenantory</span>
    </a>
    <nav class="tb-nav">
      <a class="tb-nav-item" href="landing.html">Home</a>
      <a class="tb-nav-item" href="pricing.html">Pricing</a>
      <a class="tb-nav-item" href="stories.html">Stories</a>
      <a class="tb-nav-item active" href="integrations.html">Integrations</a>
      <a class="tb-nav-item" href="security.html">Security</a>
    </nav>
    <div class="tb-cta">
      <a class="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a class="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      21 integrations · pre-wired on Pro · API access on Scale
    </div>
    <h1>Everything <em>already connects.</em></h1>
    <p class="hero-sub">We did the integration work so you don't have to. Your tenant pays rent through Stripe, your credit check runs through TransUnion, your lease gets e-signed natively — no Zapier middleware, no "connect your accounts" wizard.</p>
  </section>

  <!-- Filters -->
  <div class="filters" id="filters">
    <button class="f-pill active" data-cat="all">All</button>
    <button class="f-pill" data-cat="payments">Payments</button>
    <button class="f-pill" data-cat="screening">Applicant screening</button>
    <button class="f-pill" data-cat="comms">Communications</button>
    <button class="f-pill" data-cat="auth">Auth &amp; identity</button>
    <button class="f-pill" data-cat="accounting">Accounting</button>
    <button class="f-pill" data-cat="calendar">Calendar</button>
    <button class="f-pill" data-cat="iot">Smart locks</button>
    <button class="f-pill" data-cat="data">Property data</button>
    <button class="f-pill" data-cat="dev">Developer</button>
  </div>

  <!-- Grid -->
  <section class="grid-wrap">
    <div class="int-grid">

      <div class="int-card featured" data-cat="payments">
        <div class="int-head">
          <div class="int-logo stripe">S</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Stripe</div>
          <div class="int-category">Payments</div>
        </div>
        <div class="int-desc">All rent, deposits, and application fees. ACH free, cards 2.95%. Your tenants see your brand on the checkout, not Stripe's.</div>
        <div class="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div class="int-card featured" data-cat="payments">
        <div class="int-head">
          <div class="int-logo plaid">P</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Plaid</div>
          <div class="int-category">Bank connections</div>
        </div>
        <div class="int-desc">Tenants link their bank account once and autopay starts. Zero micro-deposit wait, no account numbers to type.</div>
        <div class="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div class="int-card featured" data-cat="screening">
        <div class="int-head">
          <div class="int-logo transunion">TU</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">TransUnion SmartMove</div>
          <div class="int-category">Credit &amp; background</div>
        </div>
        <div class="int-desc">Applicants authorize the check in the application form. You get credit report, criminal background, and eviction history in ~10 minutes. Fee passed through to applicant.</div>
        <div class="int-foot"><strong>Pro+</strong><span>Included in $45 app fee</span></div>
      </div>

      <div class="int-card" data-cat="comms">
        <div class="int-head">
          <div class="int-logo resend">R</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Resend</div>
          <div class="int-category">Email</div>
        </div>
        <div class="int-desc">Every transactional email — rent receipts, maintenance updates, lease PDFs. Sends from <code style="font-size:11px;background:var(--surface-subtle);padding:1px 5px;border-radius:3px;">noreply@yourname.tenantory.com</code> or your custom domain.</div>
        <div class="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div class="int-card" data-cat="comms">
        <div class="int-head">
          <div class="int-logo twilio">T</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Twilio</div>
          <div class="int-category">SMS</div>
        </div>
        <div class="int-desc">Rent reminders, late-rent nudges, maintenance updates sent as texts. Two-way threading — tenants reply, you see it in the portal.</div>
        <div class="int-foot"><strong>Starter+</strong><span>200/mo on Starter, 2k on Pro</span></div>
      </div>

      <div class="int-card featured" data-cat="auth">
        <div class="int-head">
          <div class="int-logo clerk">C</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Clerk</div>
          <div class="int-category">Authentication</div>
        </div>
        <div class="int-desc">All login, MFA, session management. Passwords never touch our servers. Social login included (Google, Apple, Microsoft).</div>
        <div class="int-foot"><strong>Starter+</strong><span>Invisible layer</span></div>
      </div>

      <div class="int-card" data-cat="auth">
        <div class="int-head">
          <div class="int-logo google">G</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Google Workspace SSO</div>
          <div class="int-category">Team login</div>
        </div>
        <div class="int-desc">Staff sign in with your company Google account. Provisioning optional via Clerk.</div>
        <div class="int-foot"><strong>Pro+</strong><span>5-min setup</span></div>
      </div>

      <div class="int-card" data-cat="auth">
        <div class="int-head">
          <div class="int-logo microsoft">M</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Microsoft Entra</div>
          <div class="int-category">Team SSO</div>
        </div>
        <div class="int-desc">For PMs running on the Microsoft stack. Azure AD / Entra ID sign-in.</div>
        <div class="int-foot"><strong>Pro+</strong><span>5-min setup</span></div>
      </div>

      <div class="int-card" data-cat="auth">
        <div class="int-head">
          <div class="int-logo okta">O</div>
          <span class="int-status scale">Scale+</span>
        </div>
        <div>
          <div class="int-name">Okta · SAML · SCIM</div>
          <div class="int-category">Enterprise SSO</div>
        </div>
        <div class="int-desc">Generic SAML 2.0 / OIDC for any identity provider. User provisioning via SCIM. Required for most enterprise buys.</div>
        <div class="int-foot"><strong>Scale+</strong><span>30-min setup</span></div>
      </div>

      <div class="int-card" data-cat="accounting">
        <div class="int-head">
          <div class="int-logo qb">QB</div>
          <span class="int-status live">Export</span>
        </div>
        <div>
          <div class="int-name">QuickBooks</div>
          <div class="int-category">Accounting export</div>
        </div>
        <div class="int-desc">Export your full ledger as a QuickBooks-ready IIF or CSV file. Syncs categories to your existing chart of accounts.</div>
        <div class="int-foot"><strong>Pro+</strong><span>No sync, clean export</span></div>
      </div>

      <div class="int-card" data-cat="accounting">
        <div class="int-head">
          <div class="int-logo" style="background: linear-gradient(135deg, #13b5ea, #0891b2);">X</div>
          <span class="int-status live">Export</span>
        </div>
        <div>
          <div class="int-name">Xero</div>
          <div class="int-category">Accounting export</div>
        </div>
        <div class="int-desc">CSV export mapped to Xero's standard import format. Reconciles rent by property, expenses by vendor.</div>
        <div class="int-foot"><strong>Pro+</strong><span>No sync, clean export</span></div>
      </div>

      <div class="int-card" data-cat="calendar">
        <div class="int-head">
          <div class="int-logo google-cal">GC</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">Google Calendar</div>
          <div class="int-category">Calendar sync</div>
        </div>
        <div class="int-desc">Lease renewals, inspection dates, vendor visits — two-way sync with your Google Calendar. Your vendors get their own feed.</div>
        <div class="int-foot"><strong>Pro+</strong><span>One-click auth</span></div>
      </div>

      <div class="int-card" data-cat="calendar">
        <div class="int-head">
          <div class="int-logo ical">iC</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">iCal / Outlook</div>
          <div class="int-category">Calendar export</div>
        </div>
        <div class="int-desc">Subscribe to an always-current iCal feed from any calendar app (Apple Calendar, Outlook, Fantastical).</div>
        <div class="int-foot"><strong>Pro+</strong><span>Paste one URL</span></div>
      </div>

      <div class="int-card" data-cat="iot">
        <div class="int-head">
          <div class="int-logo august">A</div>
          <span class="int-status scale">Scale+</span>
        </div>
        <div>
          <div class="int-name">August Smart Locks</div>
          <div class="int-category">Access control</div>
        </div>
        <div class="int-desc">Generate a tenant lock code on lease sign, auto-revoke on move-out. Short-term guest codes for maintenance vendors.</div>
        <div class="int-foot"><strong>Scale+</strong><span>Per-property setup</span></div>
      </div>

      <div class="int-card" data-cat="iot">
        <div class="int-head">
          <div class="int-logo schlage">SC</div>
          <span class="int-status soon">Coming Q3</span>
        </div>
        <div>
          <div class="int-name">Schlage Encode</div>
          <div class="int-category">Access control</div>
        </div>
        <div class="int-desc">Keypad smart locks with tenant-scoped codes. Native integration planned for Q3 2026.</div>
        <div class="int-foot"><strong>Scale+</strong><span>In beta</span></div>
      </div>

      <div class="int-card" data-cat="data">
        <div class="int-head">
          <div class="int-logo rentcast">RC</div>
          <span class="int-status live">Built-in</span>
        </div>
        <div>
          <div class="int-name">RentCast</div>
          <div class="int-category">Market comps</div>
        </div>
        <div class="int-desc">Live rent comps for every property. See what similar units are renting for within 0.5 miles, right in your property detail.</div>
        <div class="int-foot"><strong>Pro+</strong><span>No setup</span></div>
      </div>

      <div class="int-card" data-cat="data">
        <div class="int-head">
          <div class="int-logo zillow">Z</div>
          <span class="int-status live">Push</span>
        </div>
        <div>
          <div class="int-name">Zillow · Apartments.com · Hotpads</div>
          <div class="int-category">Listing syndication</div>
        </div>
        <div class="int-desc">One click pushes your vacancy to all three. Leads land in your Applications kanban. Auto-pulls when the unit rents.</div>
        <div class="int-foot"><strong>Pro+</strong><span>No setup</span></div>
      </div>

      <div class="int-card" data-cat="comms">
        <div class="int-head">
          <div class="int-logo slack">SL</div>
          <span class="int-status soon">Coming Q2</span>
        </div>
        <div>
          <div class="int-name">Slack</div>
          <div class="int-category">Team alerts</div>
        </div>
        <div class="int-desc">Route urgent maintenance, late rent, and new applications to a Slack channel. Useful for 2+ person teams.</div>
        <div class="int-foot"><strong>Pro+</strong><span>In beta</span></div>
      </div>

      <div class="int-card" data-cat="dev">
        <div class="int-head">
          <div class="int-logo api">API</div>
          <span class="int-status scale">Scale+</span>
        </div>
        <div>
          <div class="int-name">REST API</div>
          <div class="int-category">Developer</div>
        </div>
        <div class="int-desc">Full read/write API scoped to your workspace. Fetch rent rolls, create tickets, manage tenants. Bearer-token auth, JSON everywhere.</div>
        <div class="int-foot"><strong>Scale+</strong><span>Docs at api.tenantory.com</span></div>
      </div>

      <div class="int-card" data-cat="dev">
        <div class="int-head">
          <div class="int-logo webhook">WH</div>
          <span class="int-status scale">Scale+</span>
        </div>
        <div>
          <div class="int-name">Webhooks</div>
          <div class="int-category">Developer</div>
        </div>
        <div class="int-desc">Real-time events: rent paid, application submitted, ticket opened, lease signed. Signed payloads, retries, dead-letter queue.</div>
        <div class="int-foot"><strong>Scale+</strong><span>Configure in Settings</span></div>
      </div>

      <div class="int-card" data-cat="dev">
        <div class="int-head">
          <div class="int-logo zapier">ZP</div>
          <span class="int-status soon">Coming Q3</span>
        </div>
        <div>
          <div class="int-name">Zapier</div>
          <div class="int-category">No-code automation</div>
        </div>
        <div class="int-desc">Public Zapier app in build. Connect Tenantory triggers to 5,000+ apps for custom workflows.</div>
        <div class="int-foot"><strong>Pro+</strong><span>In beta</span></div>
      </div>

    </div>
  </section>

  <!-- Featured deep-dive -->
  <section class="featured-wrap">
    <div class="section-head">
      <div class="section-kicker">Pre-wired</div>
      <h2>The four your tenants touch every month.</h2>
      <p>These are the integrations that make the product work. They're not optional toggles — they're invisibly part of every flow.</p>
    </div>
    <div class="deep-grid">
      <div class="deep">
        <div class="deep-head">
          <div class="int-logo stripe">S</div>
          <div class="deep-head-text"><div class="deep-title">Stripe</div><div class="deep-meta">Payments · Starter+</div></div>
        </div>
        <div class="deep-body">Every rent payment, deposit, application fee, and refund flows through Stripe. Money goes to <strong>your</strong> Stripe account — Tenantory never holds your funds.</div>
        <ul class="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>PCI DSS Level 1 compliance inherited</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>1099-K issued directly by Stripe</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Instant refunds, dispute handling</li>
        </ul>
      </div>
      <div class="deep">
        <div class="deep-head">
          <div class="int-logo plaid">P</div>
          <div class="deep-head-text"><div class="deep-title">Plaid</div><div class="deep-meta">Bank linking · Starter+</div></div>
        </div>
        <div class="deep-body">Tenants link their checking account once during onboarding. Autopay works immediately — no micro-deposit verification wait, no manual account entry.</div>
        <ul class="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>12,000+ banks supported</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Account ownership + balance verification</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tenant credentials never touch Tenantory</li>
        </ul>
      </div>
      <div class="deep">
        <div class="deep-head">
          <div class="int-logo transunion">TU</div>
          <div class="deep-head-text"><div class="deep-title">TransUnion SmartMove</div><div class="deep-meta">Screening · Pro+</div></div>
        </div>
        <div class="deep-body">Applicants authorize the check inside the application. You get a credit report, criminal record, and eviction history inside 10 minutes — without the FCRA landmines.</div>
        <ul class="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Applicant pays, not you (in $45 fee)</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Auto adverse-action letter if declined</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>FCRA-compliant, no DIY liability</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Developer section -->
  <section class="dev-wrap">
    <div class="dev-card">
      <div>
        <div class="dev-label">On Scale &amp; Enterprise</div>
        <h2>Build anything on top.</h2>
        <p>Full REST API, signed webhooks, and a Zapier app in beta. Build custom reports, sync to your accountant's system, wire in your smart locks, whatever.</p>
        <ul class="dev-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Workspace-scoped bearer tokens</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Webhook retries with exponential backoff</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>OpenAPI 3.1 spec · auto-generated clients</li>
        </ul>
      </div>
      <pre class="dev-code"><span class="c"># List active tenants in your workspace</span>
<span class="k">curl</span> https://api.tenantory.com/v1/tenants \\
  -H <span class="s">"Authorization: Bearer $TENANTORY_KEY"</span> \\
  -H <span class="s">"X-Workspace-Id: ws_01HXK2..."</span>

<span class="c"># Subscribe to rent-paid events</span>
<span class="k">POST</span> /v1/webhooks
{
  <span class="s">"url"</span>: <span class="s">"https://your-app/hooks"</span>,
  <span class="s">"events"</span>: [<span class="s">"rent.paid"</span>, <span class="s">"lease.signed"</span>]
}</pre>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq-wrap">
    <div class="section-head">
      <div class="section-kicker">Questions</div>
      <h2>The ones sales reps hear weekly.</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q">Do I have to set any of this up? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">For Starter and Pro: no. Stripe, Plaid, Clerk, Resend, Twilio, TransUnion, Google Calendar, RentCast — all wired by default when you sign up. SSO and custom domains need a one-time 5-minute setup.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can my tenants tell which tools you're using? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">No. Every tenant-facing surface is branded with YOUR workspace name and colors. Email comes from your domain. The Stripe checkout says your business name. Plaid is the one exception — when tenants link a bank, they see a Plaid screen briefly, but it's standard enough that most don't notice.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What happens if Stripe goes down? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Rent collection pauses until Stripe is back (historically: 3–4 short outages a year, typically under 30 minutes). Tenants see a graceful retry screen. Nothing else breaks — they can still see leases, submit maintenance, download documents.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Can I bring my own Stripe account? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Yes — and you should. You'll be asked during onboarding to connect your existing Stripe account or create a new one. Money flows to YOUR Stripe, not Tenantory's. We never touch your funds.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">What's the difference between an integration and the core product? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Short answer: nothing you'd notice. We use "integration" internally for things that live outside Tenantory's servers (Stripe, Plaid, etc.). For you, it's all one product. Clerk, Resend, Twilio, RentCast — you'd never know they exist if we didn't tell you.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Do you support QuickBooks sync? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">We support a clean export, not live sync. Most PMs who try live sync abandon it within 2 months because of category mismatches. Our export is formatted for QuickBooks' import with your chart-of-accounts mapped once during onboarding. Run it monthly, done in 30 seconds.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Missing something you need? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <div class="faq-a">Email <code style="font-size:12px;background:var(--surface-subtle);padding:1px 6px;border-radius:4px;">integrations@tenantory.com</code> and tell us what you're trying to connect. We prioritize by request volume — if 5 PMs ask for the same integration, it gets on the Q-next roadmap.</div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-bottom">
    <div class="cta-card">
      <h2>Everything already connects. Start the trial.</h2>
      <p>No wizard. No "connect your accounts." Sign up, import your tenants, start collecting rent — all 21 integrations already humming.</p>
      <div class="cta-actions">
        <a class="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
    </div>
  </section>

  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
      <a href="integrations.html">Integrations</a>
      <a href="security.html">Security</a>
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
