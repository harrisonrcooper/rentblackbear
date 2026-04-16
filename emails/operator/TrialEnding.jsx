import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function TrialEnding({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/pricing",
}) {
  return (
    <Layout preview="Your Black Bear Rentals trial ends in 3 days." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Your trial ends in 3 days.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, Nothing breaks — your data sticks around for 30 days. But the tenant portal, automations, and reports pause unless you pick a plan.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Pick a plan
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Questions? Reply and I'll walk you through the tiers.</Text>
    </Layout>
  );
}
