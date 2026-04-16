import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function AddFirstProperty({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/admin/properties/new",
}) {
  return (
    <Layout preview="Step 1 of 3 — add your first property to Black Bear Rentals." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Add your first property to unlock everything else.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, Black Bear Rentals's automations, tenant portal, and lease generator all hinge on one thing: a property row. Takes ~60 seconds. Photos and bedrooms can come later.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Add a property
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Reply to this email if anything in the flow surprises you — I read every one.</Text>
    </Layout>
  );
}
