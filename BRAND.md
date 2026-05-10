# Kapture Forms · Brand

The brand is the same Kapture brand — black + neutral scale + yellow accent, locked logomark, locked font stack. Forms gets a tighter wordmark variation but never a new palette, never a new logo.

---

## Wordmark

`forms · store` — lowercase, dot separator with thin-spaced gap, Space Grotesk display.

- "forms" — `font-weight: 600`
- "·" — muted (rgba 60% on dark, neutral on light), spaced with `gap: 0.5rem`
- "store" — `font-weight: 500`, **yellow** (`#FFD400`) when next to "forms" on a dark surface; otherwise black

Never write `Forms Store` or `KaptureForms` or `Kapture-Forms`. The lowercase + dot separator is the brand.

When pairing with the parent brand: `Kapture · Forms` (with a single dot) is acceptable in long-form contexts (e.g. publisher contracts, footer copyright).

---

## Logomark

The Kapture sun — 8-dot mandala with the top-right intercardinal in `#FFD400`. Same component, same usage, same proportions as kapture-care and kapture-logistics.

Sizes: 22px (footer), 24px (small nav), 28px (regular nav), 36px (mobile launch).

```svg
<svg viewBox="0 0 512 512" width="28" height="28" fill="none" aria-label="Kapture" role="img">
  <!-- 7 black dots + 1 yellow dot at intercardinal -->
  <path fill="currentColor" d="…"/>
  <path fill="#FFD400" d="M436.327 75.173c…"/>
</svg>
```

Use `currentColor` on the body so the dots inherit the surrounding text colour.

---

## Palette

| Token | Hex | Use |
|---|---|---|
| `kapture-black` | `#0A0A0A` | Primary surface on dark, primary text on light |
| `kapture-ink` | `#111111` | Subtle layered black |
| `kapture-coal` | `#1A1A1A` | Card surfaces on dark |
| `kapture-ash` | `#2A2A2A` | Borders on dark, hover states |
| `kapture-smoke` | `#3A3A3A` | Body text on light, deep neutral |
| `kapture-mist` | `#9A9A9A` | Muted text, captions |
| `kapture-fog` | `#D4D4D4` | Hairlines, borders on light |
| `kapture-paper` | `#F5F5F5` | Off-white surface |
| `kapture-white` | `#FFFFFF` | Pure white surface |
| `kapture-yellow` | `#FFD400` | Primary accent, CTA, highlights |
| `kapture-amber` | `#F5B400` | Hover state for yellow CTAs |

Status layer:

| Token | Hex | Use |
|---|---|---|
| `status-critical` | `#E5484D` | Errors, danger, returned submissions |
| `status-warning` | `#FFD400` | Pending, awaiting review (matches accent) |
| `status-ok` | `#10B981` | Approved, live, healthy |
| `status-neutral` | `#D4D4D4` | Inactive, n/a |

Industry sector accents (for Forms only — never used elsewhere):

| Industry | Tag colour | Use |
|---|---|---|
| Healthcare | `#FFD400` | LIVE — yellow + green badge stack |
| HR & people | `#A5B4FC` | Indigo |
| Finance & banking | `#10B981` | Emerald |
| Legal | `#1F4E53` | Teal-deep |
| Education | `#FDA4AF` | Pink |
| Hospitality | `#F5B400` | Amber |
| Real estate | `#86EFAC` | Mint |
| Construction | `#FCD34D` | Sand-yellow |
| Public sector | `#0A0A0A` | Black |
| Logistics | `#5B21B6` | Violet |

These are tag-only, never primary surface colours. Keep usage to the industry chip on the marketplace landing.

---

## Typography

| Family | Use | Weight |
|---|---|---|
| Inter | Body, UI, forms | 400 / 500 / 600 |
| Space Grotesk | Display, headlines, wordmark | 500 / 600 / 700 |
| JetBrains Mono | Numbers, codes, IDs, timestamps, footer meta | 500 / 600 |
| Source Serif 4 | Long-form prose, editorial decks, italic ledes | 400 / 600 italic |

Display sizes use `clamp()` for responsiveness:

```css
.h-section { font-family: 'Space Grotesk'; font-weight: 600; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05; letter-spacing: -0.02em; }
.h-hero    { font-family: 'Space Grotesk'; font-weight: 700; font-size: clamp(2.5rem, 6vw, 5.5rem); line-height: 0.95; letter-spacing: -0.04em; }
```

Editorial deck (the italic serif lede after a kicker): `font-family: 'Source Serif 4'; font-style: italic; font-size: clamp(1.0625rem, 1.3vw, 1.1875rem); line-height: 1.5; color: #3A3A3A;`

---

## Components

Locked patterns shared across Kapture Forms:

- **Kicker** — yellow 24×2px bar + JetBrains Mono uppercase 0.6875rem letter-spacing 0.14em
- **Chip** — pill, 0.25rem 0.625rem padding, JetBrains Mono 0.625rem-0.75rem
- **Yellow CTA** — `#FFD400` background, `#0A0A0A` text, 10px radius, font-weight 600. Hover: `#F5B400`.
- **Ghost-light** — transparent on dark, white border at 25% opacity. Hover: white at 8%.
- **Industry card** — 14px radius, `#FAFAF7` surface, hover lifts 2px and adds yellow border.
- **Product card** — separate cover (black) and body (white) with footer (paper). Live badge top-right.
- **Format badge** — uppercase JetBrains Mono 0.625rem 0.04em letter-spacing, 6px radius. Each format gets a fixed colour (PDF red, DOCX blue, HTML black/yellow, CSV green, GFORMS purple, HOSTED yellow).

---

## Voice

Kapture Forms speaks in **calm authority**. The pitch is built for compliance officers, HR leads, and operators — not consumer SaaS buyers.

**Do** — short declarative sentences. Numbers as digits in product specs. Named consequences. Direct CTAs ("Open product →" not "Click here to learn more").

**Don't** — superlatives ("revolutionary", "next-gen", "game-changer"). Stacked rhetorical questions. Em-dash-fragment cascades. Negation-affirmation pairs ("not just X, it's Y"). The cadence-stacking-filter rule applies.

Buyer should feel: *"This was built by someone who has actually been in front of the regulator."*

---

## Don't list

- No new logo variants. Use the Kapture sun.
- No new fonts. The 4-family stack is the system.
- No primary colour outside the listed palette. Industry accents are tag-only.
- No emoji in product copy (UI tooling chips are fine).
- No "buy now" pressure tactics. Calm authority.
- No real PII in seeded demo data. Mock data only.
