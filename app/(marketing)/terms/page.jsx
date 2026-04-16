"use client";

// Mock ported from ~/Desktop/blackbear/terms.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 72px 32px 40px;\n      background: linear-gradient(180deg, var(--blue-softer) 0%, var(--surface) 100%);\n      border-bottom: 1px solid var(--border);\n    }\n    .hero-inner { max-width: 1100px; margin: 0 auto; text-align: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 52px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      margin-bottom: 18px;\n    }\n    .hero-sub { font-size: 17px; color: var(--text-muted); max-width: 620px; margin: 0 auto 22px; line-height: 1.55; }\n    .hero-meta { display: inline-flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }\n    .hero-pill {\n      display: inline-flex; align-items: center; gap: 7px;\n      padding: 8px 14px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; color: var(--text-muted); font-weight: 600;\n    }\n    .hero-pill svg { width: 14px; height: 14px; color: var(--blue); }\n    .hero-pill strong { color: var(--text); }\n    .hero-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 8px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 13px; font-weight: 700;\n      transition: all 0.15s ease;\n    }\n    .hero-link:hover { background: var(--pink-strong); }\n    .hero-link svg { width: 14px; height: 14px; }\n\n    /* ===== Layout ===== */\n    .shell { max-width: 1200px; margin: 0 auto; padding: 48px 32px 32px; }\n    .grid {\n      display: grid; grid-template-columns: 240px minmax(0, 1fr);\n      gap: 56px; align-items: start;\n    }\n\n    /* ===== TOC ===== */\n    .toc { position: sticky; top: 88px; }\n    .toc-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border);\n    }\n    .toc ol { list-style: none; counter-reset: toc; display: flex; flex-direction: column; gap: 2px; }\n    .toc li { counter-increment: toc; }\n    .toc a {\n      display: block; padding: 7px 10px; border-radius: 8px;\n      font-size: 13px; color: var(--text-muted); line-height: 1.4;\n      transition: all 0.12s ease;\n      border-left: 2px solid transparent;\n    }\n    .toc a::before { content: counter(toc) \". \"; color: var(--text-faint); font-variant-numeric: tabular-nums; }\n    .toc a:hover { color: var(--text); background: var(--surface-alt); }\n    .toc a.active { color: var(--blue); background: var(--blue-pale); border-left-color: var(--blue); font-weight: 600; }\n\n    /* ===== Body ===== */\n    .body { max-width: 80ch; }\n    .summary {\n      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius-lg); padding: 24px 28px;\n      margin-bottom: 48px;\n    }\n    .summary-kicker {\n      font-size: 11px; font-weight: 700; color: var(--blue); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\n    }\n    .summary-kicker svg { width: 14px; height: 14px; }\n    .summary h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; }\n    .summary ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }\n    .summary li {\n      display: flex; gap: 10px; align-items: flex-start;\n      font-size: 14.5px; color: var(--text); line-height: 1.55;\n    }\n    .summary li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;\n      color: var(--blue);\n    }\n\n    .sec { margin-bottom: 40px; scroll-margin-top: 88px; }\n    .sec h2 {\n      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;\n      margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: baseline; gap: 10px;\n    }\n    .sec h2 .num {\n      font-size: 13px; color: var(--text-faint); font-weight: 700;\n      font-variant-numeric: tabular-nums; letter-spacing: 0.04em;\n    }\n    .sec p { font-size: 15px; color: var(--text); line-height: 1.65; margin-bottom: 12px; }\n    .sec p:last-child { margin-bottom: 0; }\n    .sec strong { color: var(--text); font-weight: 700; }\n    .sec em { color: var(--text-muted); font-style: italic; }\n    .sec ul, .sec ol { margin: 8px 0 14px 22px; }\n    .sec li { font-size: 15px; color: var(--text); line-height: 1.65; margin-bottom: 6px; }\n    .sec a { color: var(--blue); font-weight: 600; }\n    .sec a:hover { text-decoration: underline; }\n\n    .callout {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-left: 3px solid var(--blue);\n      border-radius: var(--radius); padding: 16px 18px;\n      margin: 16px 0;\n    }\n    .callout p { font-size: 14px; color: var(--text-muted); margin: 0; }\n    .callout strong { color: var(--text); }\n\n    /* ===== Contact card ===== */\n    .contact {\n      margin-top: 48px;\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 32px 36px;\n      display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .contact::after {\n      content: \"\"; position: absolute; top: -80px; right: -80px;\n      width: 260px; height: 260px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .contact > * { position: relative; z-index: 1; }\n    .contact-icon {\n      width: 56px; height: 56px; border-radius: 16px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .contact-icon svg { width: 28px; height: 28px; }\n    .contact-title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }\n    .contact-sub { font-size: 14px; color: rgba(255,255,255,0.75); }\n    .contact .btn-pink { white-space: nowrap; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 980px) {\n      .grid { grid-template-columns: 1fr; gap: 28px; }\n      .toc { position: static; }\n      .toc ol { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }\n    }\n    @media (max-width: 680px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .shell { padding: 32px 20px 16px; }\n      .toc ol { grid-template-columns: 1fr; }\n      .contact { grid-template-columns: 1fr; text-align: center; padding: 28px 22px; }\n      .contact-icon { margin: 0 auto; }\n      .foot { padding: 32px 16px 24px; }\n    }\n  ";

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
      <a className="tb-nav-item" href="landing.html#faq">FAQ</a>
      <a className="tb-nav-item" href="portal.html" target="_blank">See the tenant view</a>
    </nav>
    <div className="tb-cta">
      <a className="btn btn-ghost btn-nav" href="onboarding.html">Sign in</a>
      <a className="btn btn-primary btn-nav" href="onboarding.html">Start free trial</a>
    </div>
  </header>

  
  <section className="hero">
    <div className="hero-inner">
      <div className="hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        Legal
      </div>
      <h1>Terms of Service</h1>
      <p className="hero-sub">These Terms govern your use of Black Bear Rentals. We wrote them to be as clear as a legal document reasonably can be, with a plain-English summary up top for the parts that matter most.</p>
      <div className="hero-meta">
        <span className="hero-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Last updated: <strong>April 14, 2026</strong>
        </span>
        <a className="hero-link" href="#summary">
          Plain-English summary available
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>
      </div>
    </div>
  </section>

  
  <div className="shell">
    <div className="grid">

      
      <aside className="toc">
        <div className="toc-label">Contents</div>
        <ol>
          <li><a href="#s1">Acceptance of Terms</a></li>
          <li><a href="#s2">Description of Service</a></li>
          <li><a href="#s3">Account Registration & Security</a></li>
          <li><a href="#s4">Subscription Plans & Billing</a></li>
          <li><a href="#s5">Founders' Cohort Terms</a></li>
          <li><a href="#s6">Time-Back Guarantee</a></li>
          <li><a href="#s7">Acceptable Use</a></li>
          <li><a href="#s8">User Content & IP</a></li>
          <li><a href="#s9">Third-Party Services</a></li>
          <li><a href="#s10">Payment Processing</a></li>
          <li><a href="#s11">Data & Privacy</a></li>
          <li><a href="#s12">Termination & Export</a></li>
          <li><a href="#s13">Disclaimer of Warranties</a></li>
          <li><a href="#s14">Limitation of Liability</a></li>
          <li><a href="#s15">Indemnification</a></li>
          <li><a href="#s16">Governing Law</a></li>
          <li><a href="#s17">Dispute Resolution</a></li>
          <li><a href="#s18">Modifications to Terms</a></li>
          <li><a href="#s19">Contact Information</a></li>
        </ol>
      </aside>

      
      <main className="body">

        
        <section className="summary" id="summary">
          <div className="summary-kicker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
            Plain-English summary
          </div>
          <h2>What these Terms actually say</h2>
          <ul>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Black Bear Rentals is software. You pay a monthly fee; we give you access, keep your data isolated, and never sell it.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Plans are month-to-month. Cancel anytime. The 14-day trial is free; after that you pay your plan's rate until you cancel.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              If you're a Founder on the Pro plan and stay continuously subscribed, your $99/month price is locked for as long as the plan exists.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              If Black Bear Rentals doesn't save you at least 10 hours in your first 30 paid days, we refund the month and pay you $100 on top. One request, one email.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Disputes go to arbitration in Madison County, Alabama. No class actions. Our total liability is capped at 12 months of fees you paid us.
            </li>
          </ul>
        </section>

        
        <section className="sec" id="s1">
          <h2><span className="num">01</span> Acceptance of Terms</h2>
          <p>Black Bear Rentals ("<strong>Black Bear Rentals</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") is operated by Black Bear Rentals, LLC, an Alabama limited liability company with its principal place of business in Huntsville, Alabama. These Terms of Service (the "<strong>Terms</strong>") form a binding agreement between you and Black Bear Rentals governing your access to and use of the Black Bear Rentals platform, website, mobile experiences, APIs, and related services (collectively, the "<strong>Service</strong>").</p>
          <p>By creating an account, clicking "I agree," or otherwise accessing or using the Service, you accept these Terms and our <a href="privacy.html">Privacy Policy</a>. If you are entering into these Terms on behalf of an organization, you represent that you have authority to bind that organization, and "you" refers to that organization.</p>
          <p>You must be at least 18 years old and legally capable of entering into a binding contract to use the Service. Black Bear Rentals is a business tool intended for property owners, property managers, and their authorized team members. It is not offered to minors or for personal, household, or consumer use.</p>
          <p>If you do not agree to these Terms, do not create an account and do not use the Service.</p>
        </section>

        
        <section className="sec" id="s2">
          <h2><span className="num">02</span> Description of Service</h2>
          <p>Black Bear Rentals is a cloud-based property management platform that helps operators list units, screen applicants, sign leases, collect rent, process maintenance requests, keep accounting records, and communicate with tenants and vendors. The Service is delivered as software-as-a-service and is hosted on infrastructure we control or license.</p>
          <p>Features, limits, and included integrations may change over time as we improve the Service. We may add, modify, or remove functionality at our discretion; where a change materially reduces the core functionality of a paid plan, we will provide reasonable notice and, if applicable, a prorated adjustment.</p>
          <p>The Service is a <em>tool</em>. Black Bear Rentals does not provide legal, financial, tax, or real-estate advice. We don't draft leases for your jurisdiction, we don't underwrite tenants, and we don't decide whether to rent to an applicant. You are solely responsible for compliance with the laws that apply to your rental business — including fair housing, landlord-tenant, security deposit, fair credit reporting, consumer notice, and tax laws.</p>
        </section>

        
        <section className="sec" id="s3">
          <h2><span className="num">03</span> Account Registration & Security</h2>
          <p>To use the Service, you must register for an account through our authentication provider. You agree to provide accurate, current, and complete information during registration and to keep that information up to date. Each paid subscription corresponds to a single workspace — a private, isolated environment that holds your properties, tenants, leases, payments, documents, and settings.</p>
          <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account, whether authorized by you or not. You agree to use strong, unique passwords and to enable multi-factor authentication when we offer it. You will notify us immediately at <a href="mailto:security@rentblackbear.com">security@rentblackbear.com</a> if you suspect unauthorized access to your account.</p>
          <p>You may invite team members to your workspace at roles defined within the product (for example, Admin, Manager, or Viewer). You are responsible for the conduct of anyone you invite, including revoking access when they leave your team. Sharing a single login across multiple people is prohibited — if you need more seats, add users.</p>
          <p>We may suspend or terminate accounts that show evidence of compromise, fraud, or violation of these Terms. We will try to notify you before doing so unless doing so would risk further harm.</p>
        </section>

        
        <section className="sec" id="s4">
          <h2><span className="num">04</span> Subscription Plans & Billing</h2>
          <p>Black Bear Rentals is offered on a subscription basis. Current published plans are: <strong>Starter</strong> at $39 per month, <strong>Pro</strong> at $99 per month, <strong>Scale</strong> at $299 per month, and <strong>Enterprise</strong> at custom pricing negotiated in a separate order form. Plan limits, included features, and overage rules are described on our <a href="pricing.html">Pricing page</a> and may be referenced within the product.</p>
          <p><strong>Free trial.</strong> New workspaces receive a 14-day free trial on the plan you select at signup. No payment method is required to start a trial. If you do not enter a payment method before the trial ends, your workspace transitions to a read-only state and, after 30 additional days, is scheduled for deletion in accordance with our retention policy.</p>
          <p><strong>Billing & auto-renewal.</strong> Monthly plans renew on the same calendar day each month; annual plans renew on the same day each year. Your payment method is charged automatically at the start of each billing period. All fees are quoted in U.S. Dollars and exclude applicable taxes. You authorize us and our payment processor (Stripe) to charge your chosen payment method for each recurring charge.</p>
          <p><strong>Cancellation.</strong> You may cancel at any time from within the product. Cancellations take effect at the end of the current billing period; we do not prorate partial-month cancellations on monthly plans. Annual plans may be canceled at any time but are not refundable on a pro-rata basis except where required by law or under the Time-Back Guarantee described below.</p>
          <p><strong>Failed payments.</strong> If a charge fails, we will retry and notify you. After 14 days of continued failure, we may suspend billable features until the balance is paid. Accounts that remain past due for 30 days may be downgraded or canceled.</p>
          <p><strong>Price changes.</strong> We may change standard plan pricing for new and existing customers on at least 30 days' advance notice by email. Price changes never apply retroactively, and customers grandfathered into legacy pricing (including Founders, see Section 5) are protected as described in those sections.</p>
        </section>

        
        <section className="sec" id="s5">
          <h2><span className="num">05</span> Founders' Cohort Terms</h2>
          <p>The "<strong>Founders' Cohort</strong>" is a limited promotional program. Customers who subscribe to the <strong>Pro</strong> plan during the promotional window and are designated as Founders in our records receive a locked monthly rate of <strong>$99/month</strong> on the Pro plan for as long as the Pro plan exists and the customer remains continuously subscribed.</p>
          <p>The Founders' rate is subject to the following conditions:</p>
          <ul>
            <li>The rate applies only to the <strong>Pro</strong> tier. Upgrades to Scale or Enterprise are billed at then-current rates. Downgrades to Starter forfeit Founders' status.</li>
            <li>Continuous subscription is required. If your subscription lapses for any reason — non-payment, voluntary cancellation, or account closure — Founders' pricing is forfeited and cannot be reinstated, even on re-subscription.</li>
            <li>When we raise standard Pro pricing, Founders are <strong>grandfathered</strong> at $99/month. You will not be migrated to the new price unless you change plans.</li>
            <li>Founders' pricing is non-transferable. It applies to the workspace it was issued to and cannot be moved to a different workspace, company, or account holder.</li>
            <li>Taxes, payment processing fees, and any usage-based overages are billed separately at the then-current rates.</li>
          </ul>
          <p>We reserve the right to retire the Pro plan entirely. If we do, we will give Founders at least 90 days' notice and migrate them to the closest-equivalent successor plan at the most favorable available rate.</p>
        </section>

        
        <section className="sec" id="s6">
          <h2><span className="num">06</span> The Time-Back Guarantee</h2>
          <p>We offer a one-time money-back guarantee for new paying customers. You are eligible if, at the end of your first 30 paid days, the in-app "Time Saved" report shows that Black Bear Rentals has saved your workspace fewer than <strong>10 hours</strong> of work compared to its baseline estimate.</p>
          <p>To claim the guarantee, send a single email to <a href="mailto:guarantee@rentblackbear.com">guarantee@rentblackbear.com</a> within <strong>14 days</strong> of the end of your first 30 paid days that includes your workspace name and your in-app Time Saved report. We will:</p>
          <ol>
            <li>Refund any subscription fees you paid during those first 30 paid days to your original payment method; and</li>
            <li>Issue you an additional <strong>$100</strong> via refund check or ACH, typically within 10 business days of verification.</li>
          </ol>
          <p>The guarantee is limited to one claim per customer and per workspace. It does not cover: (a) third-party fees charged by Stripe, TransUnion, or other integrated providers; (b) accounts that did not configure core features (rent collection, lease creation, or maintenance) during the 30-day period; or (c) fraud, abuse, or obvious gaming of the Time Saved report. We reserve sole discretion to determine eligibility in good faith.</p>
          <div className="callout">
            <p><strong>In plain English:</strong> Use the product for a month. If it didn't save you 10 hours, we pay you to leave. One email, no forms, no hoops.</p>
          </div>
        </section>

        
        <section className="sec" id="s7">
          <h2><span className="num">07</span> Acceptable Use</h2>
          <p>You agree not to use the Service to do anything unlawful, harmful, or abusive. Without limiting the foregoing, you agree not to:</p>
          <ul>
            <li>Harass, threaten, discriminate against, or retaliate against any tenant, applicant, vendor, or Black Bear Rentals user, including conduct that violates fair housing or anti-discrimination laws;</li>
            <li>Use the Service to commit fraud, launder money, evade tax, or violate any other applicable law or regulation;</li>
            <li>Send unsolicited bulk communications (spam) to tenants, applicants, or third parties, or use Black Bear Rentals's messaging tools in violation of TCPA, CAN-SPAM, or similar laws;</li>
            <li>Circumvent, disable, probe, or interfere with any security feature, rate limit, usage quota, or access control;</li>
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service, except to the extent such restriction is prohibited by law;</li>
            <li>Scrape, data-mine, or copy any portion of the Service other than your own workspace data;</li>
            <li>Upload malware, viruses, or content that infringes someone else's intellectual property, privacy, or publicity rights;</li>
            <li>Resell, sublicense, or white-label the Service without a written agreement with us.</li>
          </ul>
          <p>Violation of this section is a material breach of these Terms and may result in immediate suspension or termination without refund.</p>
        </section>

        
        <section className="sec" id="s8">
          <h2><span className="num">08</span> User Content & Intellectual Property</h2>
          <p><strong>Your data is yours.</strong> As between you and Black Bear Rentals, you own all data, files, documents, images, and other content that you or your team members upload to the Service, including tenant personal information, lease documents, and accounting records ("<strong>Customer Content</strong>"). We do not claim any ownership interest in Customer Content.</p>
          <p><strong>Limited license to us.</strong> You grant Black Bear Rentals a worldwide, non-exclusive, royalty-free license to host, copy, transmit, display, and process Customer Content solely as necessary to provide the Service to you, to secure it, to back it up, to prevent fraud and abuse, and to comply with law. This license exists only for the duration of your subscription plus the limited retention windows described in our Privacy Policy.</p>
          <p><strong>No AI training without consent.</strong> We do not use Customer Content to train general-purpose AI models. Where AI features operate on your data (for example, document summarization or maintenance triage), processing is scoped to your workspace, results are returned only to you, and inputs are not retained for cross-customer model improvement.</p>
          <p><strong>Black Bear Rentals's IP.</strong> The Service itself — including the software, user interface, designs, logos, documentation, and all underlying technology — is owned by Black Bear Rentals and is protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service during your subscription, subject to these Terms. All rights not expressly granted are reserved.</p>
          <p><strong>Feedback.</strong> If you send us suggestions, feature requests, or other feedback, you grant us an irrevocable, perpetual, royalty-free license to use that feedback to improve the Service without obligation to you.</p>
        </section>

        
        <section className="sec" id="s9">
          <h2><span className="num">09</span> Third-Party Services</h2>
          <p>The Service integrates with third-party providers to deliver certain functionality. These providers have their own terms and privacy policies, which govern your use of their services when accessed through Black Bear Rentals:</p>
          <ul>
            <li><strong>Stripe, Inc.</strong> — payment processing and connected accounts for rent collection;</li>
            <li><strong>Plaid Inc.</strong> — bank account verification and ACH authorization;</li>
            <li><strong>TransUnion Rental Screening Solutions</strong> — applicant credit, criminal, and eviction reports;</li>
            <li><strong>Clerk, Inc.</strong> — user authentication and session management;</li>
            <li>and other providers listed in our <a href="privacy.html#s4">Privacy Policy</a>.</li>
          </ul>
          <p>You are responsible for reviewing and agreeing to the terms of any third-party provider whose service you elect to use through Black Bear Rentals, including by accepting electronic terms during onboarding. Black Bear Rentals is not responsible for the availability, accuracy, legality, or conduct of third-party services, and we disclaim liability arising from them to the fullest extent permitted by law.</p>
          <p>If a third-party provider terminates our integration or ceases operation, we will notify you and, where practical, provide an alternative. Some integrations may require you to maintain a direct account with the provider.</p>
        </section>

        
        <section className="sec" id="s10">
          <h2><span className="num">10</span> Payment Processing</h2>
          <p>Rent collection and other money movement features are powered by Stripe, Inc. When you enable rent collection, you are prompted to create and connect a Stripe Connect account and to accept Stripe's <a href="https://stripe.com/legal/connect-account" target="_blank" rel="noopener">Connected Account Agreement</a> and <a href="https://stripe.com/legal" target="_blank" rel="noopener">Services Agreement</a>. Your ability to accept payments depends on Stripe's ongoing approval, KYC verification, and underwriting decisions — Black Bear Rentals is not a party to those decisions.</p>
          <p>You are the merchant of record for all payments collected from your tenants. You are responsible for: (a) resolving chargebacks, disputes, and refund requests initiated by your tenants; (b) reporting and remitting any applicable taxes on amounts collected; (c) maintaining any licenses or registrations required to collect rent in your jurisdiction; and (d) complying with the Stripe Restricted Businesses list.</p>
          <p>Black Bear Rentals may charge platform or processing fees in addition to Stripe's fees. Our fees are disclosed on the Pricing page or in your order form. Payouts to your bank account are made on Stripe's standard schedule unless otherwise agreed in writing.</p>
        </section>

        
        <section className="sec" id="s11">
          <h2><span className="num">11</span> Data & Privacy</h2>
          <p>Our collection, use, storage, and disclosure of personal information is described in our <a href="privacy.html">Privacy Policy</a>, which is incorporated into these Terms by reference. By using the Service you acknowledge that policy and the data processing it describes.</p>
          <p>Where you upload personal information about tenants, applicants, vendors, or other third parties, you represent and warrant that you have the legal right to do so and to permit Black Bear Rentals to process that information on your behalf. You are the data controller and Black Bear Rentals is the data processor with respect to such information, as those terms are used in applicable privacy laws.</p>
          <p>If you are subject to the GDPR, UK GDPR, CCPA/CPRA, or other jurisdictional requirements that demand a separate data processing agreement (DPA), you may request our standard DPA at <a href="mailto:privacy@rentblackbear.com">privacy@rentblackbear.com</a>. Our standard DPA, once executed, supplements and (where inconsistent) controls over these Terms with respect to personal data.</p>
        </section>

        
        <section className="sec" id="s12">
          <h2><span className="num">12</span> Termination and Data Export</h2>
          <p>You may cancel your subscription at any time from within the product. We may suspend or terminate your access for material breach of these Terms, fraud or abuse, non-payment lasting more than 30 days, or where required by law or to protect the safety of other users.</p>
          <p><strong>Data export.</strong> For 30 days following cancellation or termination, we will preserve your workspace in a read-only state and allow you to export your data through the in-product export tools or, where that isn't sufficient, by written request to <a href="mailto:support@rentblackbear.com">support@rentblackbear.com</a>. Exports include tenant records, lease documents, transaction history, and financial ledgers in standard formats (CSV, PDF, and JSON where applicable).</p>
          <p><strong>Deletion.</strong> After the 30-day export window closes, active Customer Content is deleted from our production systems. Encrypted, access-controlled backups containing your data age out according to the schedule described in our Privacy Policy (typically within 90 days). Certain records — including financial transactions and audit logs — may be retained longer where required by law.</p>
          <p>Sections that by their nature should survive termination (including Sections 8, 13, 14, 15, 16, 17, and 19) survive any termination of these Terms.</p>
        </section>

        
        <section className="sec" id="s13">
          <h2><span className="num">13</span> Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, BLACK BEAR RENTALS AND ITS LICENSORS DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT.</p>
          <p>We do not warrant that the Service will be uninterrupted, error-free, secure against every threat, compatible with every device, or that any data processed by the Service will be accurate or preserved without loss. We do not warrant that the Service, its AI features, or any document template will satisfy legal requirements in your jurisdiction or produce any particular business outcome.</p>
          <p>Some jurisdictions do not allow the exclusion of certain warranties. In those jurisdictions, the exclusions above apply only to the extent permitted by law.</p>
        </section>

        
        <section className="sec" id="s14">
          <h2><span className="num">14</span> Limitation of Liability</h2>
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER BLACK BEAR RENTALS NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF GOODWILL, LOSS OF DATA, BUSINESS INTERRUPTION, OR THE COST OF SUBSTITUTE SERVICES, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE, WHETHER IN CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          <p>OUR AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE, FROM ALL CAUSES OF ACTION AND UNDER ALL THEORIES OF LIABILITY, WILL NOT EXCEED THE TOTAL AMOUNT OF FEES YOU PAID TO BLACK BEAR RENTALS IN THE <strong>TWELVE (12) MONTHS</strong> IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>
          <p>These limitations apply whether or not Black Bear Rentals has been advised of the possibility of such damages and even if a remedy fails of its essential purpose. The parties agree that these limitations are a material basis of the bargain between them and that without them the fees would be materially higher.</p>
        </section>

        
        <section className="sec" id="s15">
          <h2><span className="num">15</span> Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Black Bear Rentals, its affiliates, and their respective officers, directors, employees, and agents from and against any third-party claims, damages, liabilities, losses, costs, and reasonable attorneys' fees arising out of or related to: (a) your Customer Content; (b) your use of the Service in violation of these Terms or applicable law; (c) your violation of the rights of a tenant, applicant, vendor, or other third party, including fair-housing and landlord-tenant laws; or (d) any taxes or fees for which you are responsible.</p>
          <p>Black Bear Rentals will promptly notify you of any claim for which we seek indemnification and will reasonably cooperate with you in the defense. You may not settle any claim that admits liability on our part or imposes any obligation on us without our prior written consent.</p>
        </section>

        
        <section className="sec" id="s16">
          <h2><span className="num">16</span> Governing Law</h2>
          <p>These Terms are governed by the laws of the <strong>State of Alabama</strong>, without regard to its conflict-of-laws rules. Subject to Section 17 (Dispute Resolution), any judicial proceeding relating to these Terms that is not subject to arbitration must be brought exclusively in the state or federal courts located in <strong>Madison County, Alabama</strong>, and each party consents to the personal jurisdiction and venue of those courts.</p>
          <p>The United Nations Convention on Contracts for the International Sale of Goods does not apply to these Terms.</p>
        </section>

        
        <section className="sec" id="s17">
          <h2><span className="num">17</span> Dispute Resolution; Arbitration; Class-Action Waiver</h2>
          <p><strong>Informal resolution.</strong> Before initiating arbitration or any legal proceeding, you agree to contact us at <a href="mailto:legal@rentblackbear.com">legal@rentblackbear.com</a> with a written description of the dispute, the relief you seek, and your contact information. The parties will attempt in good faith to resolve the dispute informally within 60 days.</p>
          <p><strong>Binding arbitration.</strong> If the parties cannot resolve the dispute informally, <strong>any dispute, claim, or controversy arising out of or relating to these Terms or the Service will be resolved by final and binding arbitration</strong> administered by JAMS under its Comprehensive Arbitration Rules & Procedures then in effect. The arbitration will be conducted by a single arbitrator in Madison County, Alabama, or by videoconference at the parties' election. The arbitrator's decision will be final and enforceable in any court of competent jurisdiction.</p>
          <p><strong>Class-action waiver.</strong> You and Black Bear Rentals each agree that any dispute will be resolved only on an individual basis and <strong>not as a plaintiff or class member in any purported class, collective, consolidated, or representative proceeding</strong>. The arbitrator may not consolidate more than one party's claims and may not preside over any form of representative or class proceeding. If this waiver is found to be unenforceable, then the entirety of this Section 17 is null and void, and the dispute will proceed in court under Section 16.</p>
          <p><strong>Exceptions.</strong> Either party may bring an individual action in small-claims court, and either party may seek injunctive or other equitable relief in court for claims relating to intellectual property, unauthorized access, or confidentiality.</p>
          <p><strong>30-day opt-out.</strong> You may opt out of this arbitration agreement by sending written notice to <a href="mailto:legal@rentblackbear.com">legal@rentblackbear.com</a> within 30 days of first accepting these Terms. Opting out does not affect any other part of these Terms.</p>
        </section>

        
        <section className="sec" id="s18">
          <h2><span className="num">18</span> Modifications to Terms</h2>
          <p>We may update these Terms from time to time. When we make a material change, we will post the updated Terms at this URL, update the "Last updated" date at the top, and provide at least <strong>30 days' advance notice</strong> by email to the primary contact on your workspace before the change takes effect.</p>
          <p>If you do not agree to the updated Terms, you may cancel your subscription before the effective date without penalty and request a prorated refund of any prepaid fees covering the period after the effective date. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.</p>
          <p>Non-material changes — such as clarifications, typo fixes, and formatting — may be made without notice and take effect when posted.</p>
        </section>

        
        <section className="sec" id="s19">
          <h2><span className="num">19</span> Contact Information</h2>
          <p>For questions about these Terms, notices of material breach, or any other legal matter, contact us at:</p>
          <p><strong>Black Bear Rentals, LLC</strong><br />
          Attn: Legal<br />
          Huntsville, Alabama, USA<br />
          Email: <a href="mailto:legal@rentblackbear.com">legal@rentblackbear.com</a></p>
          <p>For product support, billing questions, and general help, contact <a href="mailto:hello@rentblackbear.com">hello@rentblackbear.com</a>. For security reports, contact <a href="mailto:security@rentblackbear.com">security@rentblackbear.com</a>.</p>
        </section>

        
        <div className="contact">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
          <div>
            <div className="contact-title">Questions about these Terms?</div>
            <div className="contact-sub">Reach our legal team directly. We reply within two business days.</div>
          </div>
          <a className="btn btn-pink" href="mailto:legal@rentblackbear.com">Email legal@rentblackbear.com</a>
        </div>

      </main>
    </div>
  </div>

  
  <footer className="foot">
    <div>&copy; 2026 Black Bear Rentals &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@rentblackbear.com">Support</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
