"use client";

// Mock ported verbatim from ~/Desktop/tenantory/tenant-approved.html.
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
      --pink: #d94b78;
      --pink-dark: #b93560;
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
    .wrap { max-width: 760px; margin: 0 auto; padding: 48px 32px 32px; }

    /* Hero */
    .hero { text-align: center; margin-bottom: 40px; }
    .badge-big {
      width: 96px; height: 96px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand-bright) 0%, var(--brand) 100%);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 18px 40px rgba(30,111,71,0.32);
      position: relative;
    }
    .badge-big::after {
      content: ""; position: absolute; inset: -8px;
      border-radius: 50%; border: 2px solid var(--brand-soft);
      opacity: 0.6;
    }
    .badge-big svg { width: 48px; height: 48px; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--brand);
      background: var(--brand-pale); padding: 6px 12px;
      border-radius: 100px; margin-bottom: 16px;
    }
    .eyebrow svg { width: 10px; height: 10px; }
    h1 {
      font-size: 40px; font-weight: 800; letter-spacing: -0.025em;
      line-height: 1.1; margin-bottom: 12px; color: var(--text);
    }
    .subhead {
      font-size: 17px; color: var(--text-muted);
      max-width: 520px; margin: 0 auto; line-height: 1.55;
    }

    /* Unit card */
    .unit-card {
      background: var(--surface); border-radius: var(--radius-xl);
      overflow: hidden; box-shadow: var(--shadow);
      border: 1px solid var(--border);
      margin-bottom: 28px;
    }
    .unit-photo {
      height: 180px;
      background:
        radial-gradient(circle at 28% 40%, rgba(255,255,255,0.18), transparent 55%),
        linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 60%, var(--brand-bright) 100%);
      position: relative;
      display: flex; align-items: flex-end; padding: 20px;
    }
    .unit-photo::after {
      content: ""; position: absolute; top: 0; right: 0;
      width: 180px; height: 180px; border-radius: 50%;
      background: radial-gradient(circle, rgba(199,132,59,0.28), transparent 70%);
      transform: translate(30%, -30%);
    }
    .unit-photo-tag {
      background: rgba(255,255,255,0.92); color: var(--brand-dark);
      padding: 6px 12px; border-radius: 100px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase;
      position: relative; z-index: 1;
    }
    .unit-body { padding: 24px; }
    .unit-title {
      font-size: 18px; font-weight: 700; color: var(--text);
      margin-bottom: 4px; letter-spacing: -0.01em;
    }
    .unit-addr { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
    .unit-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 16px; padding-top: 18px;
      border-top: 1px solid var(--border);
    }
    .unit-stat-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-faint);
      margin-bottom: 4px;
    }
    .unit-stat-value {
      font-size: 18px; font-weight: 700; color: var(--text);
      letter-spacing: -0.01em;
    }
    .unit-stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    /* CTA */
    .cta-row { text-align: center; margin-bottom: 40px; }
    .btn-sign {
      display: inline-flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, var(--pink) 0%, var(--pink-dark) 100%);
      color: #fff;
      padding: 18px 36px; border-radius: 100px;
      font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
      box-shadow: 0 14px 32px rgba(217,75,120,0.36);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-sign:hover { transform: translateY(-1px); box-shadow: 0 18px 38px rgba(217,75,120,0.42); }
    .btn-sign svg { width: 18px; height: 18px; }
    .cta-note {
      margin-top: 14px; font-size: 12px; color: var(--text-muted);
    }

    /* Section heading */
    .section-head {
      font-size: 20px; font-weight: 800; letter-spacing: -0.015em;
      margin-bottom: 18px; color: var(--text);
    }

    /* Next steps */
    .steps { display: grid; gap: 12px; margin-bottom: 36px; }
    .step {
      display: grid; grid-template-columns: 44px 1fr auto;
      gap: 16px; align-items: center;
      background: var(--surface); border-radius: var(--radius-lg);
      padding: 18px 20px; border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }
    .step-num {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px;
    }
    .step-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 2px; }
    .step-desc { font-size: 13px; color: var(--text-muted); }
    .step-meta {
      font-size: 11px; font-weight: 600; color: var(--brand);
      background: var(--brand-pale); padding: 5px 10px;
      border-radius: 100px;
    }

    /* Note card (Harrison's quote) */
    .note {
      background: var(--surface-subtle);
      border-left: 3px solid var(--accent);
      border-radius: var(--radius-lg);
      padding: 22px 24px 22px 26px;
      margin-bottom: 28px;
      box-shadow: var(--shadow-sm);
    }
    .note-from {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 10px;
    }
    .note-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--brand-bright));
      color: #fff; font-weight: 700; font-size: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .note-name { font-weight: 700; font-size: 13px; color: var(--text); }
    .note-role { font-size: 11px; color: var(--text-faint); }
    .note-body {
      font-size: 14px; color: var(--text);
      line-height: 1.6; font-style: italic;
    }

    /* Urgency */
    .urgency {
      display: flex; align-items: flex-start; gap: 12px;
      background: var(--accent-bg);
      border: 1px solid rgba(199,132,59,0.3);
      border-radius: var(--radius-lg);
      padding: 16px 18px; margin-bottom: 36px;
    }
    .urgency-icon {
      flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .urgency-icon svg { width: 14px; height: 14px; }
    .urgency-title { font-weight: 700; font-size: 13px; color: var(--text); margin-bottom: 2px; }
    .urgency-body { font-size: 13px; color: var(--text-muted); line-height: 1.55; }

    /* Secondary actions */
    .secondary-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-bottom: 32px;
    }
    .sec-btn {
      display: flex; align-items: center; gap: 12px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 14px 16px;
      transition: all 0.15s ease;
    }
    .sec-btn:hover {
      border-color: var(--brand); background: var(--brand-pale);
      transform: translateY(-1px);
    }
    .sec-btn-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--brand-pale); color: var(--brand);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sec-btn-icon svg { width: 16px; height: 16px; }
    .sec-btn-label { font-weight: 700; font-size: 13px; color: var(--text); }
    .sec-btn-sub { font-size: 11px; color: var(--text-muted); }

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
      h1 { font-size: 30px; }
      .subhead { font-size: 15px; }
      .unit-stats { grid-template-columns: 1fr; gap: 12px; }
      .secondary-row { grid-template-columns: 1fr; }
      .step { grid-template-columns: 36px 1fr; }
      .step-meta { grid-column: 2; justify-self: start; }
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
      <div class="badge-big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="eyebrow">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
        Approved
      </div>
      <h1>You're approved, Jane!</h1>
      <p class="subhead">Harrison reviewed your application and wants you in Room A, 908 Lee Drive.</p>
    </section>

    <div class="unit-card">
      <div class="unit-photo">
        <span class="unit-photo-tag">Room A</span>
      </div>
      <div class="unit-body">
        <div class="unit-title">908 Lee Drive NW &middot; Room A</div>
        <div class="unit-addr">Huntsville, AL 35816 &middot; private bedroom, shared kitchen &amp; living</div>
        <div class="unit-stats">
          <div>
            <div class="unit-stat-label">Monthly rent</div>
            <div class="unit-stat-value">$750</div>
            <div class="unit-stat-sub">all utilities included</div>
          </div>
          <div>
            <div class="unit-stat-label">Move-in date</div>
            <div class="unit-stat-value">May 1, 2026</div>
            <div class="unit-stat-sub">keys ready at 10 a.m.</div>
          </div>
          <div>
            <div class="unit-stat-label">Lease term</div>
            <div class="unit-stat-value">12 months</div>
            <div class="unit-stat-sub">through Apr 30, 2027</div>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-row">
      <a class="btn-sign" href="sign.html">
        Sign your lease
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <div class="cta-note">Takes about 4 minutes &middot; e-signature, no printing</div>
    </div>

    <h2 class="section-head">What happens next</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div>
          <div class="step-title">Sign the lease online</div>
          <div class="step-desc">Review the terms, initial the room rules, and sign. You'll get a copy emailed immediately.</div>
        </div>
        <span class="step-meta">Today</span>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div>
          <div class="step-title">Pay first month + deposit</div>
          <div class="step-desc">$1,500 total ($750 rent + $750 refundable deposit). Bank transfer has no fees; card adds a 2.9% processing fee.</div>
        </div>
        <span class="step-meta">By Apr 21</span>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div>
          <div class="step-title">Get your move-in packet by email</div>
          <div class="step-desc">Door code, Wi-Fi password, parking spot, trash day, and Harrison's direct cell. Sent automatically once payment clears.</div>
        </div>
        <span class="step-meta">Apr 28</span>
      </div>
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
        "Jane &mdash; thanks for putting in such a thorough application. The reference from your manager at Redstone sealed it for me. Room A gets the morning light and shares a wall with the quietest housemate in the place, so I think you'll like it. If anything comes up between now and May 1, text me directly at the number in your move-in packet. Welcome to Black Bear."
      </div>
    </div>

    <div class="urgency">
      <div class="urgency-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
      </div>
      <div>
        <div class="urgency-title">This approval is held for 72 hours</div>
        <div class="urgency-body">After that, we'll offer the room to the next applicant on the list. Signing the lease locks it in &mdash; you don't have to pay to hold it.</div>
      </div>
    </div>

    <h2 class="section-head">Need something first?</h2>
    <div class="secondary-row">
      <a class="sec-btn" href="mailto:harrison@rentblackbear.com?subject=Question%20about%20908%20Lee%20Drive%20Room%20A">
        <div class="sec-btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <div class="sec-btn-label">Ask a question</div>
          <div class="sec-btn-sub">Email Harrison &middot; replies within a few hours</div>
        </div>
      </a>
      <a class="sec-btn" href="https://calendly.com/rentblackbear/15min" target="_blank" rel="noopener">
        <div class="sec-btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div>
          <div class="sec-btn-label">Request a phone call</div>
          <div class="sec-btn-sub">Pick a 15-minute slot that works for you</div>
        </div>
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
