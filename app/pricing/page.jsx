import FAQ from './faq';

export const metadata = {
  title: 'PropOS Pricing | Property Management Software',
  description:
    'Affordable property management for rent-by-the-bedroom operators. Plans starting at $97/mo.',
};

/* ── SVG helpers ─────────────────────────────────────────────── */

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 9.5L7.5 13L14 5"
        stroke="#4a7c59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dash() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M5 9H13"
        stroke="rgba(245,240,232,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Data ────────────────────────────────────────────────────── */

const tiers = [
  {
    name: 'Starter',
    price: 97,
    badge: null,
    features: [
      'Up to 10 rooms, 1 property',
      'Lease management + e-signing',
      'Tenant portal with online payments',
      'Automated rent charges + late fees',
      'Move-in / move-out automation',
      'Email notifications',
      'Mobile admin (PWA)',
    ],
  },
  {
    name: 'Growth',
    price: 197,
    badge: 'Most Popular',
    features: [
      'Everything in Starter, plus:',
      'Up to 30 rooms, unlimited properties',
      'AI receipt scanning (OCR)',
      'SMS notifications (Twilio)',
      'QuickBooks export',
      'A/R aging + financial calculators',
      'Bulk actions',
      'Custom reports',
    ],
  },
  {
    name: 'Scale',
    price: 397,
    badge: null,
    features: [
      'Everything in Growth, plus:',
      'Unlimited rooms',
      'White-label branding',
      'Banker portal (rent roll PDF, DSCR)',
      'AI leasing agent',
      'API access',
      'Construction draw management (BuildLend)',
      'Dedicated support',
    ],
  },
];

const comparisonFeatures = [
  { label: 'Rooms', starter: '10', growth: '30', scale: 'Unlimited' },
  { label: 'Properties', starter: '1', growth: 'Unlimited', scale: 'Unlimited' },
  { label: 'Lease management + e-signing', starter: true, growth: true, scale: true },
  { label: 'Tenant portal + online payments', starter: true, growth: true, scale: true },
  { label: 'Automated rent charges + late fees', starter: true, growth: true, scale: true },
  { label: 'Move-in / move-out automation', starter: true, growth: true, scale: true },
  { label: 'Email notifications', starter: true, growth: true, scale: true },
  { label: 'Mobile admin (PWA)', starter: true, growth: true, scale: true },
  { label: 'AI receipt scanning (OCR)', starter: false, growth: true, scale: true },
  { label: 'SMS notifications (Twilio)', starter: false, growth: true, scale: true },
  { label: 'QuickBooks export', starter: false, growth: true, scale: true },
  { label: 'A/R aging + financial calculators', starter: false, growth: true, scale: true },
  { label: 'Bulk actions', starter: false, growth: true, scale: true },
  { label: 'Custom reports', starter: false, growth: true, scale: true },
  { label: 'White-label branding', starter: false, growth: false, scale: true },
  { label: 'Banker portal (rent roll PDF, DSCR)', starter: false, growth: false, scale: true },
  { label: 'AI leasing agent', starter: false, growth: false, scale: true },
  { label: 'API access', starter: false, growth: false, scale: true },
  { label: 'Construction draw management', starter: false, growth: false, scale: true },
  { label: 'Dedicated support', starter: false, growth: false, scale: true },
];

/* ── Styles ──────────────────────────────────────────────────── */

const page = {
  background: '#1a1714',
  color: '#f5f0e8',
  minHeight: '100vh',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const container = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '0 24px',
};

const heroSection = {
  textAlign: 'center',
  padding: '96px 24px 64px',
};

const heroH1 = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
  color: '#f5f0e8',
  marginBottom: 16,
  lineHeight: 1.15,
};

const heroSub = {
  fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
  color: 'rgba(245,240,232,0.7)',
  maxWidth: 600,
  margin: '0 auto 32px',
  lineHeight: 1.6,
};

const ctaBtn = {
  display: 'inline-block',
  background: '#d4a853',
  color: '#1a1714',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '14px 32px',
  borderRadius: 8,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

const cardsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  padding: '0 24px 80px',
  maxWidth: 1120,
  margin: '0 auto',
};

/* ── Component ───────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div style={page}>
      {/* ─── Hero ─── */}
      <section style={heroSection}>
        <h1 style={heroH1}>Property management that runs itself</h1>
        <p style={heroSub}>
          Built for rent-by-the-bedroom operators. Automate leasing, accounting,
          maintenance, and tenant communication.
        </p>
        <a href="#pricing" style={ctaBtn}>
          Start Free Trial
        </a>
      </section>

      {/* ─── Pricing Cards ─── */}
      <div id="pricing" style={cardsGrid}>
        {tiers.map((tier) => {
          const highlighted = tier.badge === 'Most Popular';
          return (
            <div
              key={tier.name}
              style={{
                background: highlighted
                  ? 'linear-gradient(160deg, rgba(212,168,83,0.12), rgba(212,168,83,0.04))'
                  : 'rgba(245,240,232,0.04)',
                border: highlighted
                  ? '2px solid #d4a853'
                  : '1px solid rgba(245,240,232,0.08)',
                borderRadius: 16,
                padding: '40px 32px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {tier.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#d4a853',
                    color: '#1a1714',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 16px',
                    borderRadius: 20,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.badge}
                </span>
              )}

              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.5rem',
                  color: '#f5f0e8',
                  marginBottom: 8,
                }}
              >
                {tier.name}
              </h3>

              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: '#d4a853',
                  }}
                >
                  ${tier.price}
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    color: 'rgba(245,240,232,0.5)',
                    marginLeft: 4,
                  }}
                >
                  /mo
                </span>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {tier.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '0.9rem',
                      color: 'rgba(245,240,232,0.8)',
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: 2 }}>
                      <Check />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://rentblackbear.com/sign-in"
                data-tier={tier.name.toLowerCase()}
                style={{
                  ...ctaBtn,
                  textAlign: 'center',
                  width: '100%',
                  background: highlighted ? '#d4a853' : 'transparent',
                  color: highlighted ? '#1a1714' : '#d4a853',
                  border: highlighted ? 'none' : '2px solid #d4a853',
                }}
              >
                Get Started
              </a>
            </div>
          );
        })}
      </div>

      {/* ─── Feature Comparison Table ─── */}
      <section style={{ ...container, paddingBottom: 80 }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            color: '#f5f0e8',
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          Compare Plans
        </h2>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              minWidth: 640,
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    color: 'rgba(245,240,232,0.5)',
                    fontWeight: 600,
                    borderBottom: '1px solid rgba(245,240,232,0.1)',
                  }}
                >
                  Feature
                </th>
                {['Starter', 'Growth', 'Scale'].map((t) => (
                  <th
                    key={t}
                    style={{
                      textAlign: 'center',
                      padding: '12px 16px',
                      color: '#d4a853',
                      fontWeight: 700,
                      borderBottom: '1px solid rgba(245,240,232,0.1)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, i) => (
                <tr
                  key={row.label}
                  style={{
                    background:
                      i % 2 === 0 ? 'transparent' : 'rgba(245,240,232,0.02)',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      color: 'rgba(245,240,232,0.8)',
                      borderBottom: '1px solid rgba(245,240,232,0.05)',
                    }}
                  >
                    {row.label}
                  </td>
                  {['starter', 'growth', 'scale'].map((key) => (
                    <td
                      key={key}
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(245,240,232,0.05)',
                        color: 'rgba(245,240,232,0.7)',
                      }}
                    >
                      {row[key] === true ? (
                        <Check />
                      ) : row[key] === false ? (
                        <Dash />
                      ) : (
                        row[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <FAQ />

      {/* ─── CTA Footer ─── */}
      <section
        style={{
          textAlign: 'center',
          padding: '64px 24px 96px',
          borderTop: '1px solid rgba(245,240,232,0.08)',
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#f5f0e8',
            marginBottom: 16,
          }}
        >
          Ready to automate your rentals?
        </h2>
        <p
          style={{
            color: 'rgba(245,240,232,0.6)',
            marginBottom: 32,
            fontSize: '1rem',
          }}
        >
          Start your 14-day free trial. No credit card required.
        </p>
        <a
          href="https://rentblackbear.com/sign-in"
          data-tier="trial"
          style={ctaBtn}
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
