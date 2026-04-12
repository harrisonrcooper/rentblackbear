export const metadata = {
  title: 'Support | PropOS',
  description: 'Get help with PropOS. Contact support, report bugs, or request features.',
  openGraph: {
    title: 'Support | PropOS',
    description: 'Get help with PropOS. Contact support, report bugs, or request features.',
    type: 'website',
  },
};

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#d4a853" strokeWidth="1.5" />
      <path d="M2 7l10 7 10-7" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="#d4a853" strokeWidth="1.5" />
      <path d="M12 6v6l4 2" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9 21h6M12 3a6 6 0 00-4 10.47V17a1 1 0 001 1h6a1 1 0 001-1v-3.53A6 6 0 0012 3z" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="6" y="8" width="12" height="12" rx="6" stroke="#d4a853" strokeWidth="1.5" />
      <path d="M12 8V4M6 12H2M22 12h-4M6 16H3M21 16h-3M8 8L5 5M16 8l3-3" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8v12M8 14h8" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const CARDS = [
  {
    icon: <MailIcon />,
    title: 'Email Support',
    body: (
      <>
        Reach us at{' '}
        <a href="mailto:support@propos.app" style={{ color: '#d4a853', textDecoration: 'none', fontWeight: 600 }}>
          support@propos.app
        </a>
      </>
    ),
  },
  {
    icon: <ClockIcon />,
    title: 'Response Time',
    body: 'We typically respond within 24 hours on business days.',
  },
  {
    icon: <LinkIcon />,
    title: 'FAQ',
    body: (
      <>
        Check our{' '}
        <a href="/pricing#faq" style={{ color: '#d4a853', textDecoration: 'none', fontWeight: 600 }}>
          frequently asked questions
        </a>{' '}
        for quick answers.
      </>
    ),
  },
  {
    icon: <LightbulbIcon />,
    title: 'Feature Requests',
    body: 'Have an idea for PropOS? Email us your suggestions — we read every one.',
  },
  {
    icon: <BugIcon />,
    title: 'Bug Reports',
    body: 'Found something broken? Email us with screenshots and steps to reproduce.',
  },
];

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1714', color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(212, 168, 83, 0.15)', padding: '20px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#d4a853', fontFamily: "'DM Serif Display', serif", fontSize: '24px' }}>
            PropOS
          </a>
          <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <a href="/changelog" style={{ color: '#f5f0e8', textDecoration: 'none', opacity: 0.7 }}>Changelog</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '48px', fontWeight: 400, marginBottom: '12px', color: '#f5f0e8' }}>
          Need help?
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(245, 240, 232, 0.6)', marginBottom: '48px', maxWidth: '520px', lineHeight: 1.6 }}>
          We are here to help you get the most out of PropOS. Reach out anytime.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(245, 240, 232, 0.03)',
                border: '1px solid rgba(212, 168, 83, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              {card.icon}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#f5f0e8' }}>
                  {card.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(245, 240, 232, 0.55)', margin: 0, lineHeight: 1.6 }}>
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
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
