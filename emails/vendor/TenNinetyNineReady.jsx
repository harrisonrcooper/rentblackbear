import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function TenNinetyNineReady({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/vendor",
}) {
  return (
    <Layout preview="Your 1099-NEC for last year is ready to download." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Your 1099-NEC is ready.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, if you received $600+ from any workspace through Tenantory last year, your 1099-NEC is in the vendor portal. Download, file, done.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Download 1099-NEC
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Each operator may issue their own copy separately — this one consolidates Tenantory-routed payouts.</Text>
    </Layout>
  );
}
