import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function FirstPaymentThanks({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal/settings",
}) {
  return (
    <Layout preview="Thanks — your first payment posted." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        First payment posted. You're all set.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, rent for {workspaceName} hit the ledger. Going forward the 1st of each month will auto-charge if you're enrolled in autopay, or you'll get a friendly reminder a few days prior.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Set up autopay
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Your receipt is in the portal under Payments.</Text>
    </Layout>
  );
}
