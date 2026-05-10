# Kapture Forms

The forms store. Pre-built, branded, audit-hashed compliance forms for every industry — exported in five formats (PDF, DOCX, HTML, CSV, Google Forms) or run hosted with magic-link invitations and a queue. Curated marketplace, 70/30 publisher revenue share.

> One form pack. Five export formats. Sold as a download, run as a hosted licence, or listed by a publisher.

---

## What this product is

Kapture Forms is a vertical marketplace of regulator-mapped, audit-hashed compliance forms. Each pack is a pre-engineered template — fields locked to the regulator's required schema, conditional logic per role / setting / risk band, signed submissions, immutable audit trail. Buyers pick the pack their sector needs and pick how they want to consume it (download once, run hosted, embed, export to their HRIS).

The first live product is **Staff onboarding · UK care providers** — four pathways (permanent clinical, permanent non-clinical, agency / bank, volunteer / student). It ships co-branded with kooper · care for the kooper customer base, and standalone for any UK care provider via Kapture Forms.

The next nine industry packs are scheduled across 2026–2027 (see `ROADMAP.md`).

---

## Why this exists

The compliance form layer is the most underbuilt part of every UK SaaS stack. Care, finance, legal, education, hospitality, real estate, construction, public sector, logistics — every operator hand-rolls onboarding, intake, incident, and consent forms in Word, Google Forms, or a tired SaaS form-builder, then loses the audit trail the moment the file leaves the browser. Kapture Forms solves the four problems at once: pre-engineered fields the regulator already accepts, conditional logic that mirrors how the role works, audit hash on every submission, and the export format the buyer's stack actually consumes.

---

## Stack (Kapture standard)

- **Framework:** Next.js 14 App Router, TypeScript strict
- **Styling:** Tailwind CSS, Kapture component library (`btn-kapture`, `chip-kapture`, etc.)
- **Auth:** Supabase Auth (PKCE OAuth, magic links, optional WebAuthn)
- **Database:** Supabase Postgres with row-level security on every table
- **Storage:** Supabase Storage for evidence uploads, signed PDFs, exports
- **AI:** Claude Sonnet for narrative drafts, anomaly detection, weekly digests
- **Hosting:** Vercel (Edge functions for read-heavy paths)
- **Analytics:** PostHog
- **Errors:** Sentry
- **Payments:** Stripe (one-off downloads + hosted subscriptions + publisher payouts)

The Next.js app is the production ship. Static HTML in `public/` is kept as
reference but no longer serves traffic.

---

## What ships today

| Surface | Path | Status |
|---|---|---|
| Marketplace landing | `src/app/page.tsx` | Live |
| Product page | `src/app/products/staff-onboarding-uk-care/page.tsx` | Live · 4 pathways · 5 exports |
| Stripe Checkout | `src/app/api/buy/[productId]/route.ts` | Live · £29 + £29/mo |
| Stripe webhook | `src/app/api/webhooks/stripe/route.ts` | Live · provisions order + licence + magic link |
| Magic-link sign-in | `src/app/auth/login` + `src/app/auth/callback` | Live |
| Buyer dashboard | `src/app/dashboard/page.tsx` | Live |
| Hosted form runner | `src/app/run/[slug]/page.tsx` | Live · SHA-256 audit hash |
| Submission API | `src/app/api/submit/[slug]/route.ts` | Live |
| PDF export | `src/app/api/export/[slug]/pdf/route.ts` | A4 print template (Phase 2 → real PDF) |
| Schema | `supabase/migrations/001_init.sql` | RLS on every table |
| Brand tokens | `BRAND.md` + `tailwind.config.ts` | Locked |
| Strategy | `strategy/` | First wave drafted |
| Phase 1 static HTML | `public/index.html` | Reference only · superseded |

---

## Pricing model

| Tier | Use case | Price |
|---|---|---|
| Single download | One-time, lifetime use, single workspace | £29 / pack |
| Hosted licence | Branded URL, magic-link invites, queue, audit | £29 / mo / pack |
| Group / NHS / multi-site | Group rollup, SSO, custom templates | From £199 / mo |
| Marketplace publisher | List your pack, earn revenue | 70 / 30 (publisher / platform) |

Add-ons: DOCX export £9 / pack · HTML embed £19 / domain · Google Forms spec £12 / pack.

---

## Repo structure

```
kapture-forms/
├── README.md                  # this file
├── CLAUDE.md                  # instructions for future Claude sessions
├── BRAND.md                   # locked design tokens + chrome rules
├── DEPLOY.md                  # Vercel + Supabase deploy notes
├── ROADMAP.md                 # phased plan, Q2 2026 → Q3 2027
├── LAUNCH.md                  # go-to-market plan
├── package.json               # Next.js 14 stub
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── .gitignore
├── public/                    # static HTML ships today, Next.js migration Phase 2
│   ├── index.html             # marketplace landing
│   ├── kooper-nav.js          # shared nav (responsive cleanup, marketing vs app)
│   ├── assets/                # logomarks, screenshots
│   └── products/
│       └── staff-onboarding-uk-care.html
├── src/                       # Next.js app (Phase 2)
├── supabase/                  # migrations, RLS policies (Phase 2)
└── strategy/
    ├── 01_MASTER_STRATEGY.md
    ├── 02_PUBLISHER_PROGRAMME.md
    ├── 03_GO_TO_MARKET.md
    └── 04_FIRST_50_PUBLISHERS.md
```

---

## Quickstart

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase + Stripe keys. See DEPLOY.md for the full setup.

# Apply the schema once
supabase link --project-ref <project-ref>
supabase db push

# Local dev
npm run dev   # http://localhost:3000

# Type-check + build
npm run type-check
npm run build

# Ship
vercel deploy --prod
```

For Stripe webhook testing locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the printed signing secret into STRIPE_WEBHOOK_SECRET in .env.local
```

---

## Brand chrome

Kapture Forms uses the locked Kapture brand — black + neutral scale + yellow accent.

- **Logomark:** the Kapture sun (8-dot mandala with top-right intercardinal in `#FFD400`).
- **Wordmark:** `forms · store` lowercase, dot separator, Space Grotesk display. Never `Forms Store` or `KaptureForms`.
- **Palette:** `#0A0A0A` black, `#FFD400` yellow, neutral scale `#1A1A1A` → `#F5F5F5`.
- **Fonts:** Inter (body), Space Grotesk (display), JetBrains Mono (numbers + tags), Source Serif 4 (long-form prose, italic decks).

See `BRAND.md` for full token spec.

---

## Sister products

- **kooper · care** ([github.com/thekapturedream/kooper-care](https://github.com/thekapturedream/kooper-care)) — modular care management. The first Kapture Forms product (staff onboarding) is co-branded with kooper for the care vertical.
- **kapture-logistics** ([github.com/thekapturedream/...](https://github.com/thekapturedream)) — logistics audit + procurement. Future Kapture Forms packs will list under the logistics industry tile.
- **kurongeka.com** — domain audit storefront. Same Kapture stack, different category.

---

## License

Proprietary © 2026 Kapture. All rights reserved.
