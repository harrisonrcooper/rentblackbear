import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function InvoiceApproved({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/vendor",
}) {
  return (
    <Layout preview="Your invoice is approved — payout is on the way." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Invoice approved.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, your invoice for ticket #PLACEHOLDER was approved. Payout goes out via ACH on the next business day. You'll get a separate confirmation once it clears.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          View invoice
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Any questions? Reply to this email or message the operator inside the job thread.</Text>
    </Layout>
  );
}
