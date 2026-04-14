import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function LeaseRenewalNudge({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal/renew",
}) {
  return (
    <Layout preview="Your lease is up in 60 days — let's talk renewal." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Your lease ends in 60 days.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, no pressure — but this is the window where a renewal keeps your rate steady and avoids the month-to-month bump. Say the word and we'll draft a renewal in the portal.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Renew my lease
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>If you're planning to move out, let us know 30 days out so we can line up the deposit return and a final walkthrough.</Text>
    </Layout>
  );
}
