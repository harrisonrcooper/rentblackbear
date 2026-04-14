"use client";

// Mock ported from ~/Desktop/tenantory/privacy.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff; --blue-softer: #f1f5ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12); --pink-strong: rgba(255,73,152,0.22);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --gold: #f5a623; --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --red: #d64545;\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n      --shadow-lg: 0 16px 50px rgba(26,31,54,0.14);\n      --shadow-xl: 0 28px 80px rgba(26,31,54,0.2);\n    }\n\n    /* ===== Topbar ===== */\n    .topbar {\n      background: var(--surface); border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n      backdrop-filter: saturate(180%) blur(12px); background: rgba(255,255,255,0.88);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: linear-gradient(135deg, var(--blue-bright), var(--pink));\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; color: var(--text); letter-spacing: -0.02em; }\n    .tb-nav { display: flex; align-items: center; gap: 4px; }\n    .tb-nav-item {\n      padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; color: var(--text-muted);\n      transition: all 0.15s ease;\n    }\n    .tb-nav-item:hover { color: var(--text); background: var(--surface-alt); }\n    .tb-nav-item.active { color: var(--blue); }\n    .tb-cta { display: flex; gap: 10px; align-items: center; }\n\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; transition: all 0.15s ease; white-space: nowrap; }\n    .btn svg { width: 16px; height: 16px; }\n    .btn-primary { background: var(--blue); color: #fff; }\n    .btn-primary:hover { background: var(--navy); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(18,81,173,0.28); }\n    .btn-pink { background: var(--pink); color: #fff; }\n    .btn-pink:hover { background: #e63882; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,73,152,0.35); }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n    .btn-nav { padding: 9px 16px; font-size: 13px; }\n\n    /* ===== Hero ===== */\n    .hero {\n      padding: 72px 32px 40px;\n      background: linear-gradient(180deg, var(--blue-softer) 0%, var(--surface) 100%);\n      border-bottom: 1px solid var(--border);\n    }\n    .hero-inner { max-width: 1100px; margin: 0 auto; text-align: center; }\n    .hero-eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 6px 14px; border-radius: 100px;\n      background: var(--blue-pale); color: var(--blue);\n      font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;\n      margin-bottom: 18px;\n    }\n    .hero-eyebrow svg { width: 12px; height: 12px; }\n    .hero h1 {\n      font-size: clamp(36px, 5vw, 52px);\n      font-weight: 900; letter-spacing: -0.035em; line-height: 1.04;\n      margin-bottom: 18px;\n    }\n    .hero-sub { font-size: 17px; color: var(--text-muted); max-width: 620px; margin: 0 auto 22px; line-height: 1.55; }\n    .hero-meta { display: inline-flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }\n    .hero-pill {\n      display: inline-flex; align-items: center; gap: 7px;\n      padding: 8px 14px; border-radius: 100px;\n      background: var(--surface); border: 1px solid var(--border);\n      font-size: 13px; color: var(--text-muted); font-weight: 600;\n    }\n    .hero-pill svg { width: 14px; height: 14px; color: var(--blue); }\n    .hero-pill strong { color: var(--text); }\n    .hero-link {\n      display: inline-flex; align-items: center; gap: 6px;\n      padding: 8px 14px; border-radius: 100px;\n      background: var(--pink-bg); color: #c21a6a;\n      font-size: 13px; font-weight: 700;\n      transition: all 0.15s ease;\n    }\n    .hero-link:hover { background: var(--pink-strong); }\n    .hero-link svg { width: 14px; height: 14px; }\n\n    /* ===== Layout ===== */\n    .shell { max-width: 1200px; margin: 0 auto; padding: 48px 32px 32px; }\n    .grid {\n      display: grid; grid-template-columns: 240px minmax(0, 1fr);\n      gap: 56px; align-items: start;\n    }\n\n    /* ===== TOC ===== */\n    .toc { position: sticky; top: 88px; }\n    .toc-label {\n      font-size: 11px; font-weight: 700; color: var(--text-faint); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border);\n    }\n    .toc ol { list-style: none; counter-reset: toc; display: flex; flex-direction: column; gap: 2px; }\n    .toc li { counter-increment: toc; }\n    .toc a {\n      display: block; padding: 7px 10px; border-radius: 8px;\n      font-size: 13px; color: var(--text-muted); line-height: 1.4;\n      transition: all 0.12s ease;\n      border-left: 2px solid transparent;\n    }\n    .toc a::before { content: counter(toc) \". \"; color: var(--text-faint); font-variant-numeric: tabular-nums; }\n    .toc a:hover { color: var(--text); background: var(--surface-alt); }\n    .toc a.active { color: var(--blue); background: var(--blue-pale); border-left-color: var(--blue); font-weight: 600; }\n\n    /* ===== Body ===== */\n    .body { max-width: 80ch; }\n    .summary {\n      background: linear-gradient(135deg, var(--blue-softer), var(--blue-pale));\n      border: 1px solid var(--blue-pale);\n      border-radius: var(--radius-lg); padding: 24px 28px;\n      margin-bottom: 48px;\n    }\n    .summary-kicker {\n      font-size: 11px; font-weight: 700; color: var(--blue); letter-spacing: 0.14em; text-transform: uppercase;\n      margin-bottom: 8px; display: flex; align-items: center; gap: 8px;\n    }\n    .summary-kicker svg { width: 14px; height: 14px; }\n    .summary h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; }\n    .summary ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }\n    .summary li {\n      display: flex; gap: 10px; align-items: flex-start;\n      font-size: 14.5px; color: var(--text); line-height: 1.55;\n    }\n    .summary li svg {\n      width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;\n      color: var(--blue);\n    }\n\n    .sec { margin-bottom: 40px; scroll-margin-top: 88px; }\n    .sec h2 {\n      font-size: 22px; font-weight: 800; letter-spacing: -0.02em;\n      margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border);\n      display: flex; align-items: baseline; gap: 10px;\n    }\n    .sec h2 .num {\n      font-size: 13px; color: var(--text-faint); font-weight: 700;\n      font-variant-numeric: tabular-nums; letter-spacing: 0.04em;\n    }\n    .sec p { font-size: 15px; color: var(--text); line-height: 1.65; margin-bottom: 12px; }\n    .sec p:last-child { margin-bottom: 0; }\n    .sec strong { color: var(--text); font-weight: 700; }\n    .sec em { color: var(--text-muted); font-style: italic; }\n    .sec ul, .sec ol { margin: 8px 0 14px 22px; }\n    .sec li { font-size: 15px; color: var(--text); line-height: 1.65; margin-bottom: 6px; }\n    .sec a { color: var(--blue); font-weight: 600; }\n    .sec a:hover { text-decoration: underline; }\n\n    .callout {\n      background: var(--surface-subtle); border: 1px solid var(--border);\n      border-left: 3px solid var(--blue);\n      border-radius: var(--radius); padding: 16px 18px;\n      margin: 16px 0;\n    }\n    .callout p { font-size: 14px; color: var(--text-muted); margin: 0; }\n    .callout strong { color: var(--text); }\n\n    /* Vendor table */\n    .vendor-table {\n      border: 1px solid var(--border); border-radius: var(--radius-lg);\n      overflow: hidden; margin: 16px 0 8px;\n    }\n    .vendor-row {\n      display: grid; grid-template-columns: 150px 1fr;\n      padding: 14px 18px; border-top: 1px solid var(--border);\n      gap: 16px;\n      font-size: 14px;\n    }\n    .vendor-row:first-child { border-top: none; background: var(--surface-subtle); }\n    .vendor-row dt { font-weight: 700; color: var(--text); }\n    .vendor-row dd { color: var(--text-muted); line-height: 1.55; }\n\n    /* ===== Contact card ===== */\n    .contact {\n      margin-top: 48px;\n      background: linear-gradient(135deg, var(--navy-dark), var(--navy-darker));\n      color: #fff; border-radius: var(--radius-xl); padding: 32px 36px;\n      display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center;\n      position: relative; overflow: hidden;\n    }\n    .contact::after {\n      content: \"\"; position: absolute; top: -80px; right: -80px;\n      width: 260px; height: 260px; border-radius: 50%;\n      background: radial-gradient(circle, var(--pink-bg), transparent 70%);\n    }\n    .contact > * { position: relative; z-index: 1; }\n    .contact-icon {\n      width: 56px; height: 56px; border-radius: 16px;\n      background: linear-gradient(135deg, var(--pink), #ff7bb4);\n      display: flex; align-items: center; justify-content: center; color: #fff;\n    }\n    .contact-icon svg { width: 28px; height: 28px; }\n    .contact-title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 4px; }\n    .contact-sub { font-size: 14px; color: rgba(255,255,255,0.75); }\n    .contact .btn-pink { white-space: nowrap; }\n\n    /* ===== Footer ===== */\n    .foot {\n      max-width: 1200px; margin: 64px auto 0; padding: 40px 32px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 20px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 980px) {\n      .grid { grid-template-columns: 1fr; gap: 28px; }\n      .toc { position: static; }\n      .toc ol { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }\n    }\n    @media (max-width: 680px) {\n      .topbar { padding: 12px 16px; }\n      .tb-nav { display: none; }\n      .hero { padding: 48px 20px 32px; }\n      .shell { padding: 32px 20px 16px; }\n      .toc ol { grid-template-columns: 1fr; }\n      .vendor-row { grid-template-columns: 1fr; gap: 4px; }\n      .contact { grid-template-columns: 1fr; text-align: center; padding: 28px 22px; }\n      .contact-icon { margin: 0 auto; }\n      .foot { padding: 32px 16px 24px; }\n    }\n  ";

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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        Privacy
      </div>
      <h1>Privacy Policy</h1>
      <p className="hero-sub">We built Tenantory to hold the most sensitive information a landlord owns: tenant PII, bank details, leases, and screening reports. This is exactly what we collect, why, and how it's protected.</p>
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
          <li><a href="#s1">Introduction</a></li>
          <li><a href="#s2">Information We Collect</a></li>
          <li><a href="#s3">How We Use Information</a></li>
          <li><a href="#s4">Data Sharing & Third Parties</a></li>
          <li><a href="#s5">Cookies & Tracking</a></li>
          <li><a href="#s6">Data Security</a></li>
          <li><a href="#s7">Data Retention</a></li>
          <li><a href="#s8">Your Rights</a></li>
          <li><a href="#s9">California Residents</a></li>
          <li><a href="#s10">EU/UK Residents</a></li>
          <li><a href="#s11">Children's Privacy</a></li>
          <li><a href="#s12">Changes to This Policy</a></li>
          <li><a href="#s13">Contact Information</a></li>
        </ol>
      </aside>

      
      <main className="body">

        
        <section className="summary" id="summary">
          <div className="summary-kicker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Plain-English summary
          </div>
          <h2>What this Privacy Policy says</h2>
          <ul>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              We collect what's needed to run the Service: your account info, the tenant data you enter, payment info through Stripe, and basic usage analytics.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <strong>We do not sell your data.</strong> We do not train general-purpose AI models on your Customer Content. We don't run third-party ad trackers.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Data is encrypted at rest and in transit. Each workspace is isolated at the database row level so no workspace can see another's data.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              You can access, correct, export, or delete your data at any time. We reply to requests within 30 days.
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              California (CCPA/CPRA) and EU/UK (GDPR) residents have extra rights — detailed below, with DPO and SCC information.
            </li>
          </ul>
        </section>

        
        <section className="sec" id="s1">
          <h2><span className="num">01</span> Introduction</h2>
          <p>This Privacy Policy describes how Tenantory, LLC ("<strong>Tenantory</strong>," "<strong>we</strong>," "<strong>us</strong>") collects, uses, discloses, and protects personal information when you use our website, product, and related services (the "<strong>Service</strong>"). It applies to property managers, landlords, and their team members who hold accounts with us (collectively, "<strong>Operators</strong>") as well as to tenants, applicants, and vendors whose information Operators enter into the Service.</p>
          <p>We are a business-to-business software provider. Most of the personal information in our systems is placed there by Operators about their tenants, applicants, and vendors. For that information, the Operator is the <strong>data controller</strong> and Tenantory is the <strong>data processor</strong>. For information we collect directly from Operators — such as Operator account details and our own marketing analytics — we are the data controller.</p>
          <p>This policy is part of our legal agreement with Operators and is incorporated into our <a href="terms.html">Terms of Service</a>. If you are a tenant, applicant, or vendor whose information appears in Tenantory through your landlord or property manager, please direct most requests to them — but we'll still help where we're required to under law (see Section 8).</p>
        </section>

        
        <section className="sec" id="s2">
          <h2><span className="num">02</span> Information We Collect</h2>
          <p>We collect the following categories of personal information. Not all categories apply to every user — only the data necessary for the features in use.</p>
          <p><strong>Account information.</strong> When an Operator signs up, we collect name, email, business or workspace name, phone number, role, and authentication credentials (managed by our auth provider). Team members are invited by email and have similar account fields.</p>
          <p><strong>Customer Content — tenant and applicant data.</strong> Operators enter information about their tenants, applicants, and guarantors into the Service. This may include names, email and phone, postal and rental addresses, date of birth, government identifiers (where required for screening), lease terms, payment history, communication logs, uploaded documents (for example, IDs, pay stubs, or leases), and maintenance requests. We process this information on the Operator's instructions.</p>
          <p><strong>Payment information.</strong> Rent payments and subscription billing are processed by Stripe, Inc. We receive payment <em>metadata</em> (amount, last four digits, payment status, card brand) but we do not store full card numbers, CVV codes, or bank credentials. Bank-account verification for ACH is handled via Plaid; we receive confirmation tokens, not usernames or passwords.</p>
          <p><strong>Screening data (optional).</strong> When an Operator runs a tenant screening, we pass the applicant's authorized information to TransUnion Rental Screening Solutions, and receive back credit, criminal-history, and eviction-history report fields. These reports are governed by the Fair Credit Reporting Act and are shown only to the Operator who requested them.</p>
          <p><strong>Usage and device information.</strong> When you use the Service, we automatically collect device type, browser type and version, operating system, IP address, referring URL, pages visited, timestamps, and interactions with product features. We use this information for security, debugging, and product analytics (see Section 5 on cookies).</p>
          <p><strong>Communications.</strong> Emails, in-app messages, and support conversations you send us or that are sent on your behalf through the Service (for example, tenant rent reminders). We process message content to deliver it and to prevent abuse.</p>
        </section>

        
        <section className="sec" id="s3">
          <h2><span className="num">03</span> How We Use Information</h2>
          <p>We use the personal information described above for the following purposes:</p>
          <ul>
            <li><strong>To operate the Service.</strong> Authenticate users, host workspaces, run rent collection and screening workflows, send transactional messages (password resets, payment receipts, rent reminders), and generate documents like leases and rent rolls.</li>
            <li><strong>To support and improve the product.</strong> Respond to your questions, investigate bugs, measure which features are used, and plan future features. Internal analytics are scoped to aggregate and pseudonymous signals where possible.</li>
            <li><strong>To secure the Service.</strong> Detect and prevent fraud, account takeover, abuse, and unauthorized access. We log security-relevant events and review them when alerts fire.</li>
            <li><strong>To comply with law.</strong> Respond to lawful requests from regulators and law enforcement, meet tax and financial record-keeping obligations (for example, Stripe and IRS rules), and enforce our <a href="terms.html">Terms of Service</a>.</li>
            <li><strong>To communicate with Operators.</strong> Send product updates, security bulletins, and — if you've opted in — marketing. You can opt out of marketing emails any time via the unsubscribe link; transactional and security emails cannot be unsubscribed while you hold an account.</li>
          </ul>
          <p><strong>No AI training without consent.</strong> We do not use Customer Content to train general-purpose AI models. Where AI features operate on your workspace data (for example, document summarization, message drafting, or maintenance triage), processing is scoped to your workspace, results are returned only to you, and inputs are not retained for cross-customer model improvement. If we ever offer an optional program that asks for consent to include anonymized data in model improvement, it will be clearly labeled and off by default.</p>
        </section>

        
        <section className="sec" id="s4">
          <h2><span className="num">04</span> Data Sharing & Third Parties</h2>
          <p>We share personal information only with trusted service providers who help us run the Service, and only for the purpose described. We have a written contract with each provider that requires them to protect the data and use it only on our instructions. We do not sell personal information, and we do not share it with data brokers.</p>
          <dl className="vendor-table">
            <div className="vendor-row"><dt>Provider</dt><dd>Purpose</dd></div>
            <div className="vendor-row"><dt>Stripe, Inc.</dt><dd>Subscription billing and tenant rent collection. Receives payment method data, transaction amounts, and customer identifiers.</dd></div>
            <div className="vendor-row"><dt>Plaid Inc.</dt><dd>Bank account verification and ACH authorization for tenants. Receives bank linkage tokens; Tenantory does not see bank credentials.</dd></div>
            <div className="vendor-row"><dt>TransUnion Rental Screening</dt><dd>Applicant credit, criminal, and eviction reports (where Operators enable screening). Receives applicant-authorized identifiers.</dd></div>
            <div className="vendor-row"><dt>Clerk, Inc.</dt><dd>User authentication, session management, and multi-factor authentication. Stores credentials and session tokens.</dd></div>
            <div className="vendor-row"><dt>Supabase, Inc.</dt><dd>Primary application database and file storage. Holds Customer Content encrypted at rest with row-level tenancy isolation.</dd></div>
            <div className="vendor-row"><dt>Resend, Inc.</dt><dd>Transactional email delivery (receipts, notices, invitations, password resets).</dd></div>
            <div className="vendor-row"><dt>Twilio, Inc.</dt><dd>SMS and voice delivery where enabled (for example, rent reminders and maintenance notifications to tenants).</dd></div>
            <div className="vendor-row"><dt>Vercel, Inc.</dt><dd>Application hosting, static asset delivery, and edge middleware. Processes HTTP request and response data.</dd></div>
            <div className="vendor-row"><dt>PostHog, Inc.</dt><dd>Product analytics and session-level debugging. Pseudonymous event data; no third-party ad tracking.</dd></div>
          </dl>
          <p>We may also disclose personal information: (a) in response to a valid legal process, such as a subpoena or court order; (b) to protect the rights, property, or safety of Tenantory, our users, or the public; (c) to a successor entity in connection with a merger, acquisition, reorganization, or sale of assets, subject to this Policy; and (d) with your consent.</p>
        </section>

        
        <section className="sec" id="s5">
          <h2><span className="num">05</span> Cookies & Tracking</h2>
          <p>We use a small number of cookies and similar technologies, all for functional or first-party analytics purposes.</p>
          <p><strong>Authentication cookies.</strong> Set by our auth provider to keep you logged in, protect against cross-site request forgery, and remember your workspace preference. These are strictly necessary and cannot be disabled without breaking sign-in.</p>
          <p><strong>First-party analytics.</strong> We use PostHog, a first-party analytics platform configured to self-host events through our domain. It records pseudonymous usage events (pages visited, buttons clicked, feature success rates) so we can find bugs and improve features. Analytics cookies never leave our infrastructure for advertising use.</p>
          <p><strong>What we don't do.</strong> We do not run third-party advertising trackers, pixels, or cross-site retargeting scripts on authenticated product pages. Our marketing site may include a small number of conversion-tracking pixels on the landing page; any such tracking is disclosed in our cookie banner (where required by law) with an opt-out.</p>
          <p>Most browsers allow you to block or delete cookies. Blocking strictly-necessary cookies will break core functionality (you won't be able to sign in).</p>
        </section>

        
        <section className="sec" id="s6">
          <h2><span className="num">06</span> Data Security</h2>
          <p>Security is a first-class engineering priority at Tenantory. Our full security program — including architecture diagrams, incident response procedures, and available audit artifacts — is documented on our <a href="security.html">Security page</a>.</p>
          <p><strong>Key controls include:</strong></p>
          <ul>
            <li><strong>Encryption in transit.</strong> All connections to and from the Service use TLS 1.2+ with modern cipher suites. HSTS is enabled on all production domains.</li>
            <li><strong>Encryption at rest.</strong> Databases, object storage, and backups are encrypted at rest using AES-256. Key management is delegated to our cloud providers and follows industry practice.</li>
            <li><strong>Workspace isolation.</strong> Every table that holds tenant data enforces row-level security keyed on the Operator's workspace. A query from one workspace physically cannot return another workspace's rows.</li>
            <li><strong>Payments.</strong> Card and bank credentials are handled by PCI-certified processors (Stripe, Plaid). Tenantory never stores full card numbers, CVV, or banking credentials.</li>
            <li><strong>Access control.</strong> Production access is limited to a small number of authorized engineers using single sign-on with enforced multi-factor authentication. All access is logged.</li>
            <li><strong>Monitoring & response.</strong> Security-relevant events are logged and alerted on. We maintain an incident response plan with defined notification timelines.</li>
          </ul>
          <p>No system is perfect. If you discover a vulnerability, please report it responsibly to <a href="mailto:security@tenantory.com">security@tenantory.com</a>. We credit researchers who give us a reasonable window to fix issues before public disclosure.</p>
        </section>

        
        <section className="sec" id="s7">
          <h2><span className="num">07</span> Data Retention</h2>
          <p>We keep personal information only as long as needed to provide the Service or to meet legal obligations. Retention windows vary by data type:</p>
          <ul>
            <li><strong>Active workspace data.</strong> Retained indefinitely for as long as the Operator's subscription is active. Operators may delete individual records at any time.</li>
            <li><strong>Post-cancellation export window.</strong> For <strong>30 days</strong> after cancellation or termination, the workspace is preserved in a read-only state so the Operator can export data. After the window closes, active Customer Content is deleted from production.</li>
            <li><strong>Encrypted backups.</strong> Our encrypted, access-controlled backups roll off on a rolling <strong>90-day</strong> retention. Data included in a canceled workspace disappears from backups as backups age out.</li>
            <li><strong>Financial records.</strong> Transaction records, invoices, payout logs, and related accounting data are retained for at least <strong>7 years</strong> to comply with IRS, state tax, and Stripe record-keeping requirements.</li>
            <li><strong>Security and audit logs.</strong> Retained for up to 2 years for fraud investigation and incident response, then deleted.</li>
            <li><strong>Marketing list data.</strong> Retained until you unsubscribe or request deletion, plus a short suppression-list retention to ensure we don't mistakenly re-contact you.</li>
          </ul>
          <p>Where you request deletion, we may retain a minimum set of fields needed to: (a) complete in-flight legal or financial obligations; (b) exercise or defend legal claims; or (c) comply with a regulator's retention requirement. We'll tell you when that applies.</p>
        </section>

        
        <section className="sec" id="s8">
          <h2><span className="num">08</span> Your Rights</h2>
          <p>Subject to local law, you have the following rights with respect to personal information we hold about you:</p>
          <ul>
            <li><strong>Right of access.</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Right to correction.</strong> Ask us to correct inaccurate or incomplete information.</li>
            <li><strong>Right to deletion.</strong> Ask us to delete your personal information, subject to the retention exceptions above.</li>
            <li><strong>Right to portability.</strong> Receive a machine-readable copy of your data and have it transmitted to another controller where technically feasible.</li>
            <li><strong>Right to object or restrict.</strong> Object to certain processing or ask us to restrict processing where the law gives you that right.</li>
            <li><strong>Right to withdraw consent.</strong> Where we rely on your consent, withdraw it at any time (without affecting prior processing).</li>
          </ul>
          <p>If you are an Operator, you can exercise most of these rights directly within the product. Otherwise, contact <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a>. We verify identity before acting on requests and respond within <strong>30 days</strong>, with a possible 30-day extension for complex requests. There is no fee unless the request is manifestly unfounded or excessive.</p>
          <p>If you believe we've mishandled your data, you can lodge a complaint with your local supervisory authority. We'd appreciate the chance to resolve it with you first at <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a>.</p>
        </section>

        
        <section className="sec" id="s9">
          <h2><span className="num">09</span> California Residents (CCPA / CPRA)</h2>
          <p>If you are a California resident, the California Consumer Privacy Act as amended by the California Privacy Rights Act ("<strong>CCPA</strong>") gives you additional rights with respect to your personal information:</p>
          <ul>
            <li><strong>Right to know</strong> the categories and specific pieces of personal information we have collected about you, the sources of that information, the business purpose, and the categories of third parties with whom we share it.</li>
            <li><strong>Right to delete</strong> personal information we've collected, subject to legal exceptions.</li>
            <li><strong>Right to correct</strong> inaccurate personal information.</li>
            <li><strong>Right to limit</strong> use of sensitive personal information to what's necessary to provide the Service.</li>
            <li><strong>Right to opt out of sale or sharing</strong> of personal information. <strong>Tenantory does not sell personal information, and we do not share it for cross-context behavioral advertising.</strong> There is nothing to opt out of.</li>
            <li><strong>Right to non-discrimination</strong> for exercising your privacy rights.</li>
          </ul>
          <p>To exercise your California rights, email <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a> with the subject line "CCPA Request." You may use an authorized agent; we'll need written proof of authorization. We will verify your identity using the information we already hold about you.</p>
        </section>

        
        <section className="sec" id="s10">
          <h2><span className="num">10</span> EU / UK Residents (GDPR)</h2>
          <p>If you are in the European Economic Area, the United Kingdom, or Switzerland, the General Data Protection Regulation and its UK equivalent ("<strong>GDPR</strong>") apply to our processing. The rights described in Section 8 are available to you, and we process data on the following lawful bases:</p>
          <ul>
            <li><strong>Contract.</strong> To provide the Service requested by an Operator and agreed to under our Terms of Service.</li>
            <li><strong>Legitimate interests.</strong> To secure the Service, prevent fraud, improve the product, and communicate about the Service — balanced against your rights and expectations.</li>
            <li><strong>Legal obligation.</strong> To comply with tax, financial, and other regulatory duties.</li>
            <li><strong>Consent.</strong> Where we rely on your consent (for example, optional marketing emails or optional AI improvement programs), you may withdraw it at any time.</li>
          </ul>
          <p><strong>International transfers.</strong> Tenantory's primary production infrastructure is located in the United States. When we transfer personal information from the EEA, UK, or Switzerland to the US or other third countries, we rely on the <strong>Standard Contractual Clauses</strong> approved by the European Commission (and the UK Addendum / Swiss amendments where applicable), combined with supplementary technical measures such as encryption and workspace isolation. You may request a copy of our SCCs at <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a>.</p>
          <p><strong>Data Protection Officer.</strong> Our privacy contact for GDPR matters is reachable at <a href="mailto:dpo@tenantory.com">dpo@tenantory.com</a>. We do not currently maintain an EU/UK representative; if this changes because of product expansion, we will update this Policy. You have the right to lodge a complaint with your local Data Protection Authority.</p>
        </section>

        
        <section className="sec" id="s11">
          <h2><span className="num">11</span> Children's Privacy</h2>
          <p>Tenantory is a business tool designed for adult property owners, property managers, and their authorized team members. The Service is not directed to, marketed to, or intended for individuals under the age of 18, and we do not knowingly collect personal information from children.</p>
          <p>If you believe that a child has provided personal information to us — for example, because a minor created an account or was listed as an occupant on a lease in a way that collects their direct information — please contact <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a> and we will delete it promptly.</p>
          <p>Operators are responsible for ensuring that any occupants or applicants they enter into the Service are of an appropriate age for the data they're uploading and for securing any parental consents required by law.</p>
        </section>

        
        <section className="sec" id="s12">
          <h2><span className="num">12</span> Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we make a material change, we will post the updated Policy at this URL, update the "Last updated" date at the top, and — if you are an Operator — provide at least <strong>30 days' advance notice</strong> by email to the primary contact on your workspace before the change takes effect.</p>
          <p>If you disagree with a material change, you may cancel your subscription and request deletion before the change takes effect. Continued use of the Service after the effective date constitutes acceptance of the updated Policy.</p>
          <p>Non-material changes — clarifications, typo fixes, and formatting — may be made without notice and take effect when posted.</p>
        </section>

        
        <section className="sec" id="s13">
          <h2><span className="num">13</span> Contact Information</h2>
          <p>For privacy questions, data subject requests, or a copy of our DPA or SCCs, contact:</p>
          <p><strong>Tenantory, LLC</strong><br />
          Attn: Privacy<br />
          Huntsville, Alabama, USA<br />
          Email: <a href="mailto:privacy@tenantory.com">privacy@tenantory.com</a><br />
          Data Protection contact: <a href="mailto:dpo@tenantory.com">dpo@tenantory.com</a><br />
          Security reports: <a href="mailto:security@tenantory.com">security@tenantory.com</a></p>
          <p>For product support and general help, contact <a href="mailto:hello@tenantory.com">hello@tenantory.com</a>. For legal matters including notices under our Terms of Service, contact <a href="mailto:legal@tenantory.com">legal@tenantory.com</a>.</p>
        </section>

        
        <div className="contact">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
          <div>
            <div className="contact-title">Questions about your data?</div>
            <div className="contact-sub">Ask our privacy team. We reply within two business days and handle formal requests within 30.</div>
          </div>
          <a className="btn btn-pink" href="mailto:legal@tenantory.com">Email legal@tenantory.com</a>
        </div>

      </main>
    </div>
  </div>

  
  <footer className="foot">
    <div>&copy; 2026 Tenantory &middot; Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="pricing.html">Pricing</a>
      <a href="mailto:hello@tenantory.com">Support</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </footer>

  

    </>
  );
}
