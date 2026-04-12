'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Can I switch plans?',
    a: 'Yes, upgrade or downgrade anytime via your dashboard. Changes take effect on your next billing cycle.',
  },
  {
    q: 'Is there a free trial?',
    a: '14-day free trial on any plan, no credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Credit card and ACH via Stripe.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, no contracts. Cancel from your dashboard at any time.',
  },
  {
    q: 'Do my tenants need to pay for anything?',
    a: 'No, tenants use the portal completely free.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          color: '#f5f0e8',
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                borderBottom: '1px solid rgba(245,240,232,0.1)',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#f5f0e8',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {faq.q}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{
                    flexShrink: 0,
                    marginLeft: 16,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#d4a853"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? 200 : 0,
                  transition: 'max-height 0.25s ease',
                }}
              >
                <p
                  style={{
                    color: 'rgba(245,240,232,0.7)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    paddingBottom: 20,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
