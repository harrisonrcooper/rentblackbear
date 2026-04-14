"use client";

// Mock ported from ~/Desktop/tenantory/status.html.
// HTML converted to JSX via /tmp/mock-porter/port.js:
//   class/for/tabindex/... attrs mapped to JSX names
//   inline style strings parsed to JS objects
//   void elements self-closed; inline event handlers stripped
//   <script>/<title>/<meta>/<link> removed
// Original <style> blocks are injected via dangerouslySetInnerHTML
// so the mock CSS doesn't get re-parsed as JSX.

const MOCK_CSS = "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }\n    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: var(--text); background: var(--surface); line-height: 1.5; font-size: 15px; }\n    a { color: inherit; text-decoration: none; }\n    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }\n    img, svg { display: block; max-width: 100%; }\n\n    :root {\n      --navy: #2F3E83; --navy-dark: #1e2a5e; --navy-darker: #14204a;\n      --blue: #1251AD; --blue-bright: #1665D8;\n      --blue-pale: #eef3ff;\n      --pink: #FF4998; --pink-bg: rgba(255,73,152,0.12);\n      --text: #1a1f36; --text-muted: #5a6478; --text-faint: #8a93a5;\n      --surface: #ffffff; --surface-alt: #f7f9fc; --surface-subtle: #fafbfd;\n      --border: #e3e8ef; --border-strong: #c9d1dd;\n      --green: #1ea97c; --green-dark: #138a60; --green-bg: rgba(30,169,124,0.12);\n      --amber: #f5a623; --amber-bg: rgba(245,166,35,0.12);\n      --red: #d64545; --red-bg: rgba(214,69,69,0.1);\n      --radius: 10px; --radius-lg: 14px; --radius-xl: 20px;\n      --shadow-sm: 0 1px 2px rgba(26,31,54,0.04);\n      --shadow: 0 4px 18px rgba(26,31,54,0.07);\n    }\n\n    /* Topbar */\n    .topbar {\n      background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(12px);\n      border-bottom: 1px solid var(--border);\n      padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;\n      position: sticky; top: 0; z-index: 50;\n    }\n    .tb-brand { display: flex; align-items: center; gap: 10px; }\n    .tb-logo { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--blue-bright), var(--pink)); display: flex; align-items: center; justify-content: center; color: #fff; }\n    .tb-logo svg { width: 18px; height: 18px; }\n    .tb-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; }\n    .tb-brand-sub { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 1px; letter-spacing: 0.04em; }\n    .tb-right { display: flex; gap: 10px; align-items: center; }\n    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 100px; font-weight: 600; font-size: 13px; transition: all 0.15s ease; }\n    .btn svg { width: 14px; height: 14px; }\n    .btn-ghost { color: var(--text); border: 1px solid var(--border); background: var(--surface); }\n    .btn-ghost:hover { border-color: var(--blue); color: var(--blue); }\n\n    /* Main layout */\n    .wrap { max-width: 1000px; margin: 0 auto; padding: 36px 32px 60px; }\n\n    /* Summary banner */\n    .banner {\n      background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);\n      color: #fff; border-radius: var(--radius-xl);\n      padding: 28px 32px;\n      display: flex; align-items: center; gap: 20px;\n      box-shadow: 0 14px 40px rgba(30,169,124,0.22);\n      margin-bottom: 32px; position: relative; overflow: hidden;\n    }\n    .banner.degraded { background: linear-gradient(135deg, var(--amber), #c47913); box-shadow: 0 14px 40px rgba(245,166,35,0.28); }\n    .banner.down { background: linear-gradient(135deg, var(--red), #a93333); box-shadow: 0 14px 40px rgba(214,69,69,0.28); }\n    .banner::after {\n      content: \"\"; position: absolute; top: -40px; right: -40px;\n      width: 200px; height: 200px; border-radius: 50%;\n      background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);\n    }\n    .pulse-dot {\n      width: 14px; height: 14px; border-radius: 50%; background: #fff;\n      box-shadow: 0 0 0 0 rgba(255,255,255,0.7);\n      animation: pulse 2s infinite;\n      flex-shrink: 0; position: relative; z-index: 1;\n    }\n    @keyframes pulse {\n      0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }\n      70% { box-shadow: 0 0 0 14px rgba(255,255,255,0); }\n      100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }\n    }\n    .banner-text { position: relative; z-index: 1; }\n    .banner-title { font-size: 22px; font-weight: 800; letter-spacing: -0.015em; }\n    .banner-sub { font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 4px; }\n    .banner-meta {\n      margin-left: auto; position: relative; z-index: 1;\n      font-size: 12px; color: rgba(255,255,255,0.75);\n      text-align: right; font-family: 'JetBrains Mono', monospace;\n    }\n    .banner-meta strong { color: #fff; font-weight: 700; font-size: 14px; display: block; }\n\n    /* Uptime summary */\n    .up-strip {\n      display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;\n      margin-bottom: 32px;\n    }\n    .up-card {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-lg); padding: 18px 20px;\n    }\n    .up-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }\n    .up-value { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); font-variant-numeric: tabular-nums; }\n    .up-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }\n\n    /* Services list */\n    .section-head {\n      display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;\n    }\n    .section-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; }\n    .section-head .legend { font-size: 12px; color: var(--text-muted); display: flex; gap: 14px; align-items: center; }\n    .legend-dot { display: inline-flex; align-items: center; gap: 6px; }\n    .ld { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }\n    .ld.ok { background: var(--green); }\n    .ld.warn { background: var(--amber); }\n    .ld.bad { background: var(--red); }\n    .ld.none { background: var(--surface-alt); border: 1px solid var(--border); }\n\n    .services {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      margin-bottom: 40px; box-shadow: var(--shadow-sm);\n    }\n    .service {\n      padding: 18px 24px; border-bottom: 1px solid var(--border);\n      display: grid; grid-template-columns: 1fr auto auto; gap: 20px; align-items: center;\n    }\n    .service:last-child { border-bottom: none; }\n    .service:hover { background: var(--surface-subtle); }\n    .svc-name { font-weight: 700; font-size: 14.5px; }\n    .svc-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }\n\n    .calendar { display: flex; gap: 2px; align-items: flex-end; }\n    .cal-day {\n      width: 4px; height: 20px; border-radius: 1px; cursor: pointer;\n      transition: transform 0.15s ease;\n    }\n    .cal-day.ok { background: var(--green); }\n    .cal-day.warn { background: var(--amber); }\n    .cal-day.bad { background: var(--red); }\n    .cal-day.none { background: var(--surface-alt); }\n    .cal-day:hover { transform: scaleY(1.15); }\n\n    .svc-status {\n      font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;\n      display: inline-flex; align-items: center; gap: 5px;\n    }\n    .svc-status.ok { background: var(--green-bg); color: var(--green-dark); }\n    .svc-status.warn { background: var(--amber-bg); color: #a96f10; }\n    .svc-status.bad { background: var(--red-bg); color: var(--red); }\n    .svc-status svg { width: 10px; height: 10px; }\n\n    /* Incidents timeline */\n    .incidents {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius-xl); overflow: hidden;\n      box-shadow: var(--shadow-sm); margin-bottom: 40px;\n    }\n    .inc {\n      padding: 22px 24px; border-bottom: 1px solid var(--border);\n    }\n    .inc:last-child { border-bottom: none; }\n    .inc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 8px; flex-wrap: wrap; }\n    .inc-title { font-weight: 800; font-size: 15px; }\n    .inc-meta { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }\n    .inc-severity {\n      font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 100px;\n      text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;\n    }\n    .inc-severity.minor { background: var(--amber-bg); color: #a96f10; }\n    .inc-severity.major { background: var(--red-bg); color: var(--red); }\n    .inc-severity.resolved { background: var(--green-bg); color: var(--green-dark); }\n\n    .inc-timeline { margin-top: 14px; padding-left: 4px; }\n    .inc-entry {\n      display: flex; gap: 10px; padding: 6px 0;\n      font-size: 13px; color: var(--text); line-height: 1.5;\n      position: relative;\n    }\n    .inc-entry::before {\n      content: \"\"; position: absolute; left: 4px; top: 15px; bottom: -6px;\n      width: 1px; background: var(--border);\n    }\n    .inc-entry:last-child::before { display: none; }\n    .inc-dot {\n      width: 9px; height: 9px; border-radius: 50%;\n      background: var(--surface); border: 2px solid var(--border-strong);\n      flex-shrink: 0; margin-top: 5px; position: relative; z-index: 1;\n    }\n    .inc-entry.resolved .inc-dot { background: var(--green); border-color: var(--green); }\n    .inc-entry.investigating .inc-dot { background: var(--amber); border-color: var(--amber); }\n    .inc-entry.identified .inc-dot { background: var(--blue); border-color: var(--blue); }\n    .inc-body { flex: 1; }\n    .inc-body strong { font-weight: 700; font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-right: 8px; }\n    .inc-time { color: var(--text-faint); font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-left: 6px; }\n\n    .inc-empty {\n      padding: 28px 24px; text-align: center; color: var(--text-muted); font-size: 14px;\n    }\n    .inc-empty svg { width: 32px; height: 32px; color: var(--green); margin: 0 auto 10px; padding: 6px; background: var(--green-bg); border-radius: 50%; }\n\n    /* Subscribe */\n    .subscribe {\n      background: linear-gradient(135deg, var(--surface-alt) 0%, var(--blue-pale) 100%);\n      border: 1px solid var(--border);\n      border-radius: var(--radius-xl); padding: 32px 36px;\n    }\n    .sub-head { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 18px; flex-wrap: wrap; }\n    .sub-head h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; margin-bottom: 4px; }\n    .sub-head p { font-size: 13.5px; color: var(--text-muted); }\n    .sub-channels { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }\n    .sub-channel {\n      background: var(--surface); border: 1px solid var(--border);\n      border-radius: var(--radius); padding: 14px;\n      display: flex; gap: 12px; align-items: center;\n      transition: all 0.15s ease; cursor: pointer;\n    }\n    .sub-channel:hover { border-color: var(--blue); }\n    .sub-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }\n    .sub-icon.email { background: linear-gradient(135deg, var(--blue), var(--blue-bright)); }\n    .sub-icon.rss { background: linear-gradient(135deg, #ff6b00, #cc4700); }\n    .sub-icon.slack { background: linear-gradient(135deg, #4a154b, #611f5f); }\n    .sub-icon svg { width: 16px; height: 16px; }\n    .sub-label { font-weight: 700; font-size: 13px; }\n    .sub-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }\n\n    /* Footer */\n    .foot {\n      max-width: 1000px; margin: 48px auto 0; padding: 28px 32px;\n      border-top: 1px solid var(--border);\n      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px;\n      font-size: 13px; color: var(--text-muted);\n    }\n    .foot-links { display: flex; gap: 16px; }\n    .foot-links a:hover { color: var(--text); }\n\n    @media (max-width: 720px) {\n      .topbar { padding: 12px 16px; }\n      .wrap { padding: 20px 16px; }\n      .banner { flex-direction: column; align-items: flex-start; padding: 22px; }\n      .banner-meta { text-align: left; margin-left: 0; }\n      .up-strip { grid-template-columns: 1fr 1fr; }\n      .service { grid-template-columns: 1fr; gap: 10px; }\n      .calendar { overflow-x: auto; }\n      .sub-channels { grid-template-columns: 1fr; }\n    }\n  ";

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: MOCK_CSS}} />
      

  <header className="topbar">
    <a className="tb-brand" href="landing.html">
      <div className="tb-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 3l9 9" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
      </div>
      <div>
        <div className="tb-brand-name">Tenantory</div>
        <div className="tb-brand-sub">Status</div>
      </div>
    </a>
    <div className="tb-right">
      <a className="btn btn-ghost" href="landing.html">
        Back to Tenantory
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </div>
  </header>

  <main className="wrap">

    
    <div className="banner" id="banner">
      <div className="pulse-dot" />
      <div className="banner-text">
        <div className="banner-title">All systems operational.</div>
        <div className="banner-sub">Everything is running normally. No active incidents.</div>
      </div>
      <div className="banner-meta">
        <strong id="ts">Apr 14, 2026 · 07:42 ET</strong>
        Updated 18 seconds ago
      </div>
    </div>

    
    <div className="up-strip">
      <div className="up-card">
        <div className="up-label">90-day uptime</div>
        <div className="up-value">99.98%</div>
        <div className="up-sub">Excluding 8 min scheduled window · Mar 24</div>
      </div>
      <div className="up-card">
        <div className="up-label">12-month uptime</div>
        <div className="up-value">99.95%</div>
        <div className="up-sub">Against a 99.9% SLA target</div>
      </div>
      <div className="up-card">
        <div className="up-label">Avg response time</div>
        <div className="up-value">142 <small style={{fontSize: "13px", fontWeight: "500", color: "var(--text-muted)"}}>ms</small></div>
        <div className="up-sub">p50 across all endpoints · 7d</div>
      </div>
      <div className="up-card">
        <div className="up-label">Last incident</div>
        <div className="up-value">12 <small style={{fontSize: "13px", fontWeight: "500", color: "var(--text-muted)"}}>days ago</small></div>
        <div className="up-sub">Minor · resolved in 23 min</div>
      </div>
    </div>

    
    <div className="section-head">
      <h2>Services</h2>
      <div className="legend">
        <span className="legend-dot"><span className="ld ok" />Operational</span>
        <span className="legend-dot"><span className="ld warn" />Degraded</span>
        <span className="legend-dot"><span className="ld bad" />Outage</span>
      </div>
    </div>

    <div className="services" id="services" />

    
    <div className="section-head">
      <h2>Recent incidents</h2>
      <a href="#" style={{fontSize: "13px", color: "var(--blue)", fontWeight: "600"}}>Full history</a>
    </div>

    <div className="incidents">

      <div className="inc">
        <div className="inc-head">
          <div>
            <div className="inc-title">Elevated SMS delivery latency</div>
            <div className="inc-meta">Apr 2, 2026 · 14:18–14:41 ET · 23 min · Twilio upstream</div>
          </div>
          <span className="inc-severity resolved">Resolved</span>
        </div>
        <div className="inc-timeline">
          <div className="inc-entry resolved"><div className="inc-dot" /><div className="inc-body"><strong>Resolved</strong> Twilio's upstream provider recovered. Queued messages flushed in 4 min. <span className="inc-time">14:41 ET</span></div></div>
          <div className="inc-entry identified"><div className="inc-dot" /><div className="inc-body"><strong>Identified</strong> Twilio reported a US-carrier-side routing issue. We queued messages for automatic retry. <span className="inc-time">14:24 ET</span></div></div>
          <div className="inc-entry investigating"><div className="inc-dot" /><div className="inc-body"><strong>Investigating</strong> Rent-reminder SMS sending was delayed by 5–10 minutes. Emails unaffected. <span className="inc-time">14:18 ET</span></div></div>
        </div>
      </div>

      <div className="inc">
        <div className="inc-head">
          <div>
            <div className="inc-title">Scheduled: Database maintenance window</div>
            <div className="inc-meta">Mar 24, 2026 · 02:00–02:08 ET · 8 min planned · Supabase upgrade</div>
          </div>
          <span className="inc-severity resolved">Completed</span>
        </div>
        <div className="inc-timeline">
          <div className="inc-entry resolved"><div className="inc-dot" /><div className="inc-body"><strong>Completed</strong> Upgrade successful. All regions healthy. <span className="inc-time">02:08 ET</span></div></div>
          <div className="inc-entry identified"><div className="inc-dot" /><div className="inc-body"><strong>Scheduled</strong> 8-minute read-only window to apply a Postgres minor version update. <span className="inc-time">02:00 ET</span></div></div>
        </div>
      </div>

      <div className="inc">
        <div className="inc-head">
          <div>
            <div className="inc-title">Stripe webhook retry spike</div>
            <div className="inc-meta">Mar 12, 2026 · 09:04–09:19 ET · 15 min · Stripe upstream</div>
          </div>
          <span className="inc-severity resolved">Resolved</span>
        </div>
        <div className="inc-timeline">
          <div className="inc-entry resolved"><div className="inc-dot" /><div className="inc-body"><strong>Resolved</strong> All webhooks replayed successfully. No lost events. <span className="inc-time">09:19 ET</span></div></div>
          <div className="inc-entry identified"><div className="inc-dot" /><div className="inc-body"><strong>Identified</strong> Stripe's webhook delivery was delayed. Our dead-letter queue caught every event. <span className="inc-time">09:11 ET</span></div></div>
          <div className="inc-entry investigating"><div className="inc-dot" /><div className="inc-body"><strong>Investigating</strong> Some rent-paid events were arriving with a 30–60s delay. <span className="inc-time">09:04 ET</span></div></div>
        </div>
      </div>

    </div>

    
    <div className="subscribe">
      <div className="sub-head">
        <div>
          <h2>Get notified when things change</h2>
          <p>Outages, scheduled maintenance windows, postmortems — delivered when they happen, not the next day.</p>
        </div>
      </div>
      <div className="sub-channels">
        <a className="sub-channel" href="mailto:status-subscribe@tenantory.com">
          <div className="sub-icon email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
          </div>
          <div><div className="sub-label">Email</div><div className="sub-sub">Major incidents only</div></div>
        </a>
        <a className="sub-channel" href="#">
          <div className="sub-icon rss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
          </div>
          <div><div className="sub-label">RSS / Atom</div><div className="sub-sub">/feed.xml</div></div>
        </a>
        <a className="sub-channel" href="#">
          <div className="sub-icon slack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="13" y2="16" /></svg>
          </div>
          <div><div className="sub-label">Slack webhook</div><div className="sub-sub">Pro+ · post to any channel</div></div>
        </a>
      </div>
    </div>

  </main>

  <footer className="foot">
    <div>&copy; 2026 Tenantory · Built in Huntsville, AL</div>
    <div className="foot-links">
      <a href="landing.html">Home</a>
      <a href="security.html">Security</a>
      <a href="changelog.html">Changelog</a>
      <a href="mailto:support@tenantory.com">Support</a>
    </div>
  </footer>

  

    </>
  );
}
