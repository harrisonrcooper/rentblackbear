export const metadata = {
  title: 'Changelog | PropOS',
  description: 'Recent updates and new features in PropOS property management platform.',
  openGraph: {
    title: 'Changelog | PropOS',
    description: 'Recent updates and new features in PropOS property management platform.',
    type: 'website',
  },
};

const ENTRIES = [
  {
    date: 'April 2026',
    items: [
      {
        title: 'Admin Authentication via Clerk',
        desc: 'Secure sign-in for property managers with role-based access control and session management.',
      },
      {
        title: 'Stripe Webhook Integration',
        desc: 'Automatic payment reconciliation — rent payments are matched to leases in real time.',
      },
      {
        title: 'Lease PDF Generation',
        desc: 'Download fully executed leases as professional PDF documents, ready for your records.',
      },
      {
        title: 'Mobile Expense Entry',
        desc: 'Full-screen 9-step expense flow with Schedule E categories. Log expenses on the go from any device.',
      },
      {
        title: 'Automated Move-In Chain',
        desc: 'On lease execution: security deposit charge, prorated rent, door code, portal invite, and welcome email — all triggered automatically.',
      },
      {
        title: 'Lease Renewal Workflow',
        desc: '60-90 day advance prompts with one-click renewal draft generation for expiring leases.',
      },
      {
        title: 'Move-Out Chain',
        desc: 'Checklist-driven move-out with security deposit reconciliation and Alabama 60-day compliance tracking.',
      },
      {
        title: 'Maintenance Management',
        desc: 'Admin tab with vendor assignment, cost tracking, and status pipeline from request to resolution.',
      },
      {
        title: 'Financial Calculators',
        desc: 'Cap rate, break-even occupancy, and rent-to-income ratio tools built into the admin dashboard.',
      },
      {
        title: 'Rent Roll PDF',
        desc: 'One-click download of your current rent roll — formatted and ready for your banker.',
      },
      {
        title: 'A/R Aging Report',
        desc: 'Accounts receivable broken into 30/60/90+ day buckets for clear visibility on outstanding balances.',
      },
      {
        title: 'QuickBooks Export',
        desc: 'Schedule E account mapping with one-click export to QuickBooks-compatible format.',
      },
      {
        title: '1099 Vendor Report + Year-End Tax Package',
        desc: 'Generate 1099 vendor summaries and a complete year-end tax package for your accountant.',
      },
      {
        title: 'SMS Notifications via Twilio',
        desc: 'Tenants and managers receive real-time SMS updates for payments, maintenance, and lease events.',
      },
      {
        title: 'Payment Receipt Emails',
        desc: 'Automatic email receipts sent to tenants after every successful payment.',
      },
      {
        title: 'Late Payment Warnings + Lease Signing Reminders',
        desc: 'Automated notices for overdue rent and pending lease signatures to keep things on track.',
      },
      {
        title: 'FCRA Adverse Action Notices',
        desc: 'Compliant adverse action letters generated automatically when screening results require denial.',
      },
      {
        title: 'Multi-Tenant Workspace Isolation',
        desc: 'Each property management company operates in a fully isolated workspace with its own data boundary.',
      },
      {
        title: 'Subscription Billing Infrastructure',
        desc: 'Stripe-powered subscription management with plan tiers, upgrades, and usage tracking.',
      },
      {
        title: 'Feature Flags + Tier Gating',
        desc: 'Granular feature access control tied to subscription plans — upgrade prompts built in.',
      },
      {
        title: 'Listings JSON Feed + SEO + Sitemap',
        desc: 'Structured data feed for listings, search engine optimization, and automatic sitemap generation.',
      },
      {
        title: 'Framer Motion Animations Throughout',
        desc: 'Smooth page transitions and micro-interactions across the entire application.',
      },
    ],
  },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', flexShrink: 0 }}>
      <circle cx="9" cy="9" r="9" fill="#d4a853" opacity="0.15" />
      <path d="M5.5 9.5l2 2 5-5" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1714', color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(212, 168, 83, 0.15)', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#d4a853', fontFamily: "'DM Serif Display', serif", fontSize: '24px' }}>
            PropOS
          </a>
          <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <a href="/support" style={{ color: '#f5f0e8', textDecoration: 'none', opacity: 0.7 }}>Support</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '48px', fontWeight: 400, marginBottom: '12px', color: '#f5f0e8' }}>
          Changelog
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(245, 240, 232, 0.6)', marginBottom: '56px', maxWidth: '600px', lineHeight: 1.6 }}>
          New features, improvements, and updates to PropOS.
        </p>

        {ENTRIES.map((group) => (
          <section key={group.date} style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', fontWeight: 400, color: '#d4a853', margin: 0 }}>
                {group.date}
              </h2>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(212, 168, 83, 0.2)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {group.items.map((item, i) => (
                <article
                  key={i}
                  style={{
                    backgroundColor: 'rgba(245, 240, 232, 0.03)',
                    border: '1px solid rgba(212, 168, 83, 0.1)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckIcon />
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#f5f0e8' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(245, 240, 232, 0.55)', margin: 0, lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(212, 168, 83, 0.1)', padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(245, 240, 232, 0.35)', margin: 0 }}>
          PropOS — Property management, simplified.
        </p>
      </footer>
    </div>
  );
}
