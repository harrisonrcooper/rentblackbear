import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function FoundersReminder({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/admin/settings",
}) {
  return (
    <Layout preview="Your Founder spot is reserved. Here's how it pays back." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        You're one of the first 100 — here's what that means.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, locked-in pricing for life, direct line to the founder, roadmap input, and a visible Founder badge in your workspace. None of that is available once the cohort closes.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          See the founder perks
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>— Harrison</Text>
    </Layout>
  );
}
