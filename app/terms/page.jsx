{/* Review with attorney before relying on these terms */}
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | PropOS',
  description:
    'Terms of Service for PropOS, a cloud-based property management platform.',
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          Last updated: April 2026
        </p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using PropOS ("Service"), you agree to be bound by
            these Terms of Service ("Terms"). If you do not agree to these
            Terms, do not use the Service. Your continued use of PropOS
            constitutes acceptance of these Terms and any future amendments.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>2. Description of Service</h2>
          <p>
            PropOS is a cloud-based property management platform that enables
            landlords, property managers, and operators to manage rental
            properties, tenants, leases, maintenance requests, and related
            operations. Features and functionality may change over time as we
            continue to develop the Service.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>3. Account Registration</h2>
          <p>
            To use PropOS, you must create an account and provide accurate,
            complete, and current information. You are responsible for
            maintaining the confidentiality of your login credentials. Each
            individual may maintain only one account. You must notify us
            immediately of any unauthorized use of your account.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>4. Subscription and Billing</h2>
          <p>
            PropOS operates on a recurring monthly subscription basis. Payment
            is processed through Stripe. Your subscription will automatically
            renew at the end of each billing period unless you cancel before
            the renewal date. You may cancel your subscription at any time;
            upon cancellation, you will retain access to the Service until the
            end of your current billing period. No refunds are provided for
            partial billing periods.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>
              Share your account credentials or allow others to access your
              account
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any portion of the
              Service
            </li>
            <li>
              Attempt to gain unauthorized access to other accounts, systems,
              or networks connected to the Service
            </li>
            <li>
              Transmit viruses, malware, or other harmful code through the
              Service
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>6. Data Ownership</h2>
          <p>
            You retain full ownership of all data you submit to PropOS,
            including property information, tenant records, lease documents,
            and any other content you provide ("Customer Data"). By using the
            Service, you grant PropOS a limited, non-exclusive license to
            process, store, and transmit your Customer Data solely for the
            purpose of providing and improving the Service.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            7. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, PropOS shall
            not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to
            loss of profits, data, or business opportunities. In no event
            shall PropOS's total aggregate liability exceed the amount of fees
            you paid to PropOS during the twelve (12) months immediately
            preceding the event giving rise to the claim.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>8. Termination</h2>
          <p>
            Either party may terminate this agreement at any time. You may
            terminate by canceling your subscription through the Service.
            PropOS may terminate or suspend your access if you violate these
            Terms. Upon termination, you will have thirty (30) days to export
            your Customer Data. After that period, PropOS may delete your data
            in accordance with our Privacy Policy.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. When we
            make material changes, we will notify you via the email address
            associated with your account. Your continued use of the Service
            after such notification constitutes acceptance of the updated
            Terms.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Alabama, without regard to its conflict
            of law provisions.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>11. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at{' '}
            <a href="mailto:support@propos.app" style={{ color: '#d4a853' }}>
              support@propos.app
            </a>
            .
          </p>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '2.5rem 0' }} />
        <p style={{ fontSize: '0.875rem', color: '#888' }}>
          <Link href="/privacy" style={{ color: '#d4a853' }}>
            Privacy Policy
          </Link>
        </p>
      </main>
    </>
  );
}
