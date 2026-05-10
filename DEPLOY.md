# Kapture Forms · Deploy

Standalone Next.js 14 app, deploys to Vercel, backed by Supabase + Stripe.
The Phase 1 static HTML still lives under `public/` for reference but the
production traffic now hits the Next.js routes in `src/app/`.

---

## One-time setup

### 1. Provision the third-party accounts

| Service | What to create | Notes |
|---|---|---|
| Supabase | New project `kapture-forms` (region `eu-west-2`) | Generate anon + service role keys. SMTP must be configured for magic links to actually deliver — set Resend / Postmark in **Auth → SMTP**. |
| Stripe | New account or workspace `kapture-forms` | Tax: enable Automatic Tax (UK VAT). Webhooks: see step 4. |
| Vercel | New project linked to `kapture-forms` git repo | Region `lhr1`. Add custom domain. |
| Domain | `kapture-forms.com` via Cloudflare or Vercel Domains | CNAME / A record to Vercel. |
| PostHog | EU project `kapture-forms` | Optional but recommended for funnel tracking. |
| Sentry | Project `kapture-forms` | Optional. |

### 2. Install + run locally

```bash
cd kapture-forms
npm install
cp .env.local.example .env.local
# Fill in .env.local with the values from step 1.
npm run dev
```

Local URL: http://localhost:3000

### 3. Apply the Supabase migration

```bash
# Option A — Supabase CLI (recommended for repeatable migrations)
supabase link --project-ref <kapture-forms-project-ref>
supabase db push

# Option B — paste-and-run in the SQL editor
cat supabase/migrations/001_init.sql
# Paste the output into Supabase Studio → SQL Editor → Run
```

The migration creates `products`, `customers`, `orders`, `licenses`,
`submissions`, `submission_events` and seeds the staff-onboarding product
row.

### 4. Wire the Stripe webhook

Once deployed (or while testing locally with `stripe listen`):

| Setting | Value |
|---|---|
| URL | `https://kapture-forms.com/api/webhooks/stripe` |
| Events | `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid` |
| Signing secret | Copy into `STRIPE_WEBHOOK_SECRET` |

For local development:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the signing secret into .env.local
```

### 5. (Optional) Pre-create Stripe Prices

The buy route falls back to inline `price_data` when no price ID is set,
which works for production — Stripe records each session correctly. But
pre-created prices make analytics and reporting cleaner.

```bash
# In the Stripe dashboard
# Products → New product → "Staff onboarding · UK care providers"
#   Pricing → £29.00 GBP one-time → save → copy ID into STRIPE_PRICE_STAFF_ONBOARDING_ONEOFF
#   Pricing → £29.00 GBP / month → save → copy ID into STRIPE_PRICE_STAFF_ONBOARDING_SUB
```

---

## Vercel deploy

```bash
# First time
npm install -g vercel
vercel link            # project: kapture-forms · scope: thekapturedream

# Set env (also do this in the Vercel dashboard for CI deploys)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add STRIPE_PRICE_STAFF_ONBOARDING_ONEOFF        # optional
vercel env add STRIPE_PRICE_STAFF_ONBOARDING_SUB           # optional
vercel env add NEXT_PUBLIC_POSTHOG_KEY                     # optional
vercel env add SENTRY_DSN                                  # optional
vercel env add RESEND_API_KEY                              # optional
vercel env add EMAIL_FROM                                  # optional

# Deploy
vercel deploy --prod
```

### Custom domain

```bash
vercel domains add kapture-forms.com
# Then add the DNS records Vercel prints (usually CNAME → cname.vercel-dns.com)
```

---

## Pre-launch checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds locally
- [ ] Supabase migration applied to production project
- [ ] Stripe webhook verified — `stripe trigger checkout.session.completed` lands a row in `orders` + `licenses`
- [ ] Magic-link email arrives end-to-end (test SMTP from Supabase Auth)
- [ ] Buy a £29 download in TEST MODE → land on `/success` → magic link → `/dashboard` shows the licence → PDF download works
- [ ] Buy a £29/mo subscription in TEST MODE → cancellation fires `customer.subscription.deleted` → licence flips to `cancelled`
- [ ] Hosted form runs at `/run/<licenseSlug>` → submission writes a row → audit hash present
- [ ] PostHog purchase events firing
- [ ] Sentry source maps uploaded (`sentry-cli releases new ...`)
- [ ] Vercel domain `kapture-forms.com` resolves with green padlock

---

## Routes shipped

| Path | Purpose |
|---|---|
| `/` | Marketplace landing |
| `/products/staff-onboarding-uk-care` | First live product page + buy buttons |
| `/auth/login` | Magic-link sign-in |
| `/auth/callback` | OTP exchange + customer ↔ user link |
| `/dashboard` | Buyer dashboard (licences, downloads, hosted URLs) |
| `/run/[slug]` | Hosted form runner (subscription tier) |
| `/success` | Post-checkout confirmation |
| `/api/buy/[productId]` | Creates a Stripe Checkout Session |
| `/api/webhooks/stripe` | Webhook → order + licence + magic link |
| `/api/submit/[slug]` | Form submission with SHA-256 audit hash |
| `/api/export/[slug]/pdf` | A4 print template (browser → save as PDF) |

---

## Rollback

`vercel rollback <deployment-url>` rolls to the previous successful deploy
without rebuilding. If a Stripe charge fired against a buggy product,
refund via the Stripe dashboard and email the buyer with credit. Refunds
should leave a row in `orders` with `status='refunded'`.

---

## Phase 2 (post-launch) backlog

- Replace HTML print template with `@react-pdf/renderer` for true PDF
- DOCX export via `docx` npm package
- Google Forms JSON export
- Embed widget for buyers' careers pages (`/embed/[slug]`)
- Admin queue at `/admin` for HR approvers
- Inspector read-only view at `/inspect/[slug]?token=...`
- Multi-product checkout (cart) for the bundle SKU
- Stripe Connect onboarding for the publisher programme
