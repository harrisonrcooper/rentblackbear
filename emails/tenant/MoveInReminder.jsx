import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function MoveInReminder({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/portal/inspection",
}) {
  return (
    <Layout preview="Your move-in is 7 days away — here's the checklist." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Move-in day is 7 days out.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, we're almost there. The move-in checklist below walks through: door code activation (auto-enables at midnight on your move-in date), WiFi credentials, parking, and the move-in inspection form.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Open the checklist
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Reach the portal's messages tab if anything's unclear — the landlord gets a nudge if it's urgent.</Text>
    </Layout>
  );
}
