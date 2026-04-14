import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function WelcomeToPro({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/admin",
}) {
  return (
    <Layout preview="You're on a paid plan — here's what unlocks next." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        Welcome to Tenantory Pro.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, everything the free tier did, plus: unlimited properties, AI tenant matching, white-label tenant portal, accounting exports (Schedule E / QBO), and the lender packet generator.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Tour the new features
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Thanks for betting on Tenantory — we'll earn it.</Text>
    </Layout>
  );
}
