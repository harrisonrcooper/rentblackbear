"use client";

// Mock ported from ~/Desktop/tenantory/integrations.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f5f8ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545; --purple: #7c4dff;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n    }\n\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; color: #fff; }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }\n    .tb-nav { display: flex; gap: 4px; }\n    .tb-nav-item { padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted); transition: all 0.15s ease; }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n    .btn-lg { padding: 14px 28px; font-size: 15px; }\n\n    /* Hero */\n    .hero { padding: 72px 32px 36px; text-align: center; max-width: 880px; margin: 0 auto; }\n    .hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; background: var(--blue-pale); color: var(--blue); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 18px; }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 { font-size: clamp(36px, 5vw, 54px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; margin-bottom: 18px; }\n    .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n    .hero-sub { font-size: 18px; color: var(--text-muted); max-width: 640px; margin: 0 auto; line-height: 1.55; }\n\n    /* Filter tabs */\n    .filters { max-width: 1100px; margin: 40px auto 28px; padding: 0 32px; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }\n    .f-pill { padding: 8px 16px; border-radius: 100px; background: var(--surface); border: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--text-muted); transition: all 0.15s ease; }\n    .f-pill:hover { color: var(--text); border-color: var(--border-strong); }\n    .f-pill.active { background: var(--text); color: #fff; border-color: var(--text); }\n\n    /* Integration grid */\n    .grid-wrap { max-width: 1100px; margin: 0 auto; padding: 0 32px; }\n    .int-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }\n    .int-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 22px;\n      display: flex; flex-direction: column; gap: 12px;\n      transition: all 0.2s ease; position: relative;\n    }\n    .int-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--blue-pale); }\n    .int-card.featured { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue); }\n\n    .int-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }\n    .int-logo {\n      width: 44px; height: 44px; border-radius: 10px;\n      display: flex; align-items: center; justify-content: center; color: #fff;\n      font-weight: 800; font-size: 15px; letter-spacing: -0.02em; flex-shrink: 0;\n    }\n    .int-logo.stripe { background: linear-gradient(135deg, #635bff, #4a44d1); }\n    .int-logo.plaid { background: linear-gradient(135deg, #111, #444); }\n    .int-logo.transunion { background: linear-gradient(135deg, #0081c9, #00659c); }\n    .int-logo.qb { background: linear-gradient(135deg, #2ca01c, #1f7a14); }\n    .int-logo.resend { background: linear-gradient(135deg, #000, #333); }\n    .int-logo.twilio { background: linear-gradient(135deg, #f22f46, #c41c31); }\n    .int-logo.clerk { background: linear-gradient(135deg, #6c47ff, #4930cc); }\n    .int-logo.google { background: linear-gradient(135deg, #4285f4, #34a853); }\n    .int-logo.microsoft { background: linear-gradient(135deg, #0078d4, #005a9e); }\n    .int-logo.okta { background: linear-gradient(135deg, #007dc1, #005a8a); }\n    .int-logo.rentcast { background: linear-gradient(135deg, var(--gold), #c47913); }\n    .int-logo.zillow { background: linear-gradient(135deg, #006aff, #004fbf); }\n    .int-logo.slack { background: linear-gradient(135deg, #4a154b, #611f5f); }\n    .int-logo.zapier { background: linear-gradient(135deg, #ff4a00, #c93a00); }\n    .int-logo.api { background: linear-gradient(135deg, var(--navy), var(--navy-darker)); }\n    .int-logo.webhook { background: linear-gradient(135deg, var(--pink), #c21a6a); }\n    .int-logo.ical { background: linear-gradient(135deg, var(--purple), #5a36c2); }\n    .int-logo.google-cal { background: linear-gradient(135deg, #1a73e8, #0d58c0); }\n    .int-logo.august { background: linear-gradient(135deg, #d4281f, #a51c14); }\n    .int-logo.schlage { background: linear-gradient(135deg, #7c4dff, #5a36c2); }\n    .int-logo.mailchimp { background: linear-gradient(135deg, #ffe01b, #c4ac14); color: #222; }\n\n    .int-status {\n      font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 100px;\n      letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;\n    }\n    .int-status.live { background: var(--green-bg); color: var(--green-dark); }\n    .int-status.soon { background: var(--blue-pale); color: var(--blue); }\n    .int-status.scale { background: var(--pink-bg); color: #c21a6a; }\n\n    .int-name { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }\n    .int-category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }\n    .int-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; flex: 1; }\n    .int-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }\n    .int-foot strong { color: var(--text); font-weight: 700; }\n\n    /* Featured section */\n    .featured-wrap { max-width: 1100px; margin: 60px auto 0; padding: 0 32px; }\n    .section-head { text-align: center; margin-bottom: 36px; }\n    .section-kicker { font-size: 12px; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; }\n    .section-head h2 { font-size: clamp(26px, 3.2vw, 36px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .section-head p { font-size: 15px; color: var(--text-muted); max-width: 560px; margin: 0 auto; }\n\n    .deep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n    .deep {\n      background: linear-gradient(180deg, var(--surface) 0%, var(--surface-alt) 100%);\n      border: 1px solid var(--border); border-radius: var(--radius-xl);\n      padding: 26px; transition: all 0.2s ease;\n    }\n    .deep:hover { border-color: var(--blue); transform: translateY(-3px); box-shadow: var(--shadow); }\n    .deep-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }\n    .deep-head .int-logo { width: 48px; height: 48px; }\n    .deep-head-text { flex: 1; }\n    .deep-title { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }\n    .deep-meta { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }\n    .deep-body { font-size: 13.5px; color: var(--text); line-height: 1.6; margin-bottom: 14px; }\n    .deep-bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; }\n    .deep-bullets li { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n    .deep-bullets svg { width: 13px; height: 13px; color: var(--green-dark); flex-shrink: 0; margin-top: 2px; }\n\n    /* Developer block */\n    .dev-wrap { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .dev-card {\n      background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-darker) 100%);\n      color: #fff; border-radius: var(--radius-xl); padding: 40px;\n      display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .dev-card::after {\n      content: \"\"; position: absolute; top: -60px; right: -60px;\n      width: 280px; height: 280px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.3), transparent 70%);\n    }\n    .dev-label { font-size: 11px; font-weight: 700; color: var(--pink); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; position: relative; z-index: 1; }\n    .dev-card h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; position: relative; z-index: 1; }\n    .dev-card p { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.6; margin-bottom: 18px; position: relative; z-index: 1; }\n    .dev-bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; z-index: 1; }\n    .dev-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.85); }\n    .dev-bullets svg { width: 14px; height: 14px; color: var(--pink); flex-shrink: 0; margin-top: 3px; }\n    .dev-code {\n      background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.15);\n      border-radius: var(--radius); padding: 18px; overflow-x: auto;\n      font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;\n      color: rgba(255,255,255,0.9); position: relative; z-index: 1;\n    }\n    .dev-code .c { color: rgba(255,255,255,0.45); }\n    .dev-code .k { color: #ff8ac9; }\n    .dev-code .s { color: #b5e8b5; }\n    .dev-code .n { color: #ffc97d; }\n\n    /* FAQ */\n    .faq-wrap { max-width: 820px; margin: 80px auto 0; padding: 0 32px; }\n    .faq-list { display: flex; flex-direction: column; gap: 10px; }\n    .faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.15s ease; }\n    .faq-item.open { box-shadow: var(--shadow-sm); border-color: var(--border-strong); }\n    .faq-q { padding: 18px 22px; font-weight: 700; font-size: 15px; color: var(--text); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; width: 100%; text-align: left; }\n    .faq-q svg { width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease; flex-shrink: 0; }\n    .faq-item.open .faq-q svg { transform: rotate(45deg); color: var(--pink); }\n    .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; padding: 0 22px; color: var(--text-muted); font-size: 14px; line-height: 1.6; }\n    .faq-item.open .faq-a { max-height: 480px; padding: 0 22px 20px; }\n\n    /* CTA */\n    .cta-bottom { max-width: 1100px; margin: 80px auto 0; padding: 0 32px; }\n    .cta-card {\n      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-darker) 50%, var(--pink) 180%);\n      color: #fff; border-radius: var(--radius-xl); padding: 56px 48px;\n      text-align: center; position: relative; overflow: hidden;\n    }\n    .cta-card::before {\n      content: \"\"; position: absolute; top: -40%; left: -10%;\n      width: 400px; height: 400px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,73,152,0.4), transparent 70%);\n    }\n    .cta-card > * { position: relative; z-index: 1; }\n    .cta-card h2 { font-size: clamp(28px, 4vw, 38px); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 12px; }\n    .cta-card p { font-size: 16px; color: rgba(255,255,255,0.85); max-width: 560px; margin: 0 auto 28px; }\n    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }\n    .cta-card .btn-ghost { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }\n    .cta-card .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); color: #fff; }\n\n    /* Footer */\n    .foot {\n      max-width: 1100px; margin: 64px auto 0; padding: 36px 32px 28px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 18px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 880px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 28px; }\n      .filters, .grid-wrap, .featured-wrap, .dev-wrap, .faq-wrap, .cta-bottom { padding-left: 16px; padding-right: 16px; }\n      .int-grid, .deep-grid { grid-template-columns: 1fr; }\n      .dev-card { grid-template-columns: 1fr; padding: 28px; }\n      .cta-card { padding: 36px 22px; }\n    }\n  ";

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
      <a className="tb-nav-item" href="stories.html">Stories</a>
      <a className="tb-nav-item active" href="integrations.html">Integrations</a>
      <a className="tb-nav-item" href="security.html">Security</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-eyebrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      21 integrations · pre-wired on Pro · API access on Scale
    </div>
    <h1>Everything <em>already connects.</em></h1>
    <p className="hero-sub">We did the integration work so you don't have to. Your tenant pays rent through Stripe, your credit check runs through TransUnion, your lease gets e-signed natively — no Zapier middleware, no "connect your accounts" wizard.</p>
  </section>

  
  <div className="filters" id="filters">
    <button className="f-pill active" data-cat="all">All</button>
    <button className="f-pill" data-cat="payments">Payments</button>
    <button className="f-pill" data-cat="screening">Applicant screening</button>
    <button className="f-pill" data-cat="comms">Communications</button>
    <button className="f-pill" data-cat="auth">Auth &amp; identity</button>
    <button className="f-pill" data-cat="accounting">Accounting</button>
    <button className="f-pill" data-cat="calendar">Calendar</button>
    <button className="f-pill" data-cat="iot">Smart locks</button>
    <button className="f-pill" data-cat="data">Property data</button>
    <button className="f-pill" data-cat="dev">Developer</button>
  </div>

  
  <section className="grid-wrap">
    <div className="int-grid">

      <div className="int-card featured" data-cat="payments">
        <div className="int-head">
          <div className="int-logo stripe">S</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Stripe</div>
          <div className="int-category">Payments</div>
        </div>
        <div className="int-desc">All rent, deposits, and application fees. ACH free, cards 2.95%. Your tenants see your brand on the checkout, not Stripe's.</div>
        <div className="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div className="int-card featured" data-cat="payments">
        <div className="int-head">
          <div className="int-logo plaid">P</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Plaid</div>
          <div className="int-category">Bank connections</div>
        </div>
        <div className="int-desc">Tenants link their bank account once and autopay starts. Zero micro-deposit wait, no account numbers to type.</div>
        <div className="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div className="int-card featured" data-cat="screening">
        <div className="int-head">
          <div className="int-logo transunion">TU</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">TransUnion SmartMove</div>
          <div className="int-category">Credit &amp; background</div>
        </div>
        <div className="int-desc">Applicants authorize the check in the application form. You get credit report, criminal background, and eviction history in ~10 minutes. Fee passed through to applicant.</div>
        <div className="int-foot"><strong>Pro+</strong><span>Included in $45 app fee</span></div>
      </div>

      <div className="int-card" data-cat="comms">
        <div className="int-head">
          <div className="int-logo resend">R</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Resend</div>
          <div className="int-category">Email</div>
        </div>
        <div className="int-desc">Every transactional email — rent receipts, maintenance updates, lease PDFs. Sends from <code style={{fontSize: "11px", background: "var(--surface-subtle)", padding: "1px 5px", borderRadius: "3px"}}>noreply@yourname.tenantory.com</code> or your custom domain.</div>
        <div className="int-foot"><strong>Starter+</strong><span>No setup</span></div>
      </div>

      <div className="int-card" data-cat="comms">
        <div className="int-head">
          <div className="int-logo twilio">T</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Twilio</div>
          <div className="int-category">SMS</div>
        </div>
        <div className="int-desc">Rent reminders, late-rent nudges, maintenance updates sent as texts. Two-way threading — tenants reply, you see it in the portal.</div>
        <div className="int-foot"><strong>Starter+</strong><span>200/mo on Starter, 2k on Pro</span></div>
      </div>

      <div className="int-card featured" data-cat="auth">
        <div className="int-head">
          <div className="int-logo clerk">C</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Clerk</div>
          <div className="int-category">Authentication</div>
        </div>
        <div className="int-desc">All login, MFA, session management. Passwords never touch our servers. Social login included (Google, Apple, Microsoft).</div>
        <div className="int-foot"><strong>Starter+</strong><span>Invisible layer</span></div>
      </div>

      <div className="int-card" data-cat="auth">
        <div className="int-head">
          <div className="int-logo google">G</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Google Workspace SSO</div>
          <div className="int-category">Team login</div>
        </div>
        <div className="int-desc">Staff sign in with your company Google account. Provisioning optional via Clerk.</div>
        <div className="int-foot"><strong>Pro+</strong><span>5-min setup</span></div>
      </div>

      <div className="int-card" data-cat="auth">
        <div className="int-head">
          <div className="int-logo microsoft">M</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Microsoft Entra</div>
          <div className="int-category">Team SSO</div>
        </div>
        <div className="int-desc">For PMs running on the Microsoft stack. Azure AD / Entra ID sign-in.</div>
        <div className="int-foot"><strong>Pro+</strong><span>5-min setup</span></div>
      </div>

      <div className="int-card" data-cat="auth">
        <div className="int-head">
          <div className="int-logo okta">O</div>
          <span className="int-status scale">Scale+</span>
        </div>
        <div>
          <div className="int-name">Okta · SAML · SCIM</div>
          <div className="int-category">Enterprise SSO</div>
        </div>
        <div className="int-desc">Generic SAML 2.0 / OIDC for any identity provider. User provisioning via SCIM. Required for most enterprise buys.</div>
        <div className="int-foot"><strong>Scale+</strong><span>30-min setup</span></div>
      </div>

      <div className="int-card" data-cat="accounting">
        <div className="int-head">
          <div className="int-logo qb">QB</div>
          <span className="int-status live">Export</span>
        </div>
        <div>
          <div className="int-name">QuickBooks</div>
          <div className="int-category">Accounting export</div>
        </div>
        <div className="int-desc">Export your full ledger as a QuickBooks-ready IIF or CSV file. Syncs categories to your existing chart of accounts.</div>
        <div className="int-foot"><strong>Pro+</strong><span>No sync, clean export</span></div>
      </div>

      <div className="int-card" data-cat="accounting">
        <div className="int-head">
          <div className="int-logo" style={{background: "linear-gradient(135deg, #13b5ea, #0891b2)"}}>X</div>
          <span className="int-status live">Export</span>
        </div>
        <div>
          <div className="int-name">Xero</div>
          <div className="int-category">Accounting export</div>
        </div>
        <div className="int-desc">CSV export mapped to Xero's standard import format. Reconciles rent by property, expenses by vendor.</div>
        <div className="int-foot"><strong>Pro+</strong><span>No sync, clean export</span></div>
      </div>

      <div className="int-card" data-cat="calendar">
        <div className="int-head">
          <div className="int-logo google-cal">GC</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">Google Calendar</div>
          <div className="int-category">Calendar sync</div>
        </div>
        <div className="int-desc">Lease renewals, inspection dates, vendor visits — two-way sync with your Google Calendar. Your vendors get their own feed.</div>
        <div className="int-foot"><strong>Pro+</strong><span>One-click auth</span></div>
      </div>

      <div className="int-card" data-cat="calendar">
        <div className="int-head">
          <div className="int-logo ical">iC</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">iCal / Outlook</div>
          <div className="int-category">Calendar export</div>
        </div>
        <div className="int-desc">Subscribe to an always-current iCal feed from any calendar app (Apple Calendar, Outlook, Fantastical).</div>
        <div className="int-foot"><strong>Pro+</strong><span>Paste one URL</span></div>
      </div>

      <div className="int-card" data-cat="iot">
        <div className="int-head">
          <div className="int-logo august">A</div>
          <span className="int-status scale">Scale+</span>
        </div>
        <div>
          <div className="int-name">August Smart Locks</div>
          <div className="int-category">Access control</div>
        </div>
        <div className="int-desc">Generate a tenant lock code on lease sign, auto-revoke on move-out. Short-term guest codes for maintenance vendors.</div>
        <div className="int-foot"><strong>Scale+</strong><span>Per-property setup</span></div>
      </div>

      <div className="int-card" data-cat="iot">
        <div className="int-head">
          <div className="int-logo schlage">SC</div>
          <span className="int-status soon">Coming Q3</span>
        </div>
        <div>
          <div className="int-name">Schlage Encode</div>
          <div className="int-category">Access control</div>
        </div>
        <div className="int-desc">Keypad smart locks with tenant-scoped codes. Native integration planned for Q3 2026.</div>
        <div className="int-foot"><strong>Scale+</strong><span>In beta</span></div>
      </div>

      <div className="int-card" data-cat="data">
        <div className="int-head">
          <div className="int-logo rentcast">RC</div>
          <span className="int-status live">Built-in</span>
        </div>
        <div>
          <div className="int-name">RentCast</div>
          <div className="int-category">Market comps</div>
        </div>
        <div className="int-desc">Live rent comps for every property. See what similar units are renting for within 0.5 miles, right in your property detail.</div>
        <div className="int-foot"><strong>Pro+</strong><span>No setup</span></div>
      </div>

      <div className="int-card" data-cat="data">
        <div className="int-head">
          <div className="int-logo zillow">Z</div>
          <span className="int-status live">Push</span>
        </div>
        <div>
          <div className="int-name">Zillow · Apartments.com · Hotpads</div>
          <div className="int-category">Listing syndication</div>
        </div>
        <div className="int-desc">One click pushes your vacancy to all three. Leads land in your Applications kanban. Auto-pulls when the unit rents.</div>
        <div className="int-foot"><strong>Pro+</strong><span>No setup</span></div>
      </div>

      <div className="int-card" data-cat="comms">
        <div className="int-head">
          <div className="int-logo slack">SL</div>
          <span className="int-status soon">Coming Q2</span>
        </div>
        <div>
          <div className="int-name">Slack</div>
          <div className="int-category">Team alerts</div>
        </div>
        <div className="int-desc">Route urgent maintenance, late rent, and new applications to a Slack channel. Useful for 2+ person teams.</div>
        <div className="int-foot"><strong>Pro+</strong><span>In beta</span></div>
      </div>

      <div className="int-card" data-cat="dev">
        <div className="int-head">
          <div className="int-logo api">API</div>
          <span className="int-status scale">Scale+</span>
        </div>
        <div>
          <div className="int-name">REST API</div>
          <div className="int-category">Developer</div>
        </div>
        <div className="int-desc">Full read/write API scoped to your workspace. Fetch rent rolls, create tickets, manage tenants. Bearer-token auth, JSON everywhere.</div>
        <div className="int-foot"><strong>Scale+</strong><span>Docs at api.tenantory.com</span></div>
      </div>

      <div className="int-card" data-cat="dev">
        <div className="int-head">
          <div className="int-logo webhook">WH</div>
          <span className="int-status scale">Scale+</span>
        </div>
        <div>
          <div className="int-name">Webhooks</div>
          <div className="int-category">Developer</div>
        </div>
        <div className="int-desc">Real-time events: rent paid, application submitted, ticket opened, lease signed. Signed payloads, retries, dead-letter queue.</div>
        <div className="int-foot"><strong>Scale+</strong><span>Configure in Settings</span></div>
      </div>

      <div className="int-card" data-cat="dev">
        <div className="int-head">
          <div className="int-logo zapier">ZP</div>
          <span className="int-status soon">Coming Q3</span>
        </div>
        <div>
          <div className="int-name">Zapier</div>
          <div className="int-category">No-code automation</div>
        </div>
        <div className="int-desc">Public Zapier app in build. Connect Tenantory triggers to 5,000+ apps for custom workflows.</div>
        <div className="int-foot"><strong>Pro+</strong><span>In beta</span></div>
      </div>

    </div>
  </section>

  
  <section className="featured-wrap">
    <div className="section-head">
      <div className="section-kicker">Pre-wired</div>
      <h2>The four your tenants touch every month.</h2>
      <p>These are the integrations that make the product work. They're not optional toggles — they're invisibly part of every flow.</p>
    </div>
    <div className="deep-grid">
      <div className="deep">
        <div className="deep-head">
          <div className="int-logo stripe">S</div>
          <div className="deep-head-text"><div className="deep-title">Stripe</div><div className="deep-meta">Payments · Starter+</div></div>
        </div>
        <div className="deep-body">Every rent payment, deposit, application fee, and refund flows through Stripe. Money goes to <strong>your</strong> Stripe account — Tenantory never holds your funds.</div>
        <ul className="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>PCI DSS Level 1 compliance inherited</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>1099-K issued directly by Stripe</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Instant refunds, dispute handling</li>
        </ul>
      </div>
      <div className="deep">
        <div className="deep-head">
          <div className="int-logo plaid">P</div>
          <div className="deep-head-text"><div className="deep-title">Plaid</div><div className="deep-meta">Bank linking · Starter+</div></div>
        </div>
        <div className="deep-body">Tenants link their checking account once during onboarding. Autopay works immediately — no micro-deposit verification wait, no manual account entry.</div>
        <ul className="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>12,000+ banks supported</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Account ownership + balance verification</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Tenant credentials never touch Tenantory</li>
        </ul>
      </div>
      <div className="deep">
        <div className="deep-head">
          <div className="int-logo transunion">TU</div>
          <div className="deep-head-text"><div className="deep-title">TransUnion SmartMove</div><div className="deep-meta">Screening · Pro+</div></div>
        </div>
        <div className="deep-body">Applicants authorize the check inside the application. You get a credit report, criminal record, and eviction history inside 10 minutes — without the FCRA landmines.</div>
        <ul className="deep-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Applicant pays, not you (in $45 fee)</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Auto adverse-action letter if declined</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>FCRA-compliant, no DIY liability</li>
        </ul>
      </div>
    </div>
  </section>

  
  <section className="dev-wrap">
    <div className="dev-card">
      <div>
        <div className="dev-label">On Scale &amp; Enterprise</div>
        <h2>Build anything on top.</h2>
        <p>Full REST API, signed webhooks, and a Zapier app in beta. Build custom reports, sync to your accountant's system, wire in your smart locks, whatever.</p>
        <ul className="dev-bullets">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Workspace-scoped bearer tokens</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Webhook retries with exponential backoff</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>OpenAPI 3.1 spec · auto-generated clients</li>
        </ul>
      </div>
      <pre className="dev-code"><span className="c"># List active tenants in your workspace</span>
<span className="k">curl</span> https://api.tenantory.com/v1/tenants \
  -H <span className="s">"Authorization: Bearer $TENANTORY_KEY"</span> \
  -H <span className="s">"X-Workspace-Id: ws_01HXK2..."</span>

<span className="c"># Subscribe to rent-paid events</span>
<span className="k">POST</span> /v1/webhooks
&#123;
  <span className="s">"url"</span>: <span className="s">"https://your-app/hooks"</span>,
  <span className="s">"events"</span>: [<span className="s">"rent.paid"</span>, <span className="s">"lease.signed"</span>]
&#125;</pre>
    </div>
  </section>

  
  <section className="faq-wrap">
    <div className="section-head">
      <div className="section-kicker">Questions</div>
      <h2>The ones sales reps hear weekly.</h2>
    </div>
    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-q">Do I have to set any of this up? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">For Starter and Pro: no. Stripe, Plaid, Clerk, Resend, Twilio, TransUnion, Google Calendar, RentCast — all wired by default when you sign up. SSO and custom domains need a one-time 5-minute setup.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can my tenants tell which tools you're using? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">No. Every tenant-facing surface is branded with YOUR workspace name and colors. Email comes from your domain. The Stripe checkout says your business name. Plaid is the one exception — when tenants link a bank, they see a Plaid screen briefly, but it's standard enough that most don't notice.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What happens if Stripe goes down? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Rent collection pauses until Stripe is back (historically: 3–4 short outages a year, typically under 30 minutes). Tenants see a graceful retry screen. Nothing else breaks — they can still see leases, submit maintenance, download documents.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Can I bring my own Stripe account? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Yes — and you should. You'll be asked during onboarding to connect your existing Stripe account or create a new one. Money flows to YOUR Stripe, not Tenantory's. We never touch your funds.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">What's the difference between an integration and the core product? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Short answer: nothing you'd notice. We use "integration" internally for things that live outside Tenantory's servers (Stripe, Plaid, etc.). For you, it's all one product. Clerk, Resend, Twilio, RentCast — you'd never know they exist if we didn't tell you.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Do you support QuickBooks sync? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">We support a clean export, not live sync. Most PMs who try live sync abandon it within 2 months because of category mismatches. Our export is formatted for QuickBooks' import with your chart-of-accounts mapped once during onboarding. Run it monthly, done in 30 seconds.</div>
      </div>
      <div className="faq-item">
        <button className="faq-q">Missing something you need? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
        <div className="faq-a">Email <code style={{fontSize: "12px", background: "var(--surface-subtle)", padding: "1px 6px", borderRadius: "4px"}}>integrations@tenantory.com</code> and tell us what you're trying to connect. We prioritize by request volume — if 5 PMs ask for the same integration, it gets on the Q-next roadmap.</div>
      </div>
    </div>
  </section>

  
  <section className="cta-bottom">
    <div className="cta-card">
      <h2>Everything already connects. Start the trial.</h2>
      <p>No wizard. No "connect your accounts." Sign up, import your tenants, start collecting rent — all 21 integrations already humming.</p>
      <div className="cta-actions">
        <a className="btn btn-pink btn-lg" href="onboarding.html">
          Start free trial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
        <a className="btn btn-ghost btn-lg" href="pricing.html">See pricing</a>
      </div>
    </div>
  </section>

  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="stories.html">Stories</a>
      <a href="integrations.html">Integrations</a>
      <a href="security.html">Security</a>
    </div>
  </footer>

  

    </>
  );
}
