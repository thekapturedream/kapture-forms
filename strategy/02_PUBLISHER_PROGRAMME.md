# Kapture Forms · Publisher Programme

How we recruit, vet, onboard, pay, retain, and remove publishers.

---

## What we offer publishers

- **70/30 revenue share** in the publisher's favour
- **Monthly payouts** on the 1st, no minimum balance, paid via Stripe Connect
- **Free DPA + indemnity templates** drafted by Kapture's lawyer
- **Free editorial mark-up** — Kapture editor reviews every pack pre-publish, suggests fixes, doesn't charge
- **Hosted infrastructure** — buyers run the publisher's form on Kapture servers; the publisher never touches devops
- **Branded storefront page** — every publisher gets a profile page with their bio, packs, and credentials
- **Marketing distribution** — we feature 3 publishers per quarter in our outbound and content
- **Right of first refusal** on category expansions — if a publisher writes the first AML pack, they get first chance at the AML add-on packs

---

## Who we want

The ideal publisher is one of:

- **Compliance officer** at a mid-to-large operator (5+ years), now consulting independently
- **HR consultant** with a sector specialism (care, hospitality, construction, education)
- **Regulator-turned-consultant** (ex-CQC, ex-FCA, ex-Ofsted)
- **Trade body** with a member-facing publication (CIPD, ACAS, RICS, RIBA, BMA)
- **Sector specialist law firm** with a compliance practice (TLT, Bevan Brittan, etc.)

The signal we screen for: **they already write the form. Not in theory. In practice. Every week, for a different client. They have ten copies on their hard drive.** We give them the platform to monetise that work.

---

## Who we don't want

- General SaaS founders pivoting into "we should sell forms"
- Anyone who pitches an AI-generated form pack (we curate human-written + human-reviewed)
- Anyone who refuses the editorial review (the review is the moat)
- Anyone who wants exclusivity in a category (we want competing packs to keep quality up)
- Anyone who wants to bypass the £29 floor (the floor is the brand)

---

## Vetting process

| Step | Who | What |
|---|---|---|
| 1. Application | Publisher | Submits a sample pack + LinkedIn + 2 references via the publisher form |
| 2. Editorial review | Kapture editor | Maps fields against the regulator's schema, checks conditional logic, flags gaps |
| 3. Reference check | Kapture ops | Calls 2 references — *"Would you trust this person to write a pack you'd file with the regulator?"* |
| 4. DPA + indemnity sign | Publisher | Signs the templates we supply, returns by DocuSign |
| 5. Stripe Connect onboarding | Publisher | KYC, bank, tax — handled by Stripe |
| 6. Pack revision | Publisher | Addresses editorial feedback; re-submits |
| 7. Final approval | Kapture editor + ops | Both sign off, pack goes live |
| 8. Launch | Publisher + Kapture | Co-announcement on LinkedIn + email + storefront page |

Total expected time: 3–4 weeks from application to live. Faster for trade bodies (we want them in fast).

---

## Editorial review checklist

Every pack must pass:

- [ ] **Regulator mapping** — every required field per the regulator's published schema
- [ ] **Conditional logic correctness** — fields show/hide on the right triggers, no impossible states
- [ ] **Audit hash baked in** — submission produces a hash, hash is verifiable, hash is on every export
- [ ] **All 5 exports + hosted produce equivalent records** — no info loss between PDF and CSV
- [ ] **Plain English** — no jargon for the candidate-facing fields, regulator-language only where required
- [ ] **Mock data has no real PII** — every example uses fictional names
- [ ] **Pricing within the locked tiers** — £29 / £29mo / £199mo+; no negotiated specials
- [ ] **Publisher bio + credentials accurate** — verified against LinkedIn and references

A pack that fails any check goes back to the publisher with a fix list. Most packs need 1–2 revisions.

---

## Payout cycle

- **Cycle:** monthly, paid on the 1st of the following month
- **Cut-off:** sales completed by 23:59 UTC on the last day of the month
- **Threshold:** none — even a £20.30 publisher cut gets paid out
- **Method:** Stripe Connect Express, direct to the publisher's bank
- **Currency:** GBP only at launch; USD + EUR Q3 2027 when we go cross-border
- **Refunds:** if a buyer refunds, the publisher's cut is clawed back from the next payout (or netted off if balance is positive)
- **Statement:** every publisher gets a monthly PDF statement listing every sale, refund, and net payout

We **eat the float** — even if Stripe holds funds for fraud review, we pay publishers from working capital. Reputation > cash flow.

---

## Removal policy

A pack can be removed from the catalogue if:

1. **Regulator change** that makes the pack non-compliant — pack goes offline, publisher has 30 days to update
2. **Editorial mark-down** — if the pack quality drops (bad updates, broken logic) the editor can mark down and request fix
3. **Buyer complaints** — three substantiated complaints within 90 days triggers a re-review
4. **Publisher conduct** — anything that damages the marketplace brand (public attacks on Kapture, conflicts with other publishers, violation of DPA)

A removed pack stays bought-licence-honoured for existing buyers (we host their submissions until they export them out), but it does not appear in the catalogue or take new sales.

---

## Conflict policy

We allow **competing packs** in the same category. Two onboarding packs, three incident report packs, four MCA / DoLS packs — that's healthy. The buyer picks. The marketplace stays sharp.

We do **not** allow a publisher to attack another publisher's pack publicly. Disagreements go through Kapture editorial, not LinkedIn.

We do **not** allow a publisher to copy another publisher's pack. Editorial review checks for substantial similarity. Repeat copying is a removal trigger.

---

## The first 50

The first 50 publishers are personally recruited by Acie and the Kapture team. We do not run paid acquisition for publishers in year one. The bar is too high; the channel is wrong.

See `04_FIRST_50_PUBLISHERS.md` for the named list.

---

## What changes at scale

When we hit 100 publishers (Q2 2027 target):

- Editorial review goes from "human reviews every pack" to "human reviews 1 in 3, AI flags the rest"
- Publisher onboarding adds a paid tier — £499 application fee for non-invited publishers, refunded on first payout
- We open a **Premium Publisher** tier — invited only, gets featured-row placement, gets co-marketing, splits 75/25 instead of 70/30
- Trade-body partnerships move from one-off to formal — co-branded storefronts under the trade body's domain

By 100 publishers, the marketplace runs itself. We become the editor-in-chief, not the recruiter.
