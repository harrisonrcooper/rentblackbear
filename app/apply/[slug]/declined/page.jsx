"use client";

// Mock ported from ~/Desktop/tenantory/tenant-declined.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --neutral: #7a8580;\n      --neutral-bg: #eeece4;\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 32px;\n      height: 72px;\n      display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 2px 0 rgba(0,0,0,0.04);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n      color: #fff;\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-support {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; border-radius: 100px;\n      background: rgba(255,255,255,0.08); color: #fff;\n      font-size: 12px; font-weight: 600;\n      transition: background 0.15s ease;\n    }\n    .tb-support:hover { background: rgba(255,255,255,0.16); }\n    .tb-support svg { width: 14px; height: 14px; }\n\n    /* Main */\n    .wrap { max-width: 720px; margin: 0 auto; padding: 48px 32px 32px; }\n\n    /* Hero */\n    .hero { text-align: center; margin-bottom: 36px; }\n    .icon-big {\n      width: 88px; height: 88px; border-radius: 20px;\n      background: var(--neutral-bg);\n      color: var(--neutral);\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 22px;\n      border: 1px solid var(--border);\n    }\n    .icon-big svg { width: 42px; height: 42px; }\n    .eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em;\n      text-transform: uppercase; color: var(--text-muted);\n      background: var(--neutral-bg); padding: 6px 12px;\n      border-radius: 100px; margin-bottom: 16px;\n    }\n    h1 {\n      font-size: 34px; font-weight: 800; letter-spacing: -0.025em;\n      line-height: 1.2; margin-bottom: 12px; color: var(--text);\n    }\n    .subhead {\n      font-size: 16px; color: var(--text-muted);\n      max-width: 520px; margin: 0 auto; line-height: 1.55;\n    }\n\n    /* Reason card */\n    .reason-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      padding: 26px 28px; border: 1px solid var(--border);\n      box-shadow: var(--shadow-sm);\n      margin-bottom: 24px;\n    }\n    .reason-label {\n      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;\n      text-transform: uppercase; color: var(--text-faint);\n      margin-bottom: 10px;\n    }\n    .reason-title {\n      font-size: 17px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em; margin-bottom: 10px;\n    }\n    .reason-body {\n      font-size: 14px; color: var(--text-muted); line-height: 1.65;\n    }\n\n    /* FCRA card */\n    .fcra {\n      background: var(--surface-subtle);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-lg);\n      padding: 22px 24px; margin-bottom: 32px;\n    }\n    .fcra-head {\n      display: flex; align-items: center; gap: 10px; margin-bottom: 12px;\n    }\n    .fcra-icon {\n      width: 28px; height: 28px; border-radius: 6px;\n      background: var(--accent-bg); color: var(--accent);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .fcra-icon svg { width: 14px; height: 14px; }\n    .fcra-title { font-size: 13px; font-weight: 700; color: var(--text); letter-spacing: -0.005em; }\n    .fcra-body {\n      font-size: 13px; color: var(--text-muted); line-height: 1.6;\n      margin-bottom: 14px;\n    }\n    .fcra-body strong { color: var(--text); font-weight: 600; }\n    .bureau {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px 16px;\n      font-size: 12px; color: var(--text); line-height: 1.6;\n    }\n    .bureau-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; }\n    .bureau-detail { color: var(--text-muted); }\n\n    /* Section heading */\n    .section-head {\n      font-size: 18px; font-weight: 800; letter-spacing: -0.015em;\n      margin-bottom: 16px; color: var(--text);\n    }\n\n    /* Action cards */\n    .actions { display: grid; gap: 12px; margin-bottom: 32px; }\n    .action {\n      display: grid; grid-template-columns: 44px 1fr 18px;\n      gap: 16px; align-items: center;\n      background: var(--surface); border-radius: var(--radius-lg);\n      padding: 18px 20px; border: 1px solid var(--border);\n      box-shadow: var(--shadow-sm);\n      transition: all 0.15s ease;\n    }\n    .action:hover {\n      border-color: var(--brand); transform: translateY(-1px);\n      box-shadow: var(--shadow);\n    }\n    .action-icon {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center;\n    }\n    .action-icon svg { width: 18px; height: 18px; }\n    .action-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 3px; }\n    .action-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }\n    .action-chev { color: var(--text-faint); }\n    .action-chev svg { width: 16px; height: 16px; }\n\n    /* Encouragement */\n    .encouragement {\n      background: var(--brand-pale);\n      border-radius: var(--radius-lg);\n      padding: 22px 24px; margin-bottom: 28px;\n      font-size: 14px; color: var(--text); line-height: 1.65;\n    }\n    .encouragement strong { color: var(--brand-dark); font-weight: 700; }\n\n    /* Note */\n    .note {\n      background: var(--surface-subtle);\n      border-left: 3px solid var(--neutral);\n      border-radius: var(--radius-lg);\n      padding: 20px 22px; margin-bottom: 28px;\n      box-shadow: var(--shadow-sm);\n    }\n    .note-from {\n      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\n    }\n    .note-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; font-weight: 700; font-size: 12px;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .note-name { font-weight: 700; font-size: 13px; color: var(--text); }\n    .note-role { font-size: 11px; color: var(--text-faint); }\n    .note-body { font-size: 14px; color: var(--text); line-height: 1.6; }\n\n    /* Contact card */\n    .contact {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 20px 22px;\n      display: grid; grid-template-columns: 1fr auto; gap: 16px;\n      align-items: center; margin-bottom: 20px;\n      box-shadow: var(--shadow-sm);\n    }\n    .contact-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 3px; }\n    .contact-sub { font-size: 12.5px; color: var(--text-muted); }\n    .contact-btn {\n      display: inline-flex; align-items: center; gap: 8px;\n      background: var(--brand); color: #fff;\n      padding: 10px 18px; border-radius: 100px;\n      font-size: 13px; font-weight: 700;\n      transition: background 0.15s ease;\n    }\n    .contact-btn:hover { background: var(--brand-dark); }\n    .contact-btn svg { width: 14px; height: 14px; }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 1040px; margin: 40px auto 28px; padding: 0 32px;\n      color: var(--text-faint); font-size: 11px; display: flex;\n      justify-content: space-between; flex-wrap: wrap; gap: 10px;\n    }\n    .legal-foot a:hover { color: var(--brand); }\n    .legal-foot-left { display: flex; align-items: center; gap: 8px; }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    @media (max-width: 640px) {\n      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }\n      .wrap { padding: 32px 16px 20px; }\n      h1 { font-size: 26px; }\n      .subhead { font-size: 14.5px; }\n      .action { grid-template-columns: 40px 1fr; }\n      .action-chev { display: none; }\n      .contact { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <header className="topbar">
    <div className="tb-brand">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z" /><circle cx="9" cy="9" r="0.8" fill="currentColor" /><circle cx="15" cy="9" r="0.8" fill="currentColor" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Black Bear Rentals</div>
        <div className="tb-brand-sub">Application update</div>
      </div>
    </div>

    <a className="tb-support" href="mailto:harrison@rentblackbear.com">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
      harrison@rentblackbear.com
    </a>
  </header>

  <main className="wrap">

    <section className="hero">
      <div className="icon-big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      </div>
      <div className="eyebrow">Decision</div>
      <h1>Your application wasn't a match this time, Jane.</h1>
      <p className="subhead">Harrison reviewed everything you sent. Here's what happened and what to do next.</p>
    </section>

    <div className="reason-card">
      <div className="reason-label">What this means</div>
      <div className="reason-title">We weren't able to move forward this time.</div>
      <div className="reason-body">
        The most common factors in decisions like this are income-to-rent ratio, rental history, or timing &mdash; another applicant was a slightly better fit for this specific room. A decision on one room isn't a judgment on you, and it doesn't prevent you from applying to other Black Bear rooms in the future.
      </div>
    </div>

    <div className="fcra">
      <div className="fcra-head">
        <div className="fcra-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <div className="fcra-title">Your rights under the Fair Credit Reporting Act</div>
      </div>
      <div className="fcra-body">
        If a consumer credit report or background check was used in this decision &mdash; in whole or in part &mdash; federal law (the <strong>Fair Credit Reporting Act, 15 U.S.C. &sect; 1681 et seq.</strong>) gives you the right to:
        <br /><br />
        &bull; Request a <strong>free copy of that report</strong> from the reporting agency within 60 days of this notice.<br />
        &bull; <strong>Dispute</strong> any information in the report that you believe is inaccurate or incomplete.<br />
        &bull; Know that the reporting agency did not make this decision and cannot explain why it was made.
      </div>
      <div className="bureau">
        <div className="bureau-name">TransUnion Rental Screening Solutions</div>
        <div className="bureau-detail">
          P.O. Box 800 &middot; Woodlyn, PA 19094<br />
          Phone: (800) 230-9376 &middot; <a href="https://www.transunion.com/credit-disclosure" style={{color: "var(--brand)", textDecoration: "underline"}}>transunion.com/credit-disclosure</a>
        </div>
      </div>
    </div>

    <h2 className="section-head">What you can do next</h2>
    <div className="actions">
      <a className="action" href="https://www.transunion.com/credit-disclosure" target="_blank" rel="noopener">
        <div className="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
        </div>
        <div>
          <div className="action-title">See the bureau report</div>
          <div className="action-desc">Request your free copy from TransUnion and review what was on file. Takes 5 minutes online.</div>
        </div>
        <span className="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
      </a>
      <a className="action" href="mailto:harrison@rentblackbear.com?subject=Appeal%20of%20application%20decision%20%E2%80%94%20908%20Lee%20Drive%20Room%20A&body=Hi%20Harrison%2C%0A%0AI%27d%20like%20to%20appeal%20the%20decision%20on%20my%20recent%20application.%20Here%27s%20additional%20context%20I%27d%20like%20you%20to%20consider%3A%0A%0A%5Byour%20note%20here%5D%0A%0AThanks%2C%0AJane">
        <div className="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <div>
          <div className="action-title">Appeal this decision</div>
          <div className="action-desc">Email Harrison directly with added context &mdash; a co-signer, updated pay stubs, or anything else you think changes the picture.</div>
        </div>
        <span className="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
      </a>
      <a className="action" href="listings.html">
        <div className="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" /></svg>
        </div>
        <div>
          <div className="action-title">Apply to another available room</div>
          <div className="action-desc">Black Bear has other rooms at 3026 Turf Ave and 908 Lee Drive. One of them may be a better fit right now.</div>
        </div>
        <span className="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
      </a>
    </div>

    <div className="encouragement">
      We know this stings &mdash; you put real effort into the application, and you deserve a straight answer. <strong>Black Bear has more rooms coming available</strong> in the next few months, and the fit between applicant and room matters as much as any single number on a report. If you appeal, a Tenantory operator reviews the case personally alongside Harrison &mdash; it's not an automated rejection.
    </div>

    <div className="note">
      <div className="note-from">
        <div className="note-avatar">HC</div>
        <div>
          <div className="note-name">Harrison Cooper</div>
          <div className="note-role">Owner &middot; Black Bear Rentals</div>
        </div>
      </div>
      <div className="note-body">
        Jane &mdash; I read your whole application. I know "not this time" isn't the answer you wanted, and I'm not going to pretend otherwise. If you want to talk through it, or if there's something I missed that would change my read, reply to the appeal email and I'll respond personally within 48 hours. Either way, thank you for considering Black Bear.
      </div>
    </div>

    <div className="contact">
      <div>
        <div className="contact-title">Still have questions?</div>
        <div className="contact-sub">We answer every email &mdash; usually within a business day.</div>
      </div>
      <a className="contact-btn" href="mailto:harrison@rentblackbear.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        Email Harrison
      </a>
    </div>

  </main>

  <footer className="legal-foot">
    <div className="legal-foot-left">
      <span>&copy; 2026 Black Bear Rentals</span>
      <span>&middot;</span>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
    <div className="powered-by">Powered by Tenantory</div>
  </footer>


    </>
  );
}
