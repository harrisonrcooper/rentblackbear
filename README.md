# Tenantory

Property-management SaaS for landlords who rent by the room. Next.js 14 App Router + Supabase + Clerk + Stripe + Resend + Twilio.

Repo name (`rentblackbear`) is historical — the product is **Tenantory**. Operator-facing brand for the first deploy is **Black Bear Rentals**; everything operator-specific is settings-driven (`hq-settings`) and not hardcoded.

---

## Stack at a glance

| Layer          | Tech                                                              |
| -------------- | ----------------------------------------------------------------- |
| Framework      | Next.js 14 App Router (Node runtime)                              |
| Database       | Supabase (Postgres + Storage)                                     |
| Auth (admin)   | Clerk (`middleware.ts` protects `/admin(.*)`)                     |
| Auth (tenant)  | Supabase `auth` session tokens                                    |
| Payments       | Stripe — subscriptions, Connect, rent collection, autopay         |
| Email          | Resend                                                            |
| SMS            | Twilio                                                            |
| PDF            | `@react-pdf/renderer` (server-side only)                          |
| Charts         | Recharts                                                          |
| Animation      | Framer Motion                                                     |
| Fonts          | `next/font/google` (Plus Jakarta Sans + DM Serif Display)         |
| Hosting        | Vercel (auto-deploy from `main`)                                  |

---

## Getting started

```bash
# install
npm install

# copy the env template and fill in real values
cp .env.local.example .env.local

# dev server
npm run dev
# → http://localhost:3000
```

Live routes:

| Route                 | Who sees it                                       |
| --------------------- | ------------------------------------------------- |
| `/`                   | Public marketing site + pre-screen lead form      |
| `/admin`              | PM dashboard (Clerk-gated)                        |
| `/portal`             | Tenant portal (Supabase-session-gated)            |
| `/apply`              | Applicant flow                                    |
| `/sign-in` `/sign-up` | Clerk auth pages                                  |
| `/lease?token=...`    | Tenant lease signing                              |
| `/pricing`            | SaaS pricing page                                 |
| `/terms` `/privacy`   | Legal template pages (attorney review pending)    |
| `/changelog`          | Release notes                                     |
| `/support`            | Contact info                                      |

---

## Environment variables

All secrets live in `.env.local` (never commit). Production values live in Vercel project settings.

**Core:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
CRON_SECRET=
ANTHROPIC_API_KEY=
```

**Tier prices (Stripe dashboard → copy price IDs):**

```
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_SCALE=
```

**Optional integrations** — when set, the matching adapter activates. See `/admin` → Settings → Integrations for live status.

```
# Smart locks
SIFELY_USERNAME=
SIFELY_PASSWORD=
SIFELY_CLIENT_ID=
SIFELY_CLIENT_SECRET=

# Listing syndication
ZILLOW_PARTNER_KEY=
ZILLOW_PARTNER_ID=
FURNISHED_FINDER_API_KEY=
ROOMIES_API_KEY=

# Tenant screening
SMARTMOVE_API_KEY=
SMARTMOVE_PARTNER_ID=
RENTPREP_API_KEY=
```

Missing any block simply hides/disables the matching UI. Manual fallbacks record admin notifications so nothing silently breaks.

---

## Project layout

```
app/
  page.jsx                         # Public marketing site
  layout.jsx                       # Root layout + ClerkProvider + next/font
  apply/page.jsx                   # Applicant flow
  portal/page.jsx                  # Tenant portal
  lease/page.jsx                   # Tenant lease signing
  sign-in/[[...sign-in]]/page.jsx  # Clerk sign-in
  sign-up/[[...sign-up]]/page.jsx  # Clerk sign-up
  admin/
    page.jsx                       # ~13k-line PM dashboard ("use client")
    components/                    # 40+ tab/modal/card components
  api/
    apply/                         # Application intake
    apply-confirm/                 # Post-screening-fee confirm + bgCheck submit
    cron/daily/                    # 16-section daily cron (rent gen, late fees, reminders, autopay, recurring expenses, etc.)
    generate-lease-pdf/            # Server-side PDF render (Node runtime, dual Clerk/Supabase auth)
    integrations/status/           # Clerk-gated map of which integration env vars are set
    portal-invite/                 # Tenant portal invites (auto-provisions pm_accounts)
    send-email/                    # Resend wrapper
    smartlock/set-code/            # Smart-lock adapter dispatcher
    stripe/                        # Payment intents, setup intents, autopay cancel
    subscription/                  # Stripe subscription checkout + portal
    syndicate/push/                # Listing push to syndication channels
    webhooks/stripe/               # Stripe webhook handler (idempotent, 19 events)

lib/
  db/                              # Domain-specific load/save helpers
  supabase-client.js               # Shared Supabase client with workspace_id prefix
  theme.js                         # resolveTheme(settings) + statusColor(status, settings)
  leaseTemplate.js                 # Workspace-scoped template resolver + seed
  workspace.js                     # Multi-tenant workspace_id prefix
  syncTenant.js                    # app_data ↔ relational tables sync
  tierCheck.js                     # Feature/tier gating
  features.js                      # FEATURE_TIERS map + <TierGate>
  getSettings.js                   # PM settings fetch + email wrap
  logger.js                        # Structured JSON logs
  integrations/
    smartLock/                     # Sifely + manual adapter
    syndication/                   # Zillow + Furnished Finder + Roomies adapters
    bgCheck/                       # TransUnion SmartMove + RentPrep + manual adapter

middleware.ts                      # Clerk middleware on /admin(.*)
supabase/migrations/               # Schema migrations
public/manifest.json               # PWA manifest
public/icon.svg                    # PWA icon
CLAUDE_CODE_CONTEXT_v2.md          # Full dev context — read this before touching code
```

---

## Reusable building blocks

- **`<ConfirmModal>`** — accessible destructive / unsaved-changes prompt. Red confirm when `destructive={true}`, accent otherwise. Escape key + backdrop tap both call `onCancel`.
- **`<EmptyState>`** — zero-data card with optional CTA. Use everywhere you render a list that can be empty.
- **`<IntegrationsStatusCard>`** — read-only green/grey status grid for every adapter. Already lives in PMSettings.
- **`<PwaInstallPrompt>`** — Android `beforeinstallprompt` one-tap install, iOS share-sheet instruction hint.
- **`<SyndicationPushButton>`** — per-property push to every configured syndication channel with per-channel result dots.
- **`resolveTheme(settings)`** — every status color (`danger`, `success`, `gold`, `warn`, `muted`, `info`) with settings overrides + sane defaults. Use this, never hardcode hex.
- **`getDefaultLeaseTemplateId()`** — auto-seeds a default template for new PMs when their `lease_templates` table is empty.
- **`getSmartLockAdapter()` / `pushListingToAll()` / `getBgCheckAdapter()`** — adapter dispatchers. Pick whichever vendor has credentials; fall through to a manual notification mode when none do.

---

## Daily cron (`app/api/cron/daily/route.js`)

Scheduled via `vercel.json` for 8am daily. 16 sections, every one idempotent:

1. Rent charge auto-generation (1st of month)
2. Late fees (initial + daily accrual + cap)
3. Auto-clear reminderActive when paid
4. Daily reminders
4a. **Recurring expense auto-post** (reads `expense.recurring.nextDate`)
4b. **Due-date rent reminders** (day-before / due-day / day-1-late / day-2-late)
5. Lease expiry alerts (90/30/7 days)
5b. Lease renewal prompt (60–90 days out)
6. M2M auto-escalation
7. Autopay (Stripe confirm:true)
8. Future-tenant transition
9. Onboarding chain (7d pre-move-in)
10. Scheduled messages
11. Late payment warning emails (weekly)
12. Lease signing reminder (48h, once)
13. Autopay retry (day 5 + 10)
14. SD 60-day deadline monitoring (Alabama)

Protected with `CRON_SECRET`; fails closed.

---

## Mobile / PWA

- `100dvh` everywhere (no `100vh` — iOS address-bar safe)
- `@media (hover: none)` umbrella reset kills sticky-hover on touch
- Safe-area insets on bot-bar, top headers, sheet footers
- 768px / 420px / 380px breakpoints (tight iPhone SE support)
- Haptic feedback (`navigator.vibrate`) on key taps
- Swipe-down-to-dismiss on bottom sheets
- PWA installable (Add to Home Screen on iOS, one-tap install on Android)

---

## Development rules (TL;DR)

Read `CLAUDE_CODE_CONTEXT_v2.md` for the full list. Hard rules:

- **No emojis** in admin UI or apply page — flat inline SVGs only.
- **No hardcoded hex** — use `resolveTheme(settings)` or the `_acc` / `_rgb` globals.
- **No `100vh`** — use `100dvh` for iOS safety.
- **No `max-height` / `overflow-y` on `.mbox`** — the `.mbg` backdrop scrolls; `.mbox` grows naturally.
- **Resolve properties by UUID** (`termPropId`), never by name (`2907 Wilson DR` vs `2909 Wilson DR` collision).
- **Every form error** uses shake animation + red plain-English message (`animation:"shake .4s ease"`). No generic "Required.".
- **Every destructive action** uses `<ConfirmModal destructive>`; no `window.confirm()`.
- **Every unsaved-changes close** prompts via `<ConfirmModal>` before dropping user edits.
- **Read files before editing.** Never skim; one change can break three other things.

---

## Deploying

Pushes to `main` on GitHub auto-deploy to Vercel. Standard flow:

```bash
git add -A
git commit -m "feat: ..."
git push
```

For first-time Vercel setup see https://vercel.com/docs/getting-started-with-vercel.

Before the first production deploy:

1. Add all env vars to Vercel project settings.
2. Create the three Stripe products (Starter $97 / Growth $197 / Scale $397) and copy their price IDs.
3. Register the Stripe webhook endpoint (`/api/webhooks/stripe`) and copy the signing secret.
4. Configure the Clerk application and paste its keys.
5. Run the workspace migration once (hit `/api/migrate-workspace` with `{ workspaceId: clerkUserId }`).
6. Have a lawyer review `/terms` and `/privacy` — they ship as templates only.
7. Set `settings.portalUrl` in `hq-settings` so the lease `{{PORTAL_URL}}` variable renders.

---

## License

Proprietary. All rights reserved.
