import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Shared chrome for every Tenantory transactional email. Keeps the
// brand bar + footer consistent so the individual templates in
// emails/operator/, emails/tenant/, emails/vendor/ stay focused on
// the message body.

const styles = {
  body: {
    backgroundColor: "#f7f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
    margin: 0,
    padding: 0,
    color: "#1a1f36",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    margin: "32px auto",
    padding: "32px 40px",
    maxWidth: 560,
    boxShadow: "0 4px 16px rgba(26,31,54,0.06)",
  },
  brandBar: {
    color: "#2F3E83",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    marginBottom: 24,
  },
  footerHr: { borderTop: "1px solid #e3e8ef", margin: "32px 0 20px" },
  footerText: {
    color: "#5a6478",
    fontSize: 12,
    lineHeight: "1.6",
    margin: 0,
  },
  footerLink: { color: "#1251AD", textDecoration: "none" },
};

export default function Layout({
  preview,
  brand = "Tenantory",
  children,
  footerNote,
}) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.brandBar}>{brand}</Section>
          {children}
          <Hr style={styles.footerHr} />
          <Section>
            <Text style={styles.footerText}>
              {footerNote ??
                "You're receiving this because you're using Tenantory. Questions? Reply to this email and the team will pick it up."}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const sharedStyles = {
  heading: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#1a1f36",
    margin: "0 0 16px",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: "1.6",
    color: "#1a1f36",
    margin: "0 0 16px",
  },
  muted: {
    fontSize: 13,
    lineHeight: "1.55",
    color: "#5a6478",
    margin: "0 0 12px",
  },
  button: {
    backgroundColor: "#1251AD",
    color: "#ffffff",
    borderRadius: 999,
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
    display: "inline-block",
  },
  stat: {
    backgroundColor: "#eef3ff",
    color: "#1251AD",
    borderRadius: 10,
    padding: "12px 16px",
    fontWeight: 700,
    fontSize: 15,
    display: "inline-block",
    margin: "0 0 16px",
  },
};
