# Claude project instructions — kapture-forms

Future Claude sessions land here. This file tells you what the project is, how it differs from sister Kapture products, what the active priorities are, and what NOT to do.

---

## You are working on Kapture Forms

Kapture Forms is a **vertical marketplace** of pre-built compliance forms. It is **not** a feature inside another Kapture product. It has its own brand, its own pricing, its own publishers, its own GitHub repo (when bootstrapped).

The first live product on the marketplace is **Staff onboarding · UK care providers**. That product is co-branded with kooper · care because kooper is the first reference customer. Other future products will be standalone.

When in doubt about scope, the test is: *"Is this a marketplace concern (industry tiles, pricing tiers, publisher programme, exports) or a product concern (the actual form pack)?"* Each gets edited in its own surface.

---

## Active phase

Phase 1 — **shell complete**. Static HTML scaffold ships under `public/` with one live product. Verified live at the demo URL via the original kooper-care.vercel.app proxy.

Phase 2 — **Next.js migration**. Bootstrap the Next.js 14 app, port the marketplace shell + the first product into `src/app/`, wire Supabase auth + RLS, wire Stripe for one-off + subscription + 70/30 publisher payouts.

Phase 3 — **second + third product**. Patient intake (primary care). Incident report (adverse event). Each is a copy-of-onboarding pattern with regulator-specific fields.

Phase 4 — **publisher onboarding**. Editorial review pipeline. DPO + DPA templates. Stripe Connect for publisher payouts.

See `ROADMAP.md` for dates.

---

## Standing rules

1. **Brand chrome is locked.** Do not invent new colours, fonts, or logo variations. Pull tokens from `BRAND.md` and `tailwind.config.ts`. Black, white, yellow. Inter, Space Grotesk, JetBrains Mono, Source Serif 4. The Kapture sun logomark.
2. **Two nav patterns only.** Marketing pages get the marketplace nav (Industries, Featured, Exports, Pricing, Publisher CTA). Product pages get their own nav. No mixing. The shared `public/kooper-nav.js` enforces responsive cleanup.
3. **Audit hash on every submission.** Every form pack must compute and stamp an audit hash. No exceptions. Inspectors verify against this.
4. **Five export formats + hosted.** PDF, DOCX, HTML embed, CSV, Google Forms spec. Plus the hosted run. Every product ships all six paths.
5. **70/30 publisher revenue share.** Public commitment. Do not negotiate this down per-publisher without `LAUNCH.md` review.
6. **No real PII in seeded data.** Demo data only. Seeded names are fictional. Mark every page with the `Mock data · no real PII` footer.

---

## What NOT to do

- **Do NOT** turn Kapture Forms into a kooper · care submodule. The cross-link to kooper for the onboarding product is intentional and limited. Forms must be defensible standalone for the other 9 industries.
- **Do NOT** add new export formats without product review. Five + hosted is the locked menu. Adding a sixth dilutes the price ladder.
- **Do NOT** charge less than £29 for any pack. The price floor is brand integrity; we are not racing free form-builders to the bottom.
- **Do NOT** bypass editorial review on publisher submissions. Every pack passes a regulator-mapping check before going live.

---

## Where the live product is hosted

For now, the kapture-forms HTML files are served from the **kapture-care/public/** directory of the kooper-care repo on Vercel — same domain, same deploy. Once Phase 2 lands, kapture-forms will move to its own Vercel project at **forms.kapture.com** (or similar).

Until then, edits to the live HTML in this folder also need to be mirrored into:
`/Users/macstore/Documents/Claude/Projects/Kaptire Website Templates/kapture-care/public/`

After Phase 2 the deploy decouples and you mirror nothing — kapture-forms ships from its own repo.

---

## Tech stack (Phase 2 onward)

- Next.js 14 App Router · TypeScript strict
- Tailwind CSS · Kapture component library
- Supabase Auth + Postgres + Storage · RLS on every table
- Stripe (one-off + subscription + Stripe Connect for publisher payouts)
- Vercel hosting
- PostHog analytics · Sentry errors
- Claude Sonnet for narrative + anomaly + digest

When you write code, copy patterns from `kapture-care/src/` and `kapture-logistics/src/` for consistency.

---

## Current task (reset every session)

> Replace this line with your current focus when you start a session.

---

## Sister projects in this workspace

- `../kapture-care/` — modular care SaaS. First customer for the onboarding product.
- `../kapture-logistics/` — logistics audit. Reference for the marketing chrome.
- `../kurongeka/` — domain audit storefront. Reference for the storefront pattern.

If you find yourself wanting to add a feature that Kapture Care already has, **first check** if you can call into it instead of rebuilding.
