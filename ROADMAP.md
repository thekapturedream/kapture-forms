# Kapture Forms · Roadmap

Phased plan from shell-shipped (today) to ten-industry marketplace with publisher programme (Q3 2027).

---

## Phase 1 — Marketplace shell (NOW · May 2026)

✅ Landing page with hero, ten industries, six featured products, export format showcase, four pricing tiers, publisher programme CTA.
✅ First live product: Staff onboarding · UK care providers (4 pathways, 5 export formats, role-based login views, HR queue, audit hash).
✅ Brand chrome locked across surfaces.
✅ Proxied via kapture-care/public on Vercel (kooper-care.vercel.app/kooper-forms.html).

**What's missing:** standalone deploy, real Stripe, real publisher pipeline, the other 9 industry products.

---

## Phase 2 — Next.js migration + Stripe (Q2 2026)

**Goal:** kapture-forms.com goes live as a standalone site with real payments.

- [ ] Bootstrap Next.js 14 App Router from kapture-care template (copy, strip)
- [ ] Port marketplace landing to `src/app/page.tsx`
- [ ] Port onboarding product to `src/app/products/staff-onboarding-uk-care/page.tsx`
- [ ] Wire Supabase Auth + RLS for buyer accounts
- [ ] Wire Stripe Checkout for £29 download + £29/mo subscription
- [ ] Wire `/api/buy/[productId]` route + webhook
- [ ] Buy → email magic link → access download or hosted dashboard
- [ ] Invoice PDF, VAT-aware
- [ ] Vercel project + custom domain (forms.kapture.com or kapture-forms.com)
- [ ] PostHog + Sentry
- [ ] SEO setup mirroring kapture-care

**Success metric:** First paying customer on a £29/mo hosted plan.

---

## Phase 3 — Second + third healthcare products (Q3 2026)

**Goal:** prove the format works for more than one form pack.

- [ ] **Patient intake · primary care** (3 pathways, 12 sections) — new patient registration, GP transfer, NHS-funded continuing healthcare
- [ ] **Incident report · adverse event** (5 categories, 8 sections) — falls, medication errors, pressure injuries, behaviour, near-miss
- [ ] Each ships with the same five export formats + hosted run
- [ ] Each gets editorial review before going live (pattern locked here for the publisher programme)

**Success metric:** £5K MRR across the three healthcare products.

---

## Phase 4 — Publisher programme launch (Q4 2026)

**Goal:** open the marketplace to outside publishers.

- [ ] Stripe Connect for 70/30 publisher payouts
- [ ] Publisher dashboard — submission, draft, editorial review, revenue, payout schedule
- [ ] Editorial review pipeline + DPA + indemnity templates supplied
- [ ] First 10 invited publishers (compliance officers, HR consultants, sector specialists)
- [ ] First publisher pack live + payout cycle complete
- [ ] Trustpilot, G2, Capterra listings

**Success metric:** 5 publisher packs live, 1 publisher earning £1K+ per month.

---

## Phase 5 — Three more industries (Q1 2027)

**Goal:** prove the marketplace is industry-agnostic.

- [ ] **HR & people** — onboarding, performance, exit, grievance, return-to-work (5 packs)
- [ ] **Finance & banking** — KYC, AML, FCA suitability, customer onboarding (4 packs)
- [ ] **Legal** — client intake, conflict checks, regulatory notices, AML (4 packs)
- [ ] Each industry gets its own landing tile + 3-5 launch packs

**Success metric:** £25K MRR across all packs, 30% non-healthcare.

---

## Phase 6 — Long tail industries (Q2–Q3 2027)

**Goal:** complete the ten-industry marketplace.

- [ ] **Education** — admissions, parent consent, SEND plans, trip forms
- [ ] **Hospitality** — booking T&Cs, supplier onboarding, EHO compliance
- [ ] **Real estate** — tenant referencing, AML, property disclosure, EPC
- [ ] **Construction** — RAMS, H&S, CDM, contractor onboarding, near-miss
- [ ] **Public sector** — grants, licensing, disclosure, citizen service requests
- [ ] **Logistics** — driver onboarding, tachograph, customs, incident

**Success metric:** £100K MRR, 10 industries live, 25 publishers, 50+ packs.

---

## Out of scope for this roadmap

- White-label form-builder (we curate, we don't let buyers build from scratch)
- Embedded form widgets in third-party CMSes (this is an export, not a feature)
- Mobile native apps (the hosted web form works on mobile)
- Form analytics dashboards beyond submission counts (not our market)

---

## Dependencies that must be in place before Phase 4

- DPA template signed off by Kapture's lawyer
- Stripe Connect onboarding flow tested with three pilot publishers
- Editorial review checklist documented (regulator mapping, conditional logic, audit hash, export schema)
- Publisher payout cycle: monthly, on the 1st, minimum £100 balance
- Right-of-removal clause for non-compliant packs
- VAT handling: publisher charges Kapture, Kapture charges buyer, Kapture remits
