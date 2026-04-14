"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tenant-declined.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      color: var(--text);
      background: var(--surface-alt);
      line-height: 1.5;
      font-size: 14px;
      min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }

    :root {
      --brand: #1e6f47;
      --brand-dark: #144d31;
      --brand-darker: #0e3822;
      --brand-bright: #2a8f5e;
      --brand-pale: #e7f4ed;
      --brand-soft: #d1e8dc;
      --accent: #c7843b;
      --accent-bg: rgba(199,132,59,0.12);
      --text: #1f2b24;
      --text-muted: #5e6b62;
      --text-faint: #8b978f;
      --surface: #ffffff;
      --surface-alt: #f6f4ee;
      --surface-subtle: #fbfaf4;
      --border: #e5e1d4;
      --border-strong: #c9c3b0;
      --green: #1e6f47;
      --green-bg: rgba(30,111,71,0.12);
      --green-dark: #144d31;
      --red: #b23a3a;
      --red-bg: rgba(178,58,58,0.1);
      --amber: #c7843b;
      --neutral: #7a8580;
      --neutral-bg: #eeece4;
      --radius-sm: 6px;
      --radius: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);
      --shadow: 0 4px 18px rgba(20,77,49,0.08);
      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);
    }

    /* Topbar */
    .topbar {
      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);
      color: rgba(255,255,255,0.9);
      padding: 0 32px;
      height: 72px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 0 rgba(0,0,0,0.04);
    }
    .tb-brand { display: flex; align-items: center; gap: 12px; }
    .tb-logo {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, var(--brand-bright), var(--accent));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      color: #fff;
    }
    .tb-logo svg { width: 22px; height: 22px; }
    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }
    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }
    .tb-support {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 100px;
      background: rgba(255,255,255,0.08); color: #fff;
      font-size: 12px; font-weight: 600;
      transition: background 0.15s ease;
    }
    .tb-support:hover { background: rgba(255,255,255,0.16); }
    .tb-support svg { width: 14px; height: 14px; }

    /* Main */
    .wrap { max-width: 720px; margin: 0 auto; padding: 48px 32px 32px; }

    /* Hero */
    .hero { text-align: center; margin-bottom: 36px; }
    .icon-big {
      width: 88px; height: 88px; border-radius: 20px;
      background: var(--neutral-bg);
      color: var(--neutral);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 22px;
      border: 1px solid var(--border);
    }
    .icon-big svg { width: 42px; height: 42px; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--text-muted);
      background: var(--neutral-bg); padding: 6px 12px;
      border-radius: 100px; margin-bottom: 16px;
    }
    h1 {
      font-size: 34px; font-weight: 800; letter-spacing: -0.025em;
      line-height: 1.2; margin-bottom: 12px; color: var(--text);
    }
    .subhead {
      font-size: 16px; color: var(--text-muted);
      max-width: 520px; margin: 0 auto; line-height: 1.55;
    }

    /* Reason card */
    .reason-card {
      background: var(--surface); border-radius: var(--radius-xl);
      padding: 26px 28px; border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }
    .reason-label {
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-faint);
      margin-bottom: 10px;
    }
    .reason-title {
      font-size: 17px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em; margin-bottom: 10px;
    }
    .reason-body {
      font-size: 14px; color: var(--text-muted); line-height: 1.65;
    }

    /* FCRA card */
    .fcra {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px 24px; margin-bottom: 32px;
    }
    .fcra-head {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
    }
    .fcra-icon {
      width: 28px; height: 28px; border-radius: 6px;
      background: var(--accent-bg); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .fcra-icon svg { width: 14px; height: 14px; }
    .fcra-title { font-size: 13px; font-weight: 700; color: var(--text); letter-spacing: -0.005em; }
    .fcra-body {
      font-size: 13px; color: var(--text-muted); line-height: 1.6;
      margin-bottom: 14px;
    }
    .fcra-body strong { color: var(--text); font-weight: 600; }
    .bureau {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px 16px;
      font-size: 12px; color: var(--text); line-height: 1.6;
    }
    .bureau-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
    .bureau-detail { color: var(--text-muted); }

    /* Section heading */
    .section-head {
      font-size: 18px; font-weight: 800; letter-spacing: -0.015em;
      margin-bottom: 16px; color: var(--text);
    }

    /* Action cards */
    .actions { display: grid; gap: 12px; margin-bottom: 32px; }
    .action {
      display: grid; grid-template-columns: 44px 1fr 18px;
      gap: 16px; align-items: center;
      background: var(--surface); border-radius: var(--radius-lg);
      padding: 18px 20px; border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: all 0.15s ease;
    }
    .action:hover {
      border-color: var(--brand); transform: translateY(-1px);
      box-shadow: var(--shadow);
    }
    .action-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center;
    }
    .action-icon svg { width: 18px; height: 18px; }
    .action-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 3px; }
    .action-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }
    .action-chev { color: var(--text-faint); }
    .action-chev svg { width: 16px; height: 16px; }

    /* Encouragement */
    .encouragement {
      background: var(--brand-pale);
      border-radius: var(--radius-lg);
      padding: 22px 24px; margin-bottom: 28px;
      font-size: 14px; color: var(--text); line-height: 1.65;
    }
    .encouragement strong { color: var(--brand-dark); font-weight: 700; }

    /* Note */
    .note {
      background: var(--surface-subtle);
      border-left: 3px solid var(--neutral);
      border-radius: var(--radius-lg);
      padding: 20px 22px; margin-bottom: 28px;
      box-shadow: var(--shadow-sm);
    }
    .note-from {
      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    }
    .note-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--brand-bright));
      color: #fff; font-weight: 700; font-size: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .note-name { font-weight: 700; font-size: 13px; color: var(--text); }
    .note-role { font-size: 11px; color: var(--text-faint); }
    .note-body { font-size: 14px; color: var(--text); line-height: 1.6; }

    /* Contact card */
    .contact {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 22px;
      display: grid; grid-template-columns: 1fr auto; gap: 16px;
      align-items: center; margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
    }
    .contact-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 3px; }
    .contact-sub { font-size: 12.5px; color: var(--text-muted); }
    .contact-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--brand); color: #fff;
      padding: 10px 18px; border-radius: 100px;
      font-size: 13px; font-weight: 700;
      transition: background 0.15s ease;
    }
    .contact-btn:hover { background: var(--brand-dark); }
    .contact-btn svg { width: 14px; height: 14px; }

    /* Footer */
    .legal-foot {
      max-width: 1040px; margin: 40px auto 28px; padding: 0 32px;
      color: var(--text-faint); font-size: 11px; display: flex;
      justify-content: space-between; flex-wrap: wrap; gap: 10px;
    }
    .legal-foot a:hover { color: var(--brand); }
    .legal-foot-left { display: flex; align-items: center; gap: 8px; }
    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }

    @media (max-width: 640px) {
      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }
      .wrap { padding: 32px 16px 20px; }
      h1 { font-size: 26px; }
      .subhead { font-size: 14.5px; }
      .action { grid-template-columns: 40px 1fr; }
      .action-chev { display: none; }
      .contact { grid-template-columns: 1fr; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <div class="tb-brand">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2-5 4-5 1 0 2 .5 2.5 1.5C11 4.5 12 4 13.5 4S16 5 17 6c3 0 4 2 4 4 0 2-1 4-4 4l-1 4c0 1-1 2-2 2h-4c-1 0-2-1-2-2l-1-4c-2 0-3-2-3-5z"/><circle cx="9" cy="9" r="0.8" fill="currentColor"/><circle cx="15" cy="9" r="0.8" fill="currentColor"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Black Bear Rentals</div>
        <div class="tb-brand-sub">Application update</div>
      </div>
    </div>

    <a class="tb-support" href="mailto:harrison@rentblackbear.com">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      harrison@rentblackbear.com
    </a>
  </header>

  <main class="wrap">

    <section class="hero">
      <div class="icon-big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="13" y2="17"/>
        </svg>
      </div>
      <div class="eyebrow">Decision</div>
      <h1>Your application wasn't a match this time, Jane.</h1>
      <p class="subhead">Harrison reviewed everything you sent. Here's what happened and what to do next.</p>
    </section>

    <div class="reason-card">
      <div class="reason-label">What this means</div>
      <div class="reason-title">We weren't able to move forward this time.</div>
      <div class="reason-body">
        The most common factors in decisions like this are income-to-rent ratio, rental history, or timing &mdash; another applicant was a slightly better fit for this specific room. A decision on one room isn't a judgment on you, and it doesn't prevent you from applying to other Black Bear rooms in the future.
      </div>
    </div>

    <div class="fcra">
      <div class="fcra-head">
        <div class="fcra-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="fcra-title">Your rights under the Fair Credit Reporting Act</div>
      </div>
      <div class="fcra-body">
        If a consumer credit report or background check was used in this decision &mdash; in whole or in part &mdash; federal law (the <strong>Fair Credit Reporting Act, 15 U.S.C. &sect; 1681 et seq.</strong>) gives you the right to:
        <br><br>
        &bull; Request a <strong>free copy of that report</strong> from the reporting agency within 60 days of this notice.<br>
        &bull; <strong>Dispute</strong> any information in the report that you believe is inaccurate or incomplete.<br>
        &bull; Know that the reporting agency did not make this decision and cannot explain why it was made.
      </div>
      <div class="bureau">
        <div class="bureau-name">TransUnion Rental Screening Solutions</div>
        <div class="bureau-detail">
          P.O. Box 800 &middot; Woodlyn, PA 19094<br>
          Phone: (800) 230-9376 &middot; <a href="https://www.transunion.com/credit-disclosure" style="color:var(--brand);text-decoration:underline;">transunion.com/credit-disclosure</a>
        </div>
      </div>
    </div>

    <h2 class="section-head">What you can do next</h2>
    <div class="actions">
      <a class="action" href="https://www.transunion.com/credit-disclosure" target="_blank" rel="noopener">
        <div class="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div>
          <div class="action-title">See the bureau report</div>
          <div class="action-desc">Request your free copy from TransUnion and review what was on file. Takes 5 minutes online.</div>
        </div>
        <span class="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
      </a>
      <a class="action" href="mailto:harrison@rentblackbear.com?subject=Appeal%20of%20application%20decision%20%E2%80%94%20908%20Lee%20Drive%20Room%20A&body=Hi%20Harrison%2C%0A%0AI%27d%20like%20to%20appeal%20the%20decision%20on%20my%20recent%20application.%20Here%27s%20additional%20context%20I%27d%20like%20you%20to%20consider%3A%0A%0A%5Byour%20note%20here%5D%0A%0AThanks%2C%0AJane">
        <div class="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <div class="action-title">Appeal this decision</div>
          <div class="action-desc">Email Harrison directly with added context &mdash; a co-signer, updated pay stubs, or anything else you think changes the picture.</div>
        </div>
        <span class="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
      </a>
      <a class="action" href="listings.html">
        <div class="action-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H12v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z"/></svg>
        </div>
        <div>
          <div class="action-title">Apply to another available room</div>
          <div class="action-desc">Black Bear has other rooms at 3026 Turf Ave and 908 Lee Drive. One of them may be a better fit right now.</div>
        </div>
        <span class="action-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
      </a>
    </div>

    <div class="encouragement">
      We know this stings &mdash; you put real effort into the application, and you deserve a straight answer. <strong>Black Bear has more rooms coming available</strong> in the next few months, and the fit between applicant and room matters as much as any single number on a report. If you appeal, a Tenantory operator reviews the case personally alongside Harrison &mdash; it's not an automated rejection.
    </div>

    <div class="note">
      <div class="note-from">
        <div class="note-avatar">HC</div>
        <div>
          <div class="note-name">Harrison Cooper</div>
          <div class="note-role">Owner &middot; Black Bear Rentals</div>
        </div>
      </div>
      <div class="note-body">
        Jane &mdash; I read your whole application. I know "not this time" isn't the answer you wanted, and I'm not going to pretend otherwise. If you want to talk through it, or if there's something I missed that would change my read, reply to the appeal email and I'll respond personally within 48 hours. Either way, thank you for considering Black Bear.
      </div>
    </div>

    <div class="contact">
      <div>
        <div class="contact-title">Still have questions?</div>
        <div class="contact-sub">We answer every email &mdash; usually within a business day.</div>
      </div>
      <a class="contact-btn" href="mailto:harrison@rentblackbear.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Email Harrison
      </a>
    </div>

  </main>

  <footer class="legal-foot">
    <div class="legal-foot-left">
      <span>&copy; 2026 Black Bear Rentals</span>
      <span>&middot;</span>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
    <div class="powered-by">Powered by Tenantory</div>
  </footer>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOCK_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MOCK_HTML }} />
    </>
  );
}
