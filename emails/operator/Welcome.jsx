import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function Welcome({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/admin",
}) {
  return (
    <Layout preview="Your Black Bear Rentals workspace is live. Here's how to make it count." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Welcome to Black Bear Rentals — let's ship your portfolio.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, your workspace is up and your Founder spot is locked in. The next 10 minutes are the most important: add your first property so the rest of the flow (tenants, leases, payments) has somewhere to land.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Open the admin
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>— Harrison (founder, Black Bear Rentals)</Text>
    </Layout>
  );
}
