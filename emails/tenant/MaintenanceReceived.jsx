import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function MaintenanceReceived({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal",
}) {
  return (
    <Layout preview="We got your maintenance request." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Got it — your request is in the queue.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, your maintenance ticket is logged. The landlord gets notified immediately. For anything urgent (water leak, no heat, no power), call the emergency number in the portal.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          View your ticket
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Typical response: same business day for urgent, 1–3 days for routine.</Text>
    </Layout>
  );
}
