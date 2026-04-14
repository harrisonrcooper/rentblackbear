import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function MaintenanceScheduled({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal",
}) {
  return (
    <Layout preview="Your maintenance is scheduled — here's the when + who." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Vendor assigned and scheduled.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, a vendor is on the schedule for your ticket. Details, their phone number, and the expected arrival window are on the portal. If the time doesn't work, reply to this email or flag it from the ticket.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          See ticket details
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>You don't need to be home unless the notes specifically say so.</Text>
    </Layout>
  );
}
