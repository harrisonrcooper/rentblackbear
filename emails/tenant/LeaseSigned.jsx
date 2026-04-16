import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function LeaseSigned({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/portal",
}) {
  return (
    <Layout preview="Your lease is signed and ready to download." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Lease signed. Here's your copy.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, both parties signed — welcome to {workspaceName}. A PDF of the executed lease is attached and also lives in your portal under Documents.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Open your portal
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Keep an eye out for the move-in checklist 7 days before your start date.</Text>
    </Layout>
  );
}
