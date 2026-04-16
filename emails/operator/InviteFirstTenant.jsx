import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function InviteFirstTenant({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/admin/tenants",
}) {
  return (
    <Layout preview="Step 2 of 3 — invite a tenant and watch the portal light up." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        Invite your first tenant.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, You've got a property. Now invite a tenant and they'll land on a branded portal where they can pay rent, submit maintenance, and sign leases without calling or texting you.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          Invite a tenant
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>Tenants see your brand, your address, your colors — never Black Bear Rentals's.</Text>
    </Layout>
  );
}
