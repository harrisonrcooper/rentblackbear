{/* Review with attorney before relying on these terms */}
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | PropOS',
  description:
    'Privacy Policy for PropOS. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <header
        style={{
          background: '#1a1a1a',
          padding: '1rem 2rem',
        }}
      >
        <Link
          href="/"
          style={{
            color: '#d4a853',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          PropOS
        </Link>
      </header>

      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '3rem 1.5rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '15px',
          lineHeight: 1.7,
          color: '#222',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          Last updated: April 2026
        </p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              <strong>Account information</strong> -- your name, email address,
              and other details you provide during registration
            </li>
            <li>
              <strong>Property and tenant data</strong> -- information you enter
              into PropOS about your properties, tenants, leases, and
              maintenance requests
            </li>
            <li>
              <strong>Usage data</strong> -- analytics about how you interact
              with the Service, including pages visited, features used, and
              session duration
            </li>
            <li>
              <strong>Payment information</strong> -- billing details processed
              by Stripe. We do not store credit card numbers on our servers.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            2. How We Use Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Provide, operate, and maintain the Service</li>
            <li>
              Send transactional notifications related to your account and
              properties
            </li>
            <li>Improve and develop new features for the Service</li>
            <li>Process billing and manage your subscription</li>
            <li>Respond to support requests and communicate with you</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>3. Data Sharing</h2>
          <p>
            We share data with the following third-party service providers
            solely to operate the Service:
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              <strong>Stripe</strong> -- payment processing
            </li>
            <li>
              <strong>Resend</strong> -- transactional email delivery
            </li>
            <li>
              <strong>Twilio</strong> -- SMS notifications
            </li>
            <li>
              <strong>Supabase</strong> -- database hosting and storage
            </li>
            <li>
              <strong>Clerk</strong> -- authentication and identity management
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal
            information to third parties.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>4. Data Security</h2>
          <p>
            We take reasonable measures to protect your data, including
            encryption of data in transit via HTTPS, role-based access
            controls for internal systems, and regular data backups. While we
            strive to protect your information, no method of electronic
            transmission or storage is completely secure.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>5. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. Upon
            account termination, your data will be retained for thirty (30)
            days to allow for export, after which it will be permanently
            deleted from our systems.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data at any time through the Service</li>
            <li>Opt out of marketing emails</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:support@propos.app" style={{ color: '#d4a853' }}>
              support@propos.app
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>7. Cookies</h2>
          <p>
            PropOS uses minimal cookies strictly for authentication session
            management. We do not use tracking cookies, advertising cookies,
            or third-party analytics cookies.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>8. Children</h2>
          <p>
            PropOS is not intended for use by individuals under the age of 18.
            We do not knowingly collect personal information from children. If
            we become aware that we have collected data from a child under 18,
            we will take steps to delete that information promptly.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we make
            material changes, we will notify you via the email address
            associated with your account. Your continued use of the Service
            after notification constitutes acceptance of the updated policy.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>10. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at{' '}
            <a href="mailto:support@propos.app" style={{ color: '#d4a853' }}>
              support@propos.app
            </a>
            .
          </p>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '2.5rem 0' }} />
        <p style={{ fontSize: '0.875rem', color: '#888' }}>
          <Link href="/terms" style={{ color: '#d4a853' }}>
            Terms of Service
          </Link>
        </p>
      </main>
    </>
  );
}
