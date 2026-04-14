export default function Page() {
  const mocks = [
  "404",
  "about",
  "admin-add-tenant",
  "admin-late-rent",
  "admin-pay-vendor",
  "admin-property-new",
  "admin-renew",
  "admin-syndicate",
  "admin-team",
  "admin-v2",
  "api-docs",
  "applications",
  "apply",
  "changelog",
  "compare",
  "demo",
  "docs",
  "faq",
  "for-coliving",
  "for-landlords",
  "for-sfr-investors",
  "for-students",
  "import",
  "inspection",
  "integrations",
  "investor",
  "landing",
  "lease-amendment",
  "leases",
  "listings",
  "maintenance",
  "moveout",
  "onboarding",
  "partners",
  "payments",
  "portal",
  "press",
  "pricing",
  "privacy",
  "properties",
  "referral",
  "renew",
  "reports",
  "roommate",
  "security",
  "service-down",
  "settings",
  "sign-in",
  "sign",
  "status",
  "stories",
  "tax-pack",
  "tenant-approved",
  "tenant-declined",
  "tenant-settings",
  "tenants",
  "terms",
  "tools",
  "vendor-signup",
  "vendor",
  "vs-appfolio",
  "vs-buildium",
  "vs-doorloop"
];
  return (
    <main style={{maxWidth:720,margin:"40px auto",padding:24,fontFamily:"var(--flg-font-sans)",color:"var(--flg-text)"}}>
      <h1 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.02em"}}>Tenantory mocks</h1>
      <p style={{color:"var(--flg-text-muted)",marginTop:6}}>63 mocks ported from ~/Desktop/tenantory/. Viewable snapshots only.</p>
      <ul style={{marginTop:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,listStyle:"none",padding:0}}>
        {mocks.map((m) => (
          <li key={m}>
            <a href={`/mocks/${m}`} style={{color:"var(--flg-blue)",fontSize:14,fontWeight:600,textDecoration:"none"}}>{m}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
