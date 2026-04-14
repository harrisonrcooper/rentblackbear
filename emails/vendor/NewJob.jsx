import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function NewJob({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.tenantory.com/vendor",
}) {
  return (
    <Layout preview="New job for you — {workspaceName}." brand="Tenantory">
      <Heading as="h1" style={sharedStyles.heading}>
        New job from {workspaceName}.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, you've been assigned to a maintenance ticket. Details (address, access notes, photos, scope) are on the job link below. Accept or decline directly from there.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          View the job
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Reply with an ETA once you've accepted.</Text>
    </Layout>
  );
}
