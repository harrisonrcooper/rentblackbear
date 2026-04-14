import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function MaintenanceComplete({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal",
}) {
  return (
    <Layout preview="Your maintenance ticket is closed." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        All done — ticket closed.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, the maintenance work is complete. If something feels off or the fix didn't hold, just reply to this email and we'll reopen the ticket with notes.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Open the ticket
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Thanks for your patience — these get fixed faster when tenants flag them early.</Text>
    </Layout>
  );
}
