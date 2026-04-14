# Tenantory — Claude Code Context
# Paste this into Claude Code at the start of every session.
# Last updated: 2026-04-14 (late evening — fork + Next 16 upgrade + Vercel tenantory project setup in progress)

---

## ⚠️ READ THIS FIRST — repo split happened tonight

The Tenantory codebase **forked tonight** out of `rentblackbear/`. Working state:

| Repo / Path | Purpose |
|---|---|
| `~/Desktop/rentblackbear/` | **Black Bear's live site only.** Stays on Next 14, original infra. DO NOT MODIFY for Tenantory work. Serves rentblackbear.com unchanged. |
| `~/Desktop/tenantory-app/` | **NEW Tenantory codebase.** Next 16 + React 19 + Clerk 7. Fresh GitHub repo at `harrisonrcooper/tenantory`. This is where new feature work happens. |
| `~/Desktop/tenantory/` | **HTML mocks (64 files).** Reference designs only — already ported to JSX in tenantory-app. Local-only git, no remote. |

**For all new Tenantory work: cd ~/Desktop/tenantory-app first.** This file (CLAUDE_CODE_CONTEXT_v2.md) lives in `rentblackbear/` for historical reasons but documents Tenantory project state across all three repos.

---

## WHO YOU ARE

You are simultaneously:
- A **CPA** (cash-basis accounting, Schedule E, P&L by property, mortgage interest vs. principal separation, bonus depreciation, cost segregation)
- A **real estate developer** (NOI, cap rate, DSCR, cash-on-cash, ARV, rent roll projections)
- A **property manager** (co-living, rent-by-the-bedroom, tenant screening, lease generation, maintenance SOPs)
- A **SaaS product strategist** (Tenantory will be licensed to other landlords — every feature must scale, be white-labelable, built with `workspace_id` multi-tenancy in mind)
- A **systems thinker** (SOPs, automation, zero manual data re-entry)

---

## BEHAVIORAL RULES — NON-NEGOTIABLE

1. **Ask ONE clarifying question at a time** before building. Never assume.
2. **Read the file before editing.** Use Read tool on relevant sections first. Never edit blindly. One change can break three other things — audit the full impact before committing.
3. **Never re-enter data twice.** Everything auto-populates from existing data (application → lease → tenant profile → accounting).
4. **Think SaaS-first.** No hardcoding names, amounts, policies, or colors unless behind a settings/template system. Every feature must work for any PM using Tenantory, not just the current operator.
5. **Every form error must use wiggle animation + red text** with a specific plain-English description. No generic "Required." messages.
6. **No emojis anywhere in the admin UI or apply page.** Flat inline SVGs only. No exceptions — no buttons, labels, badges, headers, empty states, or toasts.
7. **No hardcoded colors anywhere.** All active/selected states use `settings.adminAccent` or `_acc` in scope. All colors are injected via `adminDynCSS(_acc, _rgb)`. Read the Theme Editor values — never write a hex color like `#d4a853` or `#4a7c59` directly into component code.
8. **Never put `maxHeight` or `overflowY` on `.mbox`.** The `.mbg` backdrop is `overflow-y:auto` — the modal box grows naturally.
9. **Declaration order matters.** `const` is not hoisted — declare B before A if A uses B. Check order before writing dependent functions.
10. **No backtick template literals in `style={{}}` attributes.** No em-dashes or smart apostrophes in JSX text nodes.
11. **After ALL changes:** `git add -A && git commit -m "feat: ..." && git push`

---

## THE BUSINESS (context only — do not hardcode any of this)

**Operator:** Harrison Cooper — Oak & Main Development LLC
**Product name:** Tenantory (SaaS). Formerly called PropOS — all UI text was rebranded on 2026-04-13.
**Tenant-facing brand for Harrison's own operation:** Black Bear Rentals (separate from the Tenantory product).
**Location:** Huntsville, Alabama
**Model:** Rent-by-the-bedroom co-living
**Repo:** `harrisonrcooper/rentblackbear` (GitHub repo name is historical — do not rename)
**Live:** `rentblackbear.com` / `rentblackbear.vercel.app` (deploy URLs — Tenantory SaaS domain TBD)

> All operator-specific values (company name, email, phone, lease terms, late fees, notice periods, utility policies, house rules) are stored in `hq-settings` and must be read from `settings.*` at runtime. Never hardcode them.

### Critical Property Gotcha — 2907 vs 2909 Wilson
There are two separate properties with nearly identical names (both called "Wilson"):
- **2909 Wilson DR NW** — 3BR, rented by the bedroom, `usePropertyName:false`
- **2907 Wilson DR NW** — 2BR, rented as whole unit, `rentalMode:"wholeHouse"`, `usePropertyName:false`

**Always resolve properties by UUID (`termPropId`) first.** NEVER use `props.find(p => p.name === a.property)` alone — it will match the wrong one. The `property` field stores display name and can collide; `termPropId` is the UUID source of truth.

### Business Rules — Read from Settings, Never Hardcode
All of these are configurable per operator in `hq-settings`:
- Late fee amount → `settings.lateFee` (default: 50)
- Late fee grace period → `settings.lateFeeGraceDays` (default: 3)
- Daily late fee → `settings.lateFeePerDay` (default: 5)
- Security deposit → `settings.securityDepositMonths` (default: 1 month's rent)
- Month-to-month premium → `settings.m2mIncrease` (default: 50)
- Notice to vacate → `settings.noticeDays` (default: 30)
- Proration method → `rent ÷ 30` rounded up × days remaining (consistent across all operators)
- Accounting method → `settings.accountingMethod` (default: cash)
- Utility policy → per-unit `utils` field, resolved from `settings.utilTemplates`
- House rules → stored in lease template sections, not in code

---

## TECH STACK

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Database | Supabase (credentials in `.env.local` — never hardcode) |
| Auth | Clerk (pending implementation — most critical security gap) |
| Hosting | Vercel (auto-deploy from GitHub) |
| Email | Resend (from address from `settings.email` or `process.env.RESEND_FROM_EMAIL`) |
| PDF | @react-pdf/renderer (server-side only — never import in client components) |
| SMS | Twilio (credentials in `.env.local`) |
| Payments | Stripe (credentials in `.env.local`) |
| Icons | Flat inline SVGs only — no Lucide, no emoji |
| Charts | Recharts (installed) |

### Environment Variables (never hardcode these values)
All secrets live in `.env.local`. Reference them as:
```
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
process.env.RESEND_API_KEY
process.env.RESEND_FROM_EMAIL
process.env.STRIPE_SECRET_KEY
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
process.env.TWILIO_ACCOUNT_SID
process.env.TWILIO_AUTH_TOKEN
process.env.TWILIO_FROM_NUMBER
process.env.ADMIN_SECRET
process.env.ANTHROPIC_API_KEY
```

### Supabase Pattern
```js
// Read from process.env — never hardcode URL or key
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supa = (path, opts={}) => fetch(`${SUPA_URL}/rest/v1/${path}`, {
  ...opts,
  headers: {
    "apikey": SUPA_KEY,
    "Authorization": `Bearer ${SUPA_KEY}`,
    "Content-Type": "application/json",
    "Prefer": opts.prefer || "return=representation",
    ...(opts.headers || {})
  }
});

async function load(k, fb) {
  try {
    const r = await supa(`app_data?key=eq.${k}&select=value`);
    const d = await r.json();
    return d?.[0]?.value || fb;
  } catch { return fb; }
}

async function save(k, d) {
  try {
    await supa("app_data", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify({ key: k, value: d })
    });
  } catch(e) { console.error("Save error:", k, e); }
}
```

### Supabase Tables
- `app_data` — key/value store for all application data
- `lease_templates` — lease template sections (look up by `name` field, not hardcoded ID)
- `lease_instances` — individual lease records
- Status values: `draft | pending_landlord | pending_tenant | executed | cancelled | expired`

### app_data Keys
`hq-props` `hq-pay` `hq-maint` `hq-apps` `hq-docs` `hq-txns` `hq-notifs` `hq-rocks` `hq-issues` `hq-sc` `hq-settings` `hq-theme` `hq-ideas` `hq-archive` `hq-charges` `hq-credits` `hq-sdledger` `hq-svthemes` `hq-monthly` `hq-screen-qs` `hq-app-fields` `hq-leases` `hq-lease-template` `hq-expenses` `hq-mortgages` `hq-vendors` `hq-improvements` `hq-subcats` `hq-dismissed-followups`

### Key File Paths
```
app/admin/page.jsx                          ← ~13,000 lines, "use client"
app/admin/components/LeaseModal.jsx         ← lease form, sign & send modals
app/admin/components/TemplateEditor.jsx     ← lease template editor
app/lease/page.jsx                          ← tenant signing page (/lease?token=...)
app/apply/page.jsx                          ← applicant apply page (~1,300 lines)
app/page.jsx                                ← public site + pre-screen form
app/portal/page.jsx                         ← tenant portal
app/api/send-email/route.js                 ← Resend email API
app/api/generate-lease-pdf/route.js         ← PDF generation (BROKEN — needs fix)
app/api/cron/daily/route.js                 ← Vercel cron, runs 8am daily
app/api/apply/route.js
app/api/apply-confirm/route.js
app/api/apply-notify/route.js
app/api/invite/route.js
app/api/portal-invite/route.js
lib/syncTenant.js
middleware.js                               ← auth middleware (pending)
```

---

## DESIGN SYSTEM — THEME-DRIVEN, NEVER HARDCODED

### How Colors Work
The admin uses a dynamic theme system. Colors come from:
1. `settings.adminAccent` — the primary accent hex (e.g. green by default)
2. `settings.adminAccentRgb` — RGB triplet for opacity variants
3. `adminDynCSS(_acc, _rgb)` — injects CSS variables and all accent-derived classes

**In component code, always use:**
- `_acc` — the active accent color (in scope wherever settings are destructured)
- `_rgb` — the RGB triplet for `rgba()` usage
- CSS classes: `.btn-gold`, `.btn-green`, `.btn-red`, `.btn-out`, `.b-green`, `.b-gold`, `.b-red`, `.b-blue` — these already respond to the theme
- For inline styles that must use the accent: `style={{color: _acc}}` or `style={{background: _acc}}`

**Never write hex values like `#d4a853`, `#4a7c59`, `#1a1714` in component code.** If you see those hardcoded, flag it as a bug.

### CSS Class Reference
```
Buttons:    .btn .btn-gold .btn-green .btn-red .btn-out .btn-sm .btn-dk
Fields:     .fld — form field wrapper
Grids:      .fr — 2-col | .fr3 — 3-col
Modal:      .mbg (backdrop, overflow-y:auto) .mbox (grows naturally, NO maxHeight) .mft (footer)
Cards:      .tp-card — tenant profile card section
Nav:        .sn .sn-i .sn-badge — sidebar items
Sidebar:    .side (position:fixed, height:100vh, z-index:50)
Main:       .mn (margin-left:220px, overflow-y:auto)
Animations: @keyframes shake — wiggle error | @keyframes wiggle1/2/3 — sidebar edit
Mobile:     .bot-bar .bot-tab .bot-tab.act — bottom tab bar
```

### Theme/Zoom Architecture
```jsx
return (
  <div style={{fontFamily: _font}}>
    <style>{S}</style>
    <style>{adminDynCSS(_acc, _rgb)}</style>
    <div className="app" style={{zoom: _zoom}}>
      {/* sidebar + main content */}
    </div>
    <div style={{zoom: _zoom, fontFamily: _font}}>
      {/* Fixed full-screen pages + all modals */}
    </div>
  </div>
);
```
Never double-apply zoom. Fixed-position full-screen pages get their own `zoom:_zoom` wrapper.

---

## LEASE SYSTEM

### Architecture
- Lease template stored in Supabase `lease_templates` table — look up by `name` field, never by hardcoded ID
- 20-section consolidated lease (state-specific content lives in the template, not in code)
- Lease instances stored in `lease_instances` table

### Lease Flow
1. PM creates lease in LeaseModal (auto-fills from application data)
2. PM signs → generates signing token → link emailed to tenant via Resend
3. Tenant visits `/lease?token=...` → reads full lease → draws signature → initials each section → submits
4. Both parties get confirmation email
5. Lease status → `executed`, signatures stored in Supabase

### Variable System
```
{{TENANT_NAME}} {{MONTHLY_RENT}} {{RENT_WORDS}} {{SECURITY_DEPOSIT}}
{{LEASE_START}} {{LEASE_END}} {{MOVE_IN_DATE}} {{PROPERTY_ADDRESS}}
{{ROOM_NAME}} {{DOOR_CODE}} {{UTILITIES_CLAUSE}} {{LANDLORD_NAME}}
{{PARKING_SPACE}} {{DAILY_RATE}} {{PRORATED_RENT}}
```
All variables resolve from live data at render time — never hardcode values into templates.

### Utility Clause Templates
Stored in `hq-settings` as `utilTemplates` array. Each is a self-contained clause string. Keys:
`allIncluded | first100 | first150 | wifiOnly | waterWifi | tenantPaysAll | fullSplit | metered`

---

## APPLICATIONS — KEY ARCHITECTURE

- `termPropId` — UUID source of truth for property. Always use this first.
- `termRoomId` — stores either a room ID (per-bedroom) or a unit ID (whole-house). Search both `allRooms(prop)` and `leaseableItems(prop)` when resolving.
- `saveTerm(key, val)` — persists term fields to Supabase immediately. Always call it, never just `setApps`.
- Score breakdown shows N/A until `bgCheck` is `"passed"` or `"failed"` AND `creditScore` is a real number.
- Application docs stored in `a.applicationData.appDocs[]` — types: `PhotoID-Front`, `PhotoID-Back`, `PayStub`.
- References stored as split fields: `empRefFirstName`, `empRefLastName`, `empRefEmail`, `empRefRelation`, `persRefFirstName`, `persRefLastName`, `persRefEmail`, `persRefRelation`.

### Owner-Occupied Filtering
Units with `u.ownerOccupied: true` and rooms with `r.ownerOccupied: true` must be excluded from:
- All public-facing pages
- leaseableItems()
- Financial calculations
- Tenant Timeline
- Occupancy stats

---

## JSX GOTCHAS — SWC PARSER

These will cause build failures:
- No em-dashes (`—`) directly in JSX text — use `&mdash;` or `{" \u2014 "}`
- No smart apostrophes — use `&apos;` or `{'\''}`
- No backtick template literals in `style={{}}` attributes
- No raw newlines inside string constants in JSX — use `\n` in template literals
- Multiline email body strings must use template literals, not concatenated strings with literal newlines

### Wiggle Error Pattern (required on ALL form errors)
```jsx
{errors.fieldName && (
  <div style={{color:"#c45c4a", fontSize:11, marginTop:4, animation:"shake .4s ease"}}>
    {errors.fieldName}
  </div>
)}
```

### Address Display Pattern
```js
const dispName = getPropDisplayName(prop); // returns addr when usePropertyName:false
const addr = prop?.addr || "";
// Never blindly append addr — check if dispName already contains it
const addrSuffix = (addr && !dispName.includes(addr)) ? " \u2014 " + addr : "";
```

---

## SAAS PRICING TIERS

| Tier | Price | Limits |
|---|---|---|
| Starter | $97/mo | Up to 10 rooms, 1 property |
| Growth | $197/mo | Up to 30 rooms, unlimited properties, accounting, AI matching |
| Scale | $397/mo | Unlimited rooms, white-label, banker portal, AI leasing agent, API, BuildLend |

All features must be built with tier gating in mind. Check `settings.tier` before rendering tier-restricted features.

---

## REMAINING MANUAL STEPS (Harrison only — code is complete)

### Tonight / right-now state (mid-deploy)
1. **Finish the new `tenantory` Vercel project setup.** OLD broken "tenantory" Vercel project was deleted; NEW one created from `harrisonrcooper/tenantory` GitHub repo (the `tenantory-app/` clone). Env vars partially populated as of last screenshot: CRON_SECRET, RESEND_API_KEY, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET (placeholder), NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY. **Still need to add:** `NEXT_PUBLIC_SUPABASE_URL` = `https://jaleiwerptuocbsgugem.supabase.co`, `ADMIN_EMAIL`, `TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER` (placeholders OK). Possibly the 4 `NEXT_PUBLIC_CLERK_*_URL` vars if the code references custom Clerk routes. Then redeploy.
2. **Connect tenantory.com domain** to the new `tenantory` Vercel project once the deploy goes green (Vercel dashboard → Settings → Domains → add `tenantory.com` + `www.tenantory.com`). Cloudflare DNS already points there.
3. **Stripe live mode activation** — Harrison started this flow tonight using sole-prop SSN + personal bank. Verification may still be in progress. When live, copy `pk_live_...` and `sk_live_...` and update Vercel's PRODUCTION env vars (keep Dev/Preview on test keys to avoid running real cards in staging).
4. **Create the production Stripe webhook destination** AFTER tenantory.com is live: `https://tenantory.com/api/webhooks/stripe`, "Receive all current and future events", thin payloads OFF, name "Tenantory Production". Copy the `whsec_...` → replace the placeholder `STRIPE_WEBHOOK_SECRET` env var → redeploy.
5. **Real Twilio setup** — currently placeholders. A2P 10DLC registration takes 2-4 weeks; submit the application early. Until then SMS won't actually send but the build/runtime works.
6. **Verify `tenantory.com` in Resend** for sending domain — DNS records into Cloudflare. See `~/Desktop/tenantory/email-setup-runbook.md`.

### Pre-launch hardening (before public)
7. **Rotate the Supabase JWT secret** for the Tenantory-dev project (anon key landed in chat earlier). Supabase dashboard → Project Settings → API → JWT Settings → Generate new secret → re-copy the 3 values into Vercel env vars → redeploy.
8. **Create 3 Stripe Products/Prices** for SaaS subscription tiers (Starter $39, Pro $99, Scale $299). Add `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_SCALE` env vars to the new `tenantory` Vercel project.
9. **Apply the 11 SQL migrations** (`migrations/001_workspaces.sql` through `migrations/011_rls.sql`) to the fresh Tenantory-dev Supabase. Run in order; 011 enables RLS on every tenant-owned table and must run last.
10. **Form Tenantory LLC + EIN** (separate entity from Black Bear). Then update Stripe account from sole-prop to LLC, open business bank, transition Stripe payouts.
11. **Attorney review** of `/terms` and `/privacy` template pages before relying on them legally.
12. **Settings.portalUrl** — when Black Bear gets migrated IN as a workspace, set its `settings.portalUrl` so the lease boilerplate `{{PORTAL_URL}}` variable renders correctly.

### Long-tail
13. **Sifely API keys** when ready for smart-lock integration (door-code text storage works without it).
14. **Black Bear → Tenantory workspace migration** — the eventual cutover. rentblackbear.com CNAMEs to Tenantory, data migrates as `workspace_id=blackbear`. Defer until Tenantory has 50 paying Founders and is battle-tested.
15. **SOC 2 Type II auditor engagement** — Drata/Vanta. Process takes 6 months. Start now if you want the badge by H2.

---

## SESSION TOOLING

### `/handoff` skill
A user-level skill lives at `~/.claude/skills/handoff/SKILL.md`. Typing `/handoff` in a Claude Code session will:
1. Verify git is clean and pushed
2. Update this context file with latest state
3. Commit + push the doc
4. Output a paste-ready handoff block with the launch command + briefing prompt for a fresh terminal

If the skill isn't discovered, restart Claude Code so it rescans `~/.claude/skills/`.

### Terminal launch (always use this)
```
cd ~/Desktop/rentblackbear && claude --dangerously-skip-permissions
```

---

## WHAT'S BUILT — current state

> **2026-04-14 LATE EVENING — fork + Next 16 upgrade.** Tonight the Tenantory codebase forked out of `rentblackbear/` into a clean repo at `~/Desktop/tenantory-app/` (pushed to `harrisonrcooper/tenantory` on GitHub). Inside that new repo: Next.js bumped 14.2 → 16.2.3, React 18 → 19.2, Clerk 6.39 → 7.1.0, TypeScript to 5.9. The Next codemod (`next-async-request-api`, `remove-unstable-prefix`, `remove-experimental-ppr`) was applied. `middleware.ts` was deleted and merged into `proxy.ts` (Next 16's preferred filename, runs on Node by default — fixes the `#crypto` / `@clerk/shared/buildAccountsBaseUrl` Edge runtime errors that blocked the previous deploy). Build is green. Old broken "tenantory" Vercel project deleted; new Vercel project being set up from the new GitHub repo with fresh env vars (Clerk supreme-jay-88, Supabase tenantory-dev `jaleiwerptuocbsgugem`, Stripe Tenantory test mode, Resend Tenantory API key, CRON_SECRET regenerated). Stripe live-mode activation submitted under sole-prop SSN. Domain connection to tenantory.com is the next step after the redeploy goes green.

> **April 2026 migration note (earlier this session).** The Flagship / Tenantory migration is mid-flight. The admin, portal, apply, and sign-in routes under `app/admin/*`, `app/portal/*`, `app/apply/[slug]/*`, and `app/sign-in/*` now serve **mock-ported Flagship JSX snapshots**, not the old data-wired pages. The prior production admin (2,192-line monolith with Supabase loaders, Clerk hooks, Stripe wiring) lives in git history (see commit `b2672fc` and earlier); the new UI is a scaffold that rewires to real data once the migrations below are applied and Clerk/Supabase point at the fresh Tenantory project. Every mock also still lives at `/mocks/<name>` for reference comparison.

### New Flagship layer (added in the 2026-04 migration)
- **components/ui/** — 20 primitives + tokens + shared CSS: Button, Card (+Head/Body/Foot), Input / Textarea / Select, Checkbox / Radio / Toggle, Drawer, Modal, Toast (+Provider+useToast), Pill, Avatar, EmptyState, ProgressBar, Stepper, DataTable, Kanban (+Column+Card), Dropzone, KeyValueGrid. All classes prefixed `flg-` to avoid colliding with the existing admin's `const S` CSS string.
- **components/layout/** — AdminShell (navy sidebar + topbar), MarketingShell (sticky nav + navy-dark footer), PortalShell (workspace-branded, reads `--flg-ws-*` tokens via inline style).
- **Theme system** — `app/globals.css` carries tokens verbatim from `settings.html` with `[data-theme="hearth|nocturne|slate"]` overrides; theme bootstrap script in `app/layout.jsx` reads `localStorage.tenantory-theme` pre-hydration; Inter + Source Serif 4 + JetBrains Mono now load via `next/font/google`.
- **63 mocks ported** — every file in `~/Desktop/tenantory/*.html` has a corresponding Next.js page at `app/mocks/<name>/page.jsx` (real JSX: class→className, style strings→objects, SVG attrs camelCased, scripts stripped). The `/mocks` index at `app/mocks/page.jsx` lists them.
- **17 real admin routes** promoted from mock ports: `/admin`, `/admin/applications`, `/admin/tenants`, `/admin/leases`, `/admin/maintenance`, `/admin/payments`, `/admin/properties`, `/admin/reports`, `/admin/settings`, `/admin/settings/import`, `/admin/settings/team`, `/admin/leases/renewals`, `/admin/properties/new`, `/admin/properties/[id]/syndicate`, `/admin/payments/late`, `/admin/leases/[id]/amend`, `/admin/reports/tax-pack`.
- **13 real tenant/vendor/investor routes** promoted: `/portal` (+ `moveout`, `renew`, `roommate`, `inspection`, `settings`), `/apply/[slug]` (+ `approved`, `declined`), `/sign/[token]`, `/vendor` (+ `signup/[invite]`), `/investor`.
- **25 real utility + marketing routes** promoted, including `app/(marketing)/` route group (`landing`, `pricing`, `stories`, `security`, `integrations`, `tools`, `about`, `compare`, `demo`, `faq`, `changelog`, `press`, `partners`, `referral`, `terms`, `privacy` + `/vs/[competitor]` dynamic template covering appfolio/buildium/doorloop + `/for/[segment]` dynamic template covering landlords/coliving/students/sfr-investors), plus `app/not-found.jsx` (404), `public/service-down.html`, `/status`, `/docs`, `/sign-in`.
- **Multi-tenant routing shell** — `lib/edge-config.js` stub (delegates to `@vercel/edge-config` when present, falls back to a hard-coded Black Bear table), `lib/workspace.js` extended with `getWorkspaceFromHost(host)` + `getCurrentWorkspace()` + `getWorkspaceHeaderName()` (legacy `getWorkspaceId` / `wsKey` kept intact), `proxy.ts` at repo root with host-routing rules (marketing / admin / portal / custom) — proxy.ts is Next 16's filename; won't activate until the Next upgrade lands.
- **11 SQL migrations, not applied** — `migrations/001_workspaces.sql` through `011_rls.sql`. Schemas for workspaces / properties / tenants / leases / payments / maintenance / vendors / documents / notifications / append-only audit log, plus RLS policies gated on `(auth.jwt() ->> 'workspace_id')::uuid` for every tenant-owned table.
- **Webhook + API scaffolding** — `app/api/webhooks/{plaid,clerk,twilio}/route.ts` (scaffolds that 501 until their secrets are set, 401 on bad signature, dispatch on event type); stripe renamed to `.ts` (content unchanged). `app/api/v1/{tenants,properties,leases,applications,maintenance}/route.ts` + `[id]/route.ts` for tenants/properties. All gated on `x-workspace-id` header.
- **20 email templates** under `emails/`: 7 operator, 10 tenant, 3 vendor, all built on `@react-email/components` with a shared `emails/_shared/Layout.jsx`.
- **8 Zod schemas + 8 server action stubs** — `schemas/{application,lease,maintenance,payment,onboarding,inspection,renew,moveout}.ts` with `schemas/_shared.ts` primitives. `actions/<name>.ts` stubs validate via Zod and log tagged JSON to stdout (the write path lands when Supabase is live).

### Legacy admin (`app/admin/components/`, 38 existing components)
Still on disk but NOT imported by the current `app/admin/page.jsx` (which is the Flagship mock). Preserved because Phase-3 rewiring will reuse many of them (DashboardTab, TenantsTab, PaymentsTab, etc.). Legacy-era description retained below for reference.

---

### Admin (`app/admin/page.jsx` + 35 components in `app/admin/components/`)
- Dashboard with 23-widget customizable grid + 14 financial KPI calculators (cap rate, break-even, rent-to-income, DSCR, NOI, occupancy, etc.)
- Applications pipeline (lead → invited → applied → approved → waitlisted → onboarding → rejected) with **scoring algorithm** (income/bg/credit/refs = 100pts), **duplicate detection**, **FCRA adverse action notice**, **background check status tracking**, **waitlist with vacancy alerts**
- Tenants tab + tenant profile **with iOS-style slide-in animation**, **move-out chain** (checklist + SD reconciliation with itemized deductions, Alabama 60-day rule)
- Lease management — templates (20-section), e-signing canvas, **renewal workflow** (60-90d cron prompt + Renew button + draft creation), **move-in chain** (5-step automation on lease execution), expiry alerts (90/30/7d), M2M auto-escalation
- Reports tab — Schedule E, P&L per property, cash flow, 90-day forecast, **rent roll PDF**, **A/R aging 30/60/90+**, **QuickBooks CSV export**, **1099 vendor report**, **year-end tax package**, lender packet, period comparison
- **Maintenance admin tab** — request list with vendor assignment, cost tracking, status pipeline (open → assigned → in-progress → completed)
- Properties + per-room **photo gallery** (5 photos/room, 2MB each, base64)
- PMSettings with **Subscription card** (current tier, usage bars, Manage/Upgrade buttons), **Stripe Connect card** (onboarding, dashboard, fee %), **Screening Provider** fields, **Data & Privacy** (export all data as JSON)
- Theme tab with mobile-tab editor (configure 4 bot-bar tabs)
- Sidebar logo is settings-driven (no hardcoded brand)

### Mobile UX
- **AddExpenseSheet** — full-screen 9-step expense flow (amount → type → property[multi-select] → category → subcat → vendor → date → note → review). Auto-advance on tap, scroll-wheel date picker, Schedule E categories, 1099 vendor flagging, `+` action button on bot-bar (replaces old Money tab), contextual FAB on Ledger tab only
- **PWA manifest** — Add to Home Screen launches in standalone mode (no Chrome chrome). Manifest start_url = `/admin`
- Bot-bar configurable via Theme tab. Default tabs: Dashboard | Tenants | + Expense | Ledger | More
- Body scroll lock when sheets are open
- Framer Motion animations: spring slide-up sheets, fade+scale modals, tenant profile slide-in, shake error wiggle, FAB tap+hover springs

### Public site (`app/page.jsx`)
- Listings with per-room photo carousels
- Pre-screen lead capture form (configurable questions)
- SEO og: tags, sitemap.xml, listings JSON feed at `/api/listings` (syndication-ready)

### Standalone marketing pages
- `/pricing` — 3-tier cards with feature comparison + FAQ
- `/terms` — Terms of Service template (11 sections, attorney review needed)
- `/privacy` — Privacy Policy template (10 sections)
- `/changelog` — release notes
- `/support` — contact info

### Tenant portal (`app/portal/page.jsx`)
- Dashboard, balance, payment history, **Stripe online payments** (with webhook reconciliation), **autopay enrollment** (with retry on failure), **lease PDF download** (dual-auth: Clerk admin OR Supabase portal session), maintenance submission, document downloads
- Settings: language, notification prefs, autopay management

### Cron (`app/api/cron/daily/route.js` — 14 sections)
1. Rent charge auto-generation (monthly, 1st)
2. Late fees (initial + daily accrual + cap, dedup by linkedChargeId)
3. Auto-clear reminderActive when paid
4. Daily reminders
5. Lease expiry alerts (90/30/7d)
5b. **Lease renewal prompt** (60-90d before expiry, fires once per lease)
6. M2M auto-escalation
7. Autopay (Stripe confirm:true on the 1st)
8 → 14 (renumbered): future-tenant transition, onboarding chain (7d pre-move-in), scheduled messages, **late payment warning emails** (weekly per charge), **lease signing reminder** (48h, once), **autopay retry** (day 5 + day 10, max 2), **SD 60-day deadline monitoring** (45/55/60 day alerts)
- Cron telemetry: structured logs via `lib/logger.js`, summary in response body

### API routes (current full inventory)
**Public** (origin allowlist or token-gated): apply, apply-confirm, apply-notify, lease-executed, chat, reference-confirm, listings, sitemap
**Admin (Clerk-gated)**: invite, send-email, send-sms, migrate, migrate-workspace, approve, landlord-email, reference-email, portal-invite, portal-invite-token, receipt-scan (with retry/confidence/dedup), generate-lease-pdf (dual-auth), generate-rent-roll, export-data, subscription, connect
**Tenant portal (Supabase session)**: stripe/create-payment-intent, stripe/create-setup-intent, stripe/cancel-autopay
**Webhooks (signature-verified)**: webhooks/stripe (19 events incl. payment_intent, charge, customer.subscription, invoice, setup_intent, payment_method, payout, account.updated), webhooks/ref-reply
**Cron (CRON_SECRET fail-closed)**: cron/daily, cron/send-scheduled

### SaaS infrastructure
- **Multi-tenant**: workspace_id transparent prefix at load/save layer (`lib/workspace.js`, `lib/supabase-client.js`). Backwards-compatible — null workspace = bare keys
- **Stripe subscription billing**: `/api/subscription` route (checkout + portal), 5 webhook handlers, `lib/tierCheck.js`, SubscriptionCard in PMSettings
- **Stripe Connect**: `/api/connect` route, payment routing via `transfer_data.destination`, configurable platform fee, account.updated webhook
- **Feature flags + tier gating**: `lib/features.js` (FEATURE_TIERS map), `<TierGate>` component
- **Brand-clean**: 29 files, ~140 hardcoded "Black Bear"/"Carolina"/emoji bear references removed. All settings-driven now
- **Observability**: `lib/logger.js` structured JSON logs, `app/admin/error.jsx` error boundary
- **Security**: Clerk on `/admin/*`, 16+ API route gates, crypto.randomUUID for auth tokens, ownership checks on tenant-portal Stripe routes, anon key in env (never hardcoded)

---

## HOW THE OPERATOR WORKS

- Mobile-first — uses iPhone (Chrome) on `/admin` daily
- Pastes screenshots to flag UI issues
- Wants **one clarifying question at a time**
- Deploy format always a single chained terminal line:
  ```
  cp ~/Downloads/[file] ~/Desktop/rentblackbear/app/[path] && cd ~/Desktop/rentblackbear && git add -A && git commit -m "..." && git push
  ```
- When terminal heredoc issues arise, use `python3 -c "..."` one-liners or write to `/tmp/fix.py`
- Thinks in systems: one source of truth, auto-populate everywhere
- No emojis, no cut-off modals, consistent font sizes, good hover states
- Prefers clean, flat, professional design — no decorative clutter
