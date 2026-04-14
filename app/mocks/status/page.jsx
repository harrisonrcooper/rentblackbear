"use client";

// Mock ported verbatim from ~/Desktop/tenantory/status.html.
// Viewable snapshot only; scripts and external asset references
// have been stripped. Phase 3 rewrites this against the Flagship
// primitives in components/ui/.

const MOCK_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    img, svg { display: block; max-width: 100%; }

    :root {
      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;
      --blue: #1251AD; --blue-bright: #1665D8;
      --blue-pale: #eef3ff;
      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);
      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;
      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;
      --border: #e3e8ef; --border-strong: #c9d1dd;
      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);
      --amber: #f5a623; --amber-bg: rgba(245,166,35,0.12);
      --red: #d64545; --red-bg: rgba(214,69,69,0.1);
      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;
      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);
      --shadow: 0 4px 18px rgba(26,31,54,0.07);
    }

    /* Topbar */
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
    .tb-brand-sub { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 1px; letter-spacing: 0.04em; }
    .tb-right { display: flex; gap: 10px; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }
    .btn svg { width: 14px; height: 14px; }
    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }
    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }

    /* Main layout */
    .wrap { max-width: 1000px; margin: 0 auto; padding: 36px 32px 60px; }

    /* Summary banner */
    .banner {
      background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
      color: #fff; border-radius: var(--radius-xl);
      padding: 28px 32px;
      display: flex; align-items: center; gap: 20px;
      box-shadow: 0 14px 40px rgba(30,169,124,0.22);
      margin-bottom: 32px; position: relative; overflow: hidden;
    }
    .banner.degraded { background: linear-gradient(135deg, var(--amber), #c47913); box-shadow: 0 14px 40px rgba(245,166,35,0.28); }
    .banner.down { background: linear-gradient(135deg, var(--red), #a93333); box-shadow: 0 14px 40px rgba(214,69,69,0.28); }
    .banner::after {
      content: ""; position: absolute; top: -40px; right: -40px;
      width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);
    }
    .pulse-dot {
      width: 14px; height: 14px; border-radius: 50%; background: #fff;
      box-shadow: 0 0 0 0 rgba(255,255,255,0.7);
      animation: pulse 2s infinite;
      flex-shrink: 0; position: relative; z-index: 1;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
      70% { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
    }
    .banner-text { position: relative; z-index: 1; }
    .banner-title { font-size: 22px; font-weight: 800; letter-spacing: -0.015em; }
    .banner-sub { font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 4px; }
    .banner-meta {
      margin-left: auto; position: relative; z-index: 1;
      font-size: 12px; color: rgba(255,255,255,0.75);
      text-align: right; font-family: 'JetBrains Mono', monospace;
    }
    .banner-meta strong { color: #fff; font-weight: 700; font-size: 14px; display: block; }

    /* Uptime summary */
    .up-strip {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
      margin-bottom: 32px;
    }
    .up-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 18px 20px;
    }
    .up-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .up-value { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }
    .up-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

    /* Services list */
    .section-head {
      display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;
    }
    .section-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; }
    .section-head .legend { font-size: 12px; color: var(--text-muted); display: flex; gap: 14px; align-items: center; }
    .legend-dot { display: inline-flex; align-items: center; gap: 6px; }
    .ld { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
    .ld.ok { background: var(--green); }
    .ld.warn { background: var(--amber); }
    .ld.bad { background: var(--red); }
    .ld.none { background: var(--surface-alt); border: 1px solid var(--border); }

    .services {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      margin-bottom: 40px; box-shadow: var(--shadow-sm);
    }
    .service {
      padding: 18px 24px; border-bottom: 1px solid var(--border);
      display: grid; grid-template-columns: 1fr auto auto; gap: 20px; align-items: center;
    }
    .service:last-child { border-bottom: none; }
    .service:hover { background: var(--surface-subtle); }
    .svc-name { font-weight: 700; font-size: 14.5px; }
    .svc-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    .calendar { display: flex; gap: 2px; align-items: flex-end; }
    .cal-day {
      width: 4px; height: 20px; border-radius: 1px; cursor: pointer;
      transition: transform 0.15s ease;
    }
    .cal-day.ok { background: var(--green); }
    .cal-day.warn { background: var(--amber); }
    .cal-day.bad { background: var(--red); }
    .cal-day.none { background: var(--surface-alt); }
    .cal-day:hover { transform: scaleY(1.15); }

    .svc-status {
      font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .svc-status.ok { background: var(--green-bg); color: var(--green-dark); }
    .svc-status.warn { background: var(--amber-bg); color: #a96f10; }
    .svc-status.bad { background: var(--red-bg); color: var(--red); }
    .svc-status svg { width: 10px; height: 10px; }

    /* Incidents timeline */
    .incidents {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
      box-shadow: var(--shadow-sm); margin-bottom: 40px;
    }
    .inc {
      padding: 22px 24px; border-bottom: 1px solid var(--border);
    }
    .inc:last-child { border-bottom: none; }
    .inc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 8px; flex-wrap: wrap; }
    .inc-title { font-weight: 800; font-size: 15px; }
    .inc-meta { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
    .inc-severity {
      font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
    }
    .inc-severity.minor { background: var(--amber-bg); color: #a96f10; }
    .inc-severity.major { background: var(--red-bg); color: var(--red); }
    .inc-severity.resolved { background: var(--green-bg); color: var(--green-dark); }

    .inc-timeline { margin-top: 14px; padding-left: 4px; }
    .inc-entry {
      display: flex; gap: 10px; padding: 6px 0;
      font-size: 13px; color: var(--text); line-height: 1.5;
      position: relative;
    }
    .inc-entry::before {
      content: ""; position: absolute; left: 4px; top: 15px; bottom: -6px;
      width: 1px; background: var(--border);
    }
    .inc-entry:last-child::before { display: none; }
    .inc-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--surface); border: 2px solid var(--border-strong);
      flex-shrink: 0; margin-top: 5px; position: relative; z-index: 1;
    }
    .inc-entry.resolved .inc-dot { background: var(--green); border-color: var(--green); }
    .inc-entry.investigating .inc-dot { background: var(--amber); border-color: var(--amber); }
    .inc-entry.identified .inc-dot { background: var(--blue); border-color: var(--blue); }
    .inc-body { flex: 1; }
    .inc-body strong { font-weight: 700; font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-right: 8px; }
    .inc-time { color: var(--text-faint); font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-left: 6px; }

    .inc-empty {
      padding: 28px 24px; text-align: center; color: var(--text-muted); font-size: 14px;
    }
    .inc-empty svg { width: 32px; height: 32px; color: var(--green); margin: 0 auto 10px; padding: 6px; background: var(--green-bg); border-radius: 50%; }

    /* Subscribe */
    .subscribe {
      background: linear-gradient(135deg, var(--surface-alt) 0%, var(--blue-pale) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl); padding: 32px 36px;
    }
    .sub-head { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 18px; flex-wrap: wrap; }
    .sub-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 4px; }
    .sub-head p { font-size: 13.5px; color: var(--text-muted); }
    .sub-channels { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .sub-channel {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 14px;
      display: flex; gap: 12px; align-items: center;
      transition: all 0.15s ease; cursor: pointer;
    }
    .sub-channel:hover { border-color: var(--blue); }
    .sub-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
    .sub-icon.email { background: linear-gradient(135deg, var(--blue), var(--blue-bright)); }
    .sub-icon.rss { background: linear-gradient(135deg, #ff6b00, #cc4700); }
    .sub-icon.slack { background: linear-gradient(135deg, #4a154b, #611f5f); }
    .sub-icon svg { width: 16px; height: 16px; }
    .sub-label { font-weight: 700; font-size: 13px; }
    .sub-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    /* Footer */
    .foot {
      max-width: 1000px; margin: 48px auto 0; padding: 28px 32px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px;
      font-size: 13px; color: var(--text-muted);
    }
    .foot-links { display: flex; gap: 16px; }
    .foot-links a:hover { color: var(--text); }

    @media (max-width: 720px) {
      .topbar { padding: 12px 16px; }
      .wrap { padding: 20px 16px; }
      .banner { flex-direction: column; align-items: flex-start; padding: 22px; }
      .banner-meta { text-align: left; margin-left: 0; }
      .up-strip { grid-template-columns: 1fr 1fr; }
      .service { grid-template-columns: 1fr; gap: 10px; }
      .calendar { overflow-x: auto; }
      .sub-channels { grid-template-columns: 1fr; }
    }`;

const MOCK_HTML = `<header class="topbar">
    <a class="tb-brand" href="landing.html">
      <div class="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
      </div>
      <div>
        <div class="tb-brand-name">Tenantory</div>
        <div class="tb-brand-sub">Status</div>
      </div>
    </a>
    <div class="tb-right">
      <a class="btn btn-ghost" href="landing.html">
        Back to Tenantory
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </header>

  <main class="wrap">

    <!-- Status banner -->
    <div class="banner" id="banner">
      <div class="pulse-dot"></div>
      <div class="banner-text">
        <div class="banner-title">All systems operational.</div>
        <div class="banner-sub">Everything is running normally. No active incidents.</div>
      </div>
      <div class="banner-meta">
        <strong id="ts">Apr 14, 2026 · 07:42 ET</strong>
        Updated 18 seconds ago
      </div>
    </div>

    <!-- Uptime strip -->
    <div class="up-strip">
      <div class="up-card">
        <div class="up-label">90-day uptime</div>
        <div class="up-value">99.98%</div>
        <div class="up-sub">Excluding 8 min scheduled window · Mar 24</div>
      </div>
      <div class="up-card">
        <div class="up-label">12-month uptime</div>
        <div class="up-value">99.95%</div>
        <div class="up-sub">Against a 99.9% SLA target</div>
      </div>
      <div class="up-card">
        <div class="up-label">Avg response time</div>
        <div class="up-value">142 <small style="font-size:13px;font-weight:500;color:var(--text-muted);">ms</small></div>
        <div class="up-sub">p50 across all endpoints · 7d</div>
      </div>
      <div class="up-card">
        <div class="up-label">Last incident</div>
        <div class="up-value">12 <small style="font-size:13px;font-weight:500;color:var(--text-muted);">days ago</small></div>
        <div class="up-sub">Minor · resolved in 23 min</div>
      </div>
    </div>

    <!-- Services -->
    <div class="section-head">
      <h2>Services</h2>
      <div class="legend">
        <span class="legend-dot"><span class="ld ok"></span>Operational</span>
        <span class="legend-dot"><span class="ld warn"></span>Degraded</span>
        <span class="legend-dot"><span class="ld bad"></span>Outage</span>
      </div>
    </div>

    <div class="services" id="services">
      <!-- rows injected by JS below -->
    </div>

    <!-- Incidents -->
    <div class="section-head">
      <h2>Recent incidents</h2>
      <a href="#" style="font-size:13px;color:var(--blue);font-weight:600;">Full history</a>
    </div>

    <div class="incidents">

      <div class="inc">
        <div class="inc-head">
          <div>
            <div class="inc-title">Elevated SMS delivery latency</div>
            <div class="inc-meta">Apr 2, 2026 · 14:18–14:41 ET · 23 min · Twilio upstream</div>
          </div>
          <span class="inc-severity resolved">Resolved</span>
        </div>
        <div class="inc-timeline">
          <div class="inc-entry resolved"><div class="inc-dot"></div><div class="inc-body"><strong>Resolved</strong> Twilio's upstream provider recovered. Queued messages flushed in 4 min. <span class="inc-time">14:41 ET</span></div></div>
          <div class="inc-entry identified"><div class="inc-dot"></div><div class="inc-body"><strong>Identified</strong> Twilio reported a US-carrier-side routing issue. We queued messages for automatic retry. <span class="inc-time">14:24 ET</span></div></div>
          <div class="inc-entry investigating"><div class="inc-dot"></div><div class="inc-body"><strong>Investigating</strong> Rent-reminder SMS sending was delayed by 5–10 minutes. Emails unaffected. <span class="inc-time">14:18 ET</span></div></div>
        </div>
      </div>

      <div class="inc">
        <div class="inc-head">
          <div>
            <div class="inc-title">Scheduled: Database maintenance window</div>
            <div class="inc-meta">Mar 24, 2026 · 02:00–02:08 ET · 8 min planned · Supabase upgrade</div>
          </div>
          <span class="inc-severity resolved">Completed</span>
        </div>
        <div class="inc-timeline">
          <div class="inc-entry resolved"><div class="inc-dot"></div><div class="inc-body"><strong>Completed</strong> Upgrade successful. All regions healthy. <span class="inc-time">02:08 ET</span></div></div>
          <div class="inc-entry identified"><div class="inc-dot"></div><div class="inc-body"><strong>Scheduled</strong> 8-minute read-only window to apply a Postgres minor version update. <span class="inc-time">02:00 ET</span></div></div>
        </div>
      </div>

      <div class="inc">
        <div class="inc-head">
          <div>
            <div class="inc-title">Stripe webhook retry spike</div>
            <div class="inc-meta">Mar 12, 2026 · 09:04–09:19 ET · 15 min · Stripe upstream</div>
          </div>
          <span class="inc-severity resolved">Resolved</span>
        </div>
        <div class="inc-timeline">
          <div class="inc-entry resolved"><div class="inc-dot"></div><div class="inc-body"><strong>Resolved</strong> All webhooks replayed successfully. No lost events. <span class="inc-time">09:19 ET</span></div></div>
          <div class="inc-entry identified"><div class="inc-dot"></div><div class="inc-body"><strong>Identified</strong> Stripe's webhook delivery was delayed. Our dead-letter queue caught every event. <span class="inc-time">09:11 ET</span></div></div>
          <div class="inc-entry investigating"><div class="inc-dot"></div><div class="inc-body"><strong>Investigating</strong> Some rent-paid events were arriving with a 30–60s delay. <span class="inc-time">09:04 ET</span></div></div>
        </div>
      </div>

    </div>

    <!-- Subscribe -->
    <div class="subscribe">
      <div class="sub-head">
        <div>
          <h2>Get notified when things change</h2>
          <p>Outages, scheduled maintenance windows, postmortems — delivered when they happen, not the next day.</p>
        </div>
      </div>
      <div class="sub-channels">
        <a class="sub-channel" href="mailto:status-subscribe@tenantory.com">
          <div class="sub-icon email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
          </div>
          <div><div class="sub-label">Email</div><div class="sub-sub">Major incidents only</div></div>
        </a>
        <a class="sub-channel" href="#" onclick="event.preventDefault(); alert('Would open RSS feed at status.tenantory.com/feed.xml');">
          <div class="sub-icon rss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          </div>
          <div><div class="sub-label">RSS / Atom</div><div class="sub-sub">/feed.xml</div></div>
        </a>
        <a class="sub-channel" href="#" onclick="event.preventDefault(); alert('Would open Slack webhook configuration');">
          <div class="sub-icon slack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
          </div>
          <div><div class="sub-label">Slack webhook</div><div class="sub-sub">Pro+ · post to any channel</div></div>
        </a>
      </div>
    </div>

  </main>

  <footer class="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div class="foot-links">
      <a href="landing.html">Home</a>
      <a href="security.html">Security</a>
      <a href="changelog.html">Changelog</a>
      <a href="mailto:support@tenantory.com">Support</a>
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
