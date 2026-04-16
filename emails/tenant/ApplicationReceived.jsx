import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function ApplicationReceived({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com",
}) {
  return (
    <Layout preview="We got your application. Here's what happens next." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Application received.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, thanks for applying to {workspaceName}. Scoring runs automatically and we'll email you the decision within 24 hours.
      </Text>
      <Text style={sharedStyles.muted}>You can pull up your application anytime at the portal link we sent earlier.</Text>
    </Layout>
  );
}
