"use client";

// Mock ported from ~/Desktop/blackbear/tenant-approved.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n    body {\n      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;\n      color: var(--text);\n      background: var(--surface-alt);\n      line-height: 1.5;\n      font-size: 14px;\n      min-height: 100vh;\n    }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --brand: #1e6f47;\n      --brand-dark: #144d31;\n      --brand-darker: #0e3822;\n      --brand-bright: #2a8f5e;\n      --brand-pale: #e7f4ed;\n      --brand-soft: #d1e8dc;\n      --accent: #c7843b;\n      --accent-bg: rgba(199,132,59,0.12);\n      --text: #1f2b24;\n      --text-muted: #5e6b62;\n      --text-faint: #8b978f;\n      --surface: #ffffff;\n      --surface-alt: #f6f4ee;\n      --surface-subtle: #fbfaf4;\n      --border: #e5e1d4;\n      --border-strong: #c9c3b0;\n      --green: #1e6f47;\n      --green-bg: rgba(30,111,71,0.12);\n      --green-dark: #144d31;\n      --red: #b23a3a;\n      --red-bg: rgba(178,58,58,0.1);\n      --amber: #c7843b;\n      --pink: #d94b78;\n      --pink-dark: #b93560;\n      --radius-sm: 6px;\n      --radius: 10px;\n      --radius-lg: 14px;\n      --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(20,77,49,0.05);\n      --shadow: 0 4px 18px rgba(20,77,49,0.08);\n      --shadow-lg: 0 14px 44px rgba(20,77,49,0.14);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: linear-gradient(180deg, var(--brand-dark) 0%, var(--brand-darker) 100%);\n      color: rgba(255,255,255,0.9);\n      padding: 0 32px;\n      height: 72px;\n      display: flex; align-items: center; justify-content: space-between;\n      box-shadow: 0 2px 0 rgba(0,0,0,0.04);\n    }\n    .tb-brand { display: flex; align-items: center; gap: 12px; }\n    .tb-logo {\n      width: 40px; height: 40px; border-radius: 10px;\n      background: linear-gradient(135deg, var(--brand-bright), var(--accent));\n      display: flex; align-items: center; justify-content: center;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n      color: #fff;\n    }\n    .tb-logo svg { width: 22px; height: 22px; }\n    .tb-brand-name { font-weight: 800; font-size: 18px; color: #fff; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; margin-top: 1px; }\n    .tb-support {\n      display: flex; align-items: center; gap: 8px;\n      padding: 8px 14px; border-radius: 100px;\n      background: rgba(255,255,255,0.08); color: #fff;\n      font-size: 12px; font-weight: 600;\n      transition: background 0.15s ease;\n    }\n    .tb-support:hover { background: rgba(255,255,255,0.16); }\n    .tb-support svg { width: 14px; height: 14px; }\n\n    /* Main */\n    .wrap { max-width: 760px; margin: 0 auto; padding: 48px 32px 32px; }\n\n    /* Hero */\n    .hero { text-align: center; margin-bottom: 40px; }\n    .badge-big {\n      width: 96px; height: 96px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--brand-bright) 0%, var(--brand) 100%);\n      color: #fff;\n      display: flex; align-items: center; justify-content: center;\n      margin: 0 auto 24px;\n      box-shadow: 0 18px 40px rgba(30,111,71,0.32);\n      position: relative;\n    }\n    .badge-big::after {\n      content: \"\"; position: absolute; inset: -8px;\n      border-radius: 50%; border: 2px solid var(--brand-soft);\n      opacity: 0.6;\n    }\n    .badge-big svg { width: 48px; height: 48px; }\n    .eyebrow {\n      display: inline-flex; align-items: center; gap: 6px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.14em;\n      text-transform: uppercase; color: var(--brand);\n      background: var(--brand-pale); padding: 6px 12px;\n      border-radius: 100px; margin-bottom: 16px;\n    }\n    .eyebrow svg { width: 10px; height: 10px; }\n    h1 {\n      font-size: 40px; font-weight: 800; letter-spacing: -0.025em;\n      line-height: 1.1; margin-bottom: 12px; color: var(--text);\n    }\n    .subhead {\n      font-size: 17px; color: var(--text-muted);\n      max-width: 520px; margin: 0 auto; line-height: 1.55;\n    }\n\n    /* Unit card */\n    .unit-card {\n      background: var(--surface); border-radius: var(--radius-xl);\n      overflow: hidden; box-shadow: var(--shadow);\n      border: 1px solid var(--border);\n      margin-bottom: 28px;\n    }\n    .unit-photo {\n      height: 180px;\n      background:\n        radial-gradient(circle at 28% 40%, rgba(255,255,255,0.18), transparent 55%),\n        linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 60%, var(--brand-bright) 100%);\n      position: relative;\n      display: flex; align-items: flex-end; padding: 20px;\n    }\n    .unit-photo::after {\n      content: \"\"; position: absolute; top: 0; right: 0;\n      width: 180px; height: 180px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(199,132,59,0.28), transparent 70%);\n      transform: translate(30%, -30%);\n    }\n    .unit-photo-tag {\n      background: rgba(255,255,255,0.92); color: var(--brand-dark);\n      padding: 6px 12px; border-radius: 100px;\n      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;\n      text-transform: uppercase;\n      position: relative; z-index: 1;\n    }\n    .unit-body { padding: 24px; }\n    .unit-title {\n      font-size: 18px; font-weight: 700; color: var(--text);\n      margin-bottom: 4px; letter-spacing: -0.01em;\n    }\n    .unit-addr { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }\n    .unit-stats {\n      display: grid; grid-template-columns: repeat(3, 1fr);\n      gap: 16px; padding-top: 18px;\n      border-top: 1px solid var(--border);\n    }\n    .unit-stat-label {\n      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;\n      text-transform: uppercase; color: var(--text-faint);\n      margin-bottom: 4px;\n    }\n    .unit-stat-value {\n      font-size: 18px; font-weight: 700; color: var(--text);\n      letter-spacing: -0.01em;\n    }\n    .unit-stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    /* CTA */\n    .cta-row { text-align: center; margin-bottom: 40px; }\n    .btn-sign {\n      display: inline-flex; align-items: center; gap: 10px;\n      background: linear-gradient(135deg, var(--pink) 0%, var(--pink-dark) 100%);\n      color: #fff;\n      padding: 18px 36px; border-radius: 100px;\n      font-size: 16px; font-weight: 700; letter-spacing: -0.01em;\n      box-shadow: 0 14px 32px rgba(217,75,120,0.36);\n      transition: transform 0.15s ease, box-shadow 0.15s ease;\n    }\n    .btn-sign:hover { transform: translateY(-1px); box-shadow: 0 18px 38px rgba(217,75,120,0.42); }\n    .btn-sign svg { width: 18px; height: 18px; }\n    .cta-note {\n      margin-top: 14px; font-size: 12px; color: var(--text-muted);\n    }\n\n    /* Section heading */\n    .section-head {\n      font-size: 20px; font-weight: 800; letter-spacing: -0.015em;\n      margin-bottom: 18px; color: var(--text);\n    }\n\n    /* Next steps */\n    .steps { display: grid; gap: 12px; margin-bottom: 36px; }\n    .step {\n      display: grid; grid-template-columns: 44px 1fr auto;\n      gap: 16px; align-items: center;\n      background: var(--surface); border-radius: var(--radius-lg);\n      padding: 18px 20px; border: 1px solid var(--border);\n      box-shadow: var(--shadow-sm);\n    }\n    .step-num {\n      width: 36px; height: 36px; border-radius: 50%;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center;\n      font-weight: 800; font-size: 15px;\n    }\n    .step-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }\n    .step-desc { font-size: 13px; color: var(--text-muted); }\n    .step-meta {\n      font-size: 11px; font-weight: 600; color: var(--brand);\n      background: var(--brand-pale); padding: 5px 10px;\n      border-radius: 100px;\n    }\n\n    /* Note card (Harrison's quote) */\n    .note {\n      background: var(--surface-subtle);\n      border-left: 3px solid var(--accent);\n      border-radius: var(--radius-lg);\n      padding: 22px 24px 22px 26px;\n      margin-bottom: 28px;\n      box-shadow: var(--shadow-sm);\n    }\n    .note-from {\n      display: flex; align-items: center; gap: 10px;\n      margin-bottom: 10px;\n    }\n    .note-avatar {\n      width: 32px; height: 32px; border-radius: 50%;\n      background: linear-gradient(135deg, var(--accent), var(--brand-bright));\n      color: #fff; font-weight: 700; font-size: 12px;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .note-name { font-weight: 700; font-size: 13px; color: var(--text); }\n    .note-role { font-size: 11px; color: var(--text-faint); }\n    .note-body {\n      font-size: 14px; color: var(--text);\n      line-height: 1.6; font-style: italic;\n    }\n\n    /* Urgency */\n    .urgency {\n      display: flex; align-items: flex-start; gap: 12px;\n      background: var(--accent-bg);\n      border: 1px solid rgba(199,132,59,0.3);\n      border-radius: var(--radius-lg);\n      padding: 16px 18px; margin-bottom: 36px;\n    }\n    .urgency-icon {\n      flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;\n      background: var(--accent); color: #fff;\n      display: flex; align-items: center; justify-content: center;\n    }\n    .urgency-icon svg { width: 14px; height: 14px; }\n    .urgency-title { font-weight: 700; font-size: 13px; color: var(--text); margin-bottom: 2px; }\n    .urgency-body { font-size: 13px; color: var(--text-muted); line-height: 1.55; }\n\n    /* Secondary actions */\n    .secondary-row {\n      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\n      margin-bottom: 32px;\n    }\n    .sec-btn {\n      display: flex; align-items: center; gap: 12px;\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 14px 16px;\n      transition: all 0.15s ease;\n    }\n    .sec-btn:hover {\n      border-color: var(--brand); background: var(--brand-pale);\n      transform: translateY(-1px);\n    }\n    .sec-btn-icon {\n      width: 32px; height: 32px; border-radius: 8px;\n      background: var(--brand-pale); color: var(--brand);\n      display: flex; align-items: center; justify-content: center;\n      flex-shrink: 0;\n    }\n    .sec-btn-icon svg { width: 16px; height: 16px; }\n    .sec-btn-label { font-weight: 700; font-size: 13px; color: var(--text); }\n    .sec-btn-sub { font-size: 11px; color: var(--text-muted); }\n\n    /* Footer */\n    .legal-foot {\n      max-width: 1040px; margin: 40px auto 28px; padding: 0 32px;\n      color: var(--text-faint); font-size: 11px; display: flex;\n      justify-content: space-between; flex-wrap: wrap; gap: 10px;\n    }\n    .legal-foot a:hover { color: var(--brand); }\n    .legal-foot-left { display: flex; align-items: center; gap: 8px; }\n    .powered-by { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }\n\n    @media (max-width: 640px) {\n      .topbar { padding: 0 16px; height: auto; flex-direction: column; gap: 10px; padding-top: 14px; padding-bottom: 14px; }\n      .wrap { padding: 32px 16px 20px; }\n      h1 { font-size: 30px; }\n      .subhead { font-size: 15px; }\n      .unit-stats { grid-template-columns: 1fr; gap: 12px; }\n      .secondary-row { grid-template-columns: 1fr; }\n      .step { grid-template-columns: 36px 1fr; }\n      .step-meta { grid-column: 2; justify-self: start; }\n    }\n  ";

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
      <div className="badge-big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div className="eyebrow">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
        Approved
      </div>
      <h1>You're approved, Jane!</h1>
      <p className="subhead">Harrison reviewed your application and wants you in Room A, 908 Lee Drive.</p>
    </section>

    <div className="unit-card">
      <div className="unit-photo">
        <span className="unit-photo-tag">Room A</span>
      </div>
      <div className="unit-body">
        <div className="unit-title">908 Lee Drive NW &middot; Room A</div>
        <div className="unit-addr">Huntsville, AL 35816 &middot; private bedroom, shared kitchen &amp; living</div>
        <div className="unit-stats">
          <div>
            <div className="unit-stat-label">Monthly rent</div>
            <div className="unit-stat-value">$750</div>
            <div className="unit-stat-sub">all utilities included</div>
          </div>
          <div>
            <div className="unit-stat-label">Move-in date</div>
            <div className="unit-stat-value">May 1, 2026</div>
            <div className="unit-stat-sub">keys ready at 10 a.m.</div>
          </div>
          <div>
            <div className="unit-stat-label">Lease term</div>
            <div className="unit-stat-value">12 months</div>
            <div className="unit-stat-sub">through Apr 30, 2027</div>
          </div>
        </div>
      </div>
    </div>

    <div className="cta-row">
      <a className="btn-sign" href="sign.html">
        Sign your lease
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
      <div className="cta-note">Takes about 4 minutes &middot; e-signature, no printing</div>
    </div>

    <h2 className="section-head">What happens next</h2>
    <div className="steps">
      <div className="step">
        <div className="step-num">1</div>
        <div>
          <div className="step-title">Sign the lease online</div>
          <div className="step-desc">Review the terms, initial the room rules, and sign. You'll get a copy emailed immediately.</div>
        </div>
        <span className="step-meta">Today</span>
      </div>
      <div className="step">
        <div className="step-num">2</div>
        <div>
          <div className="step-title">Pay first month + deposit</div>
          <div className="step-desc">$1,500 total ($750 rent + $750 refundable deposit). Bank transfer has no fees; card adds a 2.9% processing fee.</div>
        </div>
        <span className="step-meta">By Apr 21</span>
      </div>
      <div className="step">
        <div className="step-num">3</div>
        <div>
          <div className="step-title">Get your move-in packet by email</div>
          <div className="step-desc">Door code, Wi-Fi password, parking spot, trash day, and Harrison's direct cell. Sent automatically once payment clears.</div>
        </div>
        <span className="step-meta">Apr 28</span>
      </div>
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
        "Jane &mdash; thanks for putting in such a thorough application. The reference from your manager at Redstone sealed it for me. Room A gets the morning light and shares a wall with the quietest housemate in the place, so I think you'll like it. If anything comes up between now and May 1, text me directly at the number in your move-in packet. Welcome to Black Bear."
      </div>
    </div>

    <div className="urgency">
      <div className="urgency-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
      </div>
      <div>
        <div className="urgency-title">This approval is held for 72 hours</div>
        <div className="urgency-body">After that, we'll offer the room to the next applicant on the list. Signing the lease locks it in &mdash; you don't have to pay to hold it.</div>
      </div>
    </div>

    <h2 className="section-head">Need something first?</h2>
    <div className="secondary-row">
      <a className="sec-btn" href="mailto:harrison@rentblackbear.com?subject=Question%20about%20908%20Lee%20Drive%20Room%20A">
        <div className="sec-btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <div>
          <div className="sec-btn-label">Ask a question</div>
          <div className="sec-btn-sub">Email Harrison &middot; replies within a few hours</div>
        </div>
      </a>
      <a className="sec-btn" href="https://calendly.com/rentblackbear/15min" target="_blank" rel="noopener">
        <div className="sec-btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        </div>
        <div>
          <div className="sec-btn-label">Request a phone call</div>
          <div className="sec-btn-sub">Pick a 15-minute slot that works for you</div>
        </div>
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
    <div className="powered-by">Powered by Black Bear Rentals</div>
  </footer>


    </>
  );
}
