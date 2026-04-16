import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function Declined({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/reference-confirm",
}) {
  return (
    <Layout preview="Update on your application to {workspaceName}." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Update on your application.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, thanks for applying. We're unable to move forward with your application at this time. Per the Fair Credit Reporting Act you have the right to request the specific reasons and the consumer report we used in our decision.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          See the FCRA notice
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>You may also request the consumer report free of charge within 60 days from the reporting agency listed in the FCRA notice.</Text>
    </Layout>
  );
}
