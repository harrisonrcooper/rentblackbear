import { Button, Heading, Link, Section, Text } from "@react-email/components";
import Layout, { sharedStyles } from "../_shared/Layout";

// Render with react-email render() or via the /api/send-email
// route once the email provider is wired. Props are optional so
// the template can preview with sensible defaults.

export default function TimeSavedReport({
  firstName = "there",
  workspaceName = "your portfolio",
  ctaHref = "https://app.rentblackbear.com/admin/reports",
}) {
  return (
    <Layout preview="You saved 6 hours this month — here's the breakdown." brand="Black Bear Rentals">
      <Heading as="h1" style={sharedStyles.heading}>
        You saved 6 hours this month.
      </Heading>
      <Text style={sharedStyles.paragraph}>
        Hey {firstName}, Black Bear Rentals handled 14 payment confirmations, 9 lease reminders, and 4 maintenance intakes without you touching a thing. At your hourly rate that's real money.
      </Text>
      <Section style={{ margin: "20px 0" }}>
        <Button href={ctaHref} style={sharedStyles.button}>
          See the full report
        </Button>
      </Section>
      <Text style={sharedStyles.muted}>This report runs on the first of every month. Reply 'off' to mute.</Text>
    </Layout>
  );
}
