import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function Approved({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/lease",
}) {
  return (
    <Layout preview="Good news — your application was approved." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        You're approved. Welcome to {workspaceName}.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, congratulations — your application passed screening. Next step: sign the lease. The signing link is below; the lease becomes binding once both you and the landlord sign.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Sign the lease
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Move-in details, door codes, and payment setup arrive after signing.</Text>
    </Layout>
  );
}
