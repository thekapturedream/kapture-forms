import Link from "next/link";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { SearchHero } from "@components/SearchHero";
import { MotionFade } from "@components/MotionFade";
import { getIndustries, SEARCH_CATALOG } from "@lib/search-catalog";

/**
 * Landing — theme-aware (dark default, light toggle), centred mobile-first,
 * solid colours only, subtle scroll fade-ups, complete feature surface.
 */

const FORMATS = [
  { tag: "PDF", title: "Print-ready PDF", body: "A4. Signature block. Audit footer." },
  { tag: "DOCX", title: "Editable Word", body: "Track-changes ready. Your house style." },
  { tag: "HTML", title: "Embeddable form", body: "Drop into your careers page. Same audit." },
  { tag: "CSV", title: "Schema + submissions", body: "Bamboo · Breathe · Workday import-ready." },
  { tag: "GFORMS", title: "Google Forms", body: "Apps Script importer. Recreate in seconds." },
  { tag: "HOSTED", title: "Hosted runner", body: "Branded URL. Magic links. Inspector view." },
];

const HOW_STEPS = [
  { n: "01", title: "Search a form.", body: "30+ packs across 10 industries. Live and on the roadmap." },
  { n: "02", title: "Pick your plan.", body: "Buy once for £29 or run hosted for £29 / mo. Cancel anytime." },
  { n: "03", title: "Get five formats.", body: "PDF, DOCX, HTML, CSV, Google Forms. Same audit hash everywhere." },
];

export default function HomePage() {
  const industries = getIndustries();
  const totalForms = SEARCH_CATALOG.length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(255,212,0,0.10),_transparent_60%)] pointer-events-none"
          />
          <div className="relative mx-auto w-full max-w-[1100px] px-5 sm:px-6 lg:px-10 pt-14 sm:pt-20 lg:pt-28 pb-14 lg:pb-20 text-center">
            <MotionFade>
              <h1 className="font-semibold tracking-[-0.04em] text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[5rem] sm:leading-[0.98]">
                Forms for everything.
              </h1>
            </MotionFade>
            <MotionFade delay={0.08}>
              <p className="mt-5 sm:mt-6 text-[15px] sm:text-base lg:text-lg text-kapture-smoke dark:text-white/55 max-w-xl mx-auto leading-relaxed">
                Pre-built. Audit-hashed. Five formats. £29 a pack.
              </p>
            </MotionFade>
            <MotionFade delay={0.16}>
              <div className="mt-10 sm:mt-12">
                <SearchHero />
              </div>
            </MotionFade>
          </div>
        </section>

        {/* FORMATS */}
        <section id="formats" className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
            <MotionFade>
              <SectionHeader kicker="01 · EXPORT FORMATS" title="One pack. Five files. One hosted URL." />
            </MotionFade>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {FORMATS.map((f, i) => (
                <MotionFade key={f.tag} delay={i * 0.04}>
                  <FormatCard tag={f.tag} title={f.title} body={f.body} />
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/30 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
            <MotionFade>
              <SectionHeader kicker="02 · HOW IT WORKS" title="Three steps from search to signed." />
            </MotionFade>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {HOW_STEPS.map((s, i) => (
                <MotionFade key={s.n} delay={i * 0.06}>
                  <div className="text-center md:text-left">
                    <div className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-kapture-mist">
                      {s.n}
                    </div>
                    <h3 className="mt-2 font-bold text-xl tracking-[-0.015em] text-kapture-black dark:text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-kapture-smoke dark:text-white/55 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
            <MotionFade>
              <SectionHeader kicker="03 · PRICING" title="Three ways in." />
            </MotionFade>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <MotionFade delay={0}>
                <TierCard
                  kicker="DOWNLOAD"
                  title="Buy a pack."
                  price="£29"
                  priceFoot="once · all formats"
                  body="One-off purchase. Five export formats. Lifetime updates."
                  cta={{ label: "Buy now", href: "/products/staff-onboarding-uk-care#buy", primary: true }}
                />
              </MotionFade>
              <MotionFade delay={0.06}>
                <TierCard
                  kicker="HOSTED"
                  title="Run hosted."
                  price="£29 / mo"
                  priceFoot="branded URL · queue"
                  body="Magic-link invites, HR queue, audit hash on every submission."
                  cta={{ label: "Start hosted", href: "/products/staff-onboarding-uk-care#buy", primary: false }}
                  highlight
                />
              </MotionFade>
              <MotionFade delay={0.12}>
                <TierCard
                  kicker="PUBLISH"
                  title="List your pack."
                  price="70 / 30"
                  priceFoot="publisher / platform"
                  body="Your form pack is an asset. List it. Earn 70% on every sale."
                  cta={{ label: "Apply", href: "mailto:forms@thekapture.com?subject=Publisher%20application", primary: false }}
                />
              </MotionFade>
            </div>
          </div>
        </section>

        {/* INDUSTRIES */}
        <section id="industries" className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/30 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
            <MotionFade>
              <SectionHeader
                kicker="04 · INDUSTRIES"
                title={`${totalForms} forms. 10 industries.`}
              />
            </MotionFade>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {industries.map((ind, i) => (
                <MotionFade key={ind.name} delay={i * 0.03}>
                  <IndustryTile name={ind.name} count={ind.count} live={ind.live} />
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST + STAT */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <Stat label="LIVE" value="1 pack" caption="Staff onboarding · UK care" />
            <Stat label="ROADMAP" value={`${totalForms}+`} caption="Across 10 industries" />
            <Stat label="SECURITY" value="SHA-256" caption="Audit hash on every submission" />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 sm:py-16 text-center">
            <MotionFade>
              <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white">
                Five formats. One pack. £29.
              </h2>
            </MotionFade>
            <MotionFade delay={0.08}>
              <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/products/staff-onboarding-uk-care#buy"
                  className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-5 py-3 rounded-full font-semibold text-sm transition"
                >
                  Buy now →
                </Link>
                <Link
                  href="/how-to"
                  className="inline-flex items-center gap-2 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 px-5 py-3 rounded-full font-semibold text-sm transition"
                >
                  How-to guides
                </Link>
              </div>
            </MotionFade>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ---------------- header ---------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Logo on="dark" />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/#formats" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Formats</Link>
          <Link href="/#how" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How</Link>
          <Link href="/#pricing" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Pricing</Link>
          <Link href="/#industries" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Industries</Link>
          <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How-to</Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle size={36} />
          <Link
            href="/products/staff-onboarding-uk-care#buy"
            className="inline-flex items-center gap-1.5 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            Buy
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- shared bits ---------------- */

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8 sm:mb-10 text-center md:text-left">
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist dark:text-white/40 mb-2">
        {kicker}
      </div>
      <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl tracking-[-0.025em] text-kapture-black dark:text-white">
        {title}
      </h2>
    </div>
  );
}

function FormatCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 transition hover:border-kapture-mist dark:hover:border-white/25">
      <span className="inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded">
        {tag}
      </span>
      <h3 className="mt-3 font-bold text-base text-kapture-black dark:text-white tracking-[-0.01em]">{title}</h3>
      <p className="mt-1.5 text-sm text-kapture-smoke dark:text-white/55 leading-relaxed">{body}</p>
    </div>
  );
}

interface CardProps {
  kicker: string; title: string; price: string; priceFoot: string; body: string;
  cta: { label: string; href: string; primary: boolean }; highlight?: boolean;
}
function TierCard({ kicker, title, price, priceFoot, body, cta, highlight }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border p-5 sm:p-6 flex flex-col transition ${
        highlight
          ? "border-kapture-black dark:border-kapture-yellow/60 bg-white dark:bg-white/[0.03] shadow-[0_8px_40px_rgba(255,212,0,0.08)]"
          : "border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-kapture-mist dark:hover:border-white/25"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 right-5 inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full">
          MOST POPULAR
        </span>
      )}
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-kapture-mist dark:text-white/40">{kicker}</div>
      <h3 className="mt-2 font-bold text-xl tracking-[-0.015em] text-kapture-black dark:text-white">{title}</h3>
      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="font-bold text-[1.75rem] tracking-[-0.025em] leading-none text-kapture-black dark:text-white">{price}</span>
        <span className="text-xs text-kapture-mist dark:text-white/45 font-mono uppercase tracking-wider">{priceFoot}</span>
      </div>
      <p className="mt-3 text-sm text-kapture-smoke dark:text-white/65 leading-relaxed flex-1">{body}</p>
      <Link
        href={cta.href}
        className={`mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
          cta.primary
            ? "bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
            : "bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90"
        }`}
      >
        {cta.label} →
      </Link>
    </div>
  );
}

function IndustryTile({ name, count, live }: { name: string; count: number; live: number }) {
  return (
    <div className="rounded-xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-4 transition hover:border-kapture-mist dark:hover:border-white/25">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40">
          {live > 0 ? `LIVE · ${live}` : "SOON"}
        </span>
        {live > 0 && <span className="w-1.5 h-1.5 rounded-full bg-kapture-yellow" />}
      </div>
      <h3 className="font-semibold text-sm text-kapture-black dark:text-white">{name}</h3>
      <p className="text-xs text-kapture-smoke dark:text-white/55 mt-0.5">{count} pack{count === 1 ? "" : "s"}</p>
    </div>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist dark:text-white/40 mb-1.5">{label}</div>
      <div className="font-bold text-2xl tracking-[-0.02em] leading-none text-kapture-black dark:text-white">{value}</div>
      <div className="text-sm text-kapture-smoke dark:text-white/55 mt-1.5">{caption}</div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-mist dark:text-white/40">
          © {new Date().getFullYear()} Kapture · UK
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55">
          <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
          <Link href="/how-to/audit-hash" className="hover:text-kapture-black dark:hover:text-white">Audit hash</Link>
          <Link href="/how-to/regulators" className="hover:text-kapture-black dark:hover:text-white">Regulators</Link>
          <Link href="mailto:forms@thekapture.com?subject=Publisher%20application" className="hover:text-kapture-black dark:hover:text-white">Publishers</Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
          <Link href="https://thekapture.com" className="hover:text-kapture-black dark:hover:text-white">thekapture.com</Link>
        </div>
      </div>
    </footer>
  );
}
