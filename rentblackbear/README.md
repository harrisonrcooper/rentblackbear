# Black Bear Rentals — rentblackbear.com

Furnished co-living rental platform for Black Bear Properties / Oak & Main Development LLC.

## What's Inside

```
rentblackbear/
├── app/
│   ├── layout.jsx          ← Root HTML layout
│   ├── globals.css          ← Base CSS reset
│   ├── page.jsx             ← PUBLIC SITE (what tenants see)
│   ├── api/chat/route.js    ← AI chat API endpoint
│   └── admin/
│       ├── page.jsx         ← PM DASHBOARD (your admin panel)
│       └── theme/page.jsx   ← THEME EDITOR (change colors)
├── lib/
│   └── data.js              ← ALL YOUR DATA (properties, rooms, prices, colors, settings)
├── package.json
├── next.config.js
└── README.md
```

## How to Edit

**To change property info, pricing, rooms, or colors:**
Edit `lib/data.js` — this is the single source of truth for the entire site.

**To edit the public site:**
Edit `app/page.jsx`

**To edit the admin dashboard:**
Edit `app/admin/page.jsx`

**To edit the theme editor:**
Edit `app/admin/theme/page.jsx`

## Deploy to Vercel (Free) — Step by Step

### 1. Create Accounts (5 min)
- Go to https://github.com → Sign up (free)
- Go to https://vercel.com → Sign up with GitHub (free)

### 2. Upload to GitHub (5 min)
- Go to https://github.com/new
- Repository name: `rentblackbear`
- Click "Create repository"
- On your computer, open Terminal and run:
```bash
cd path/to/rentblackbear
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rentblackbear.git
git push -u origin main
```

**Don't have git? Alternative:** On the GitHub repo page, click "uploading an existing file" and drag the entire contents of this folder in.

### 3. Deploy on Vercel (5 min)
- Go to https://vercel.com/dashboard
- Click "Add New" → "Project"
- Select your `rentblackbear` repository
- Framework: Next.js (should auto-detect)
- Click "Deploy"
- Wait 1-2 minutes. Your site is now live at a `.vercel.app` URL!

### 4. Connect Your Domain (10-30 min)
- In Vercel: Project → Settings → Domains
- Add `rentblackbear.com`
- Vercel shows you DNS records to add
- Go to your domain registrar (GoDaddy, Namecheap, etc.)
- Add the DNS records Vercel gave you
- Wait 10-30 minutes for propagation
- Done! rentblackbear.com is live.

### 5. Add AI Chat (Optional, ~$5-10/mo)
- Go to https://console.anthropic.com
- Create account, add payment method
- Create an API key
- In Vercel: Project → Settings → Environment Variables
- Add: Name = `ANTHROPIC_API_KEY`, Value = your key
- Redeploy (Vercel → Deployments → Redeploy)

Without the API key, the chat widget gracefully shows a "contact us" message instead.

## Making Updates

After deploying, to make changes:
1. Edit the file(s) locally
2. Push to GitHub:
```bash
git add .
git commit -m "Updated pricing"
git push
```
3. Vercel auto-deploys in ~30 seconds

Or: Edit files directly on GitHub.com (click the file → pencil icon → edit → commit)

## URLs

- **Public site:** rentblackbear.com
- **Admin dashboard:** rentblackbear.com/admin
- **Theme editor:** rentblackbear.com/admin/theme

## Important Notes

- The admin pages are NOT password-protected yet. Don't put sensitive info there until auth is added.
- Tenant data in lib/data.js is sample/placeholder data. Replace with your real info.
- The AI chat requires an Anthropic API key to work. Without it, users see a friendly fallback message.
- All hosting on Vercel's free tier. No credit card required.
