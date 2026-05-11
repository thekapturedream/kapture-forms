import Link from "next/link";
import { KaptureSun } from "@components/Logo";
import { SearchHero } from "@components/SearchHero";

/**
 * Conversion-tuned landing.
 *
 * Above the fold: tight header, one announcement chip, sharp headline,
 * single search row with a primary yellow CTA, popular chips, regulator
 * trust strip. Below: three commitment-tier cards. One quiet footer.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-kapture-black">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO — single, clean, conversion-led */}
        <section className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,_rgba(255,212,0,0.10),_transparent_60%)] pointer-events-none"
          />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 lg:pt-20 pb-14 lg:pb-20 text-center">
            {/* Announcement pill */}
            <Link
              href="/products/staff-onboarding-uk-care"
              className="inline-flex items-center gap-2 rounded-full border border-kapture-fog bg-white pl-1 pr-3 py-1 text-xs font-medium text-kapture-smoke hover:border-kapture-black transition"
            >
              <span className="inline-flex items-center gap-1.5 bg-kapture-yellow text-kapture-black rounded-full px-2 py-0.5 text-[0.625rem] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-kapture-black animate-pulse" />
                Live
              </span>
              <span className="text-kapture-black font-semibold">Staff onboarding</span>
              <span className="text-kapture-mist">·</span>
              <span>UK care providers</span>
              <span className="text-kapture-mist">→</span>
            </Link>

            <h1 className="mt-7 font-display font-semibold text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[0.95] tracking-[-0.04em] text-kapture-black max-w-4xl mx-auto">
              Compliance forms<br />
              <span className="text-kapture-mist">that ship today.</span>
            </h1>

            <p className="mt-6 text-base lg:text-lg text-kapture-smoke max-w-xl mx-auto leading-relaxed">
              Pre-built. Audit-hashed. Five export formats. £29 a pack.
            </p>

            <div className="mt-10">
              <SearchHero />
            </div>

            {/* Trust strip */}
            <div className="mt-14 lg:mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist">
              <span className="text-kapture-smoke">Mapped to</span>
              <span>CQC SAF</span>
              <span className="text-kapture-fog">/</span>
              <span>NMC</span>
              <span className="text-kapture-fog">/</span>
              <span>HCPC</span>
              <span className="text-kapture-fog">/</span>
              <span>DSPT</span>
              <span className="text-kapture-fog">/</span>
              <span>MCA</span>
              <span className="text-kapture-fog">/</span>
              <span>DBS</span>
              <span className="text-kapture-fog">/</span>
              <span>Care Certificate</span>
            </div>
          </div>
        </section>

        {/* THREE TIER CARDS — buy / hosted / publish */}
        <section className="border-t border-kapture-fog bg-kapture-paper/40">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-14 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TierCard
                kicker="01 · DOWNLOAD"
                title="Buy a pack."
                price="£29"
                priceFoot="once · all formats"
                body="One-off purchase. Five export formats. Lifetime updates as the regulator changes."
                cta={{ label: "Buy now →", href: "/products/staff-onboarding-uk-care#buy", primary: true }}
              />
              <TierCard
                kicker="02 · HOSTED"
                title="Run hosted."
                price="£29 / mo"
                priceFoot="branded URL · queue"
                body="Magic-link invites, HR queue, audit hash on every submission, inspector read-only."
                cta={{ label: "Start hosted →", href: "/products/staff-onboarding-uk-care#buy", primary: false }}
                highlight
              />
              <TierCard
                kicker="03 · PUBLISH"
                title="List your pack."
                price="70 / 30"
                priceFoot="publisher / platform"
                body="Compliance officer, HR consultant, sector specialist? List your form. Earn 70% on every sale."
                cta={{
                  label: "Apply →",
                  href: "mailto:forms@thekapture.com?subject=Publisher%20application",
                  primary: false,
                }}
              />
            </div>
          </div>
        </section>

        {/* QUIET TRUST ROW */}
        <section className="border-t border-kapture-fog">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <Stat label="LIVE NOW" value="1 pack" caption="Staff onboarding · UK care" />
            <Stat label="ROADMAP" value="30+" caption="Across 10 industries · 2026–27" />
            <Stat label="SECURITY" value="SHA-256" caption="Audit hash on every submission" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ---------- header ---------- */

function SiteHeader() {
  return (
    <header className="border-b border-kapture-fog/60 bg-white/85 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Kapture Forms">
          <span className="text-kapture-black">
            <KaptureSun size={26} />
          </span>
          <span className="font-display tracking-[-0.01em] text-[0.9375rem]">
            <span className="font-semibold text-kapture-black">Kapture</span>
            <span className="font-medium text-kapture-smoke ml-1.5">Forms</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/how-to"
            className="hidden sm:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
          >
            How-to
          </Link>
          <Link
            href="/products/staff-onboarding-uk-care"
            className="hidden md:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
          >
            Live pack
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/products/staff-onboarding-uk-care#buy"
            className="ml-1 inline-flex items-center gap-1.5 bg-kapture-black text-white hover:bg-kapture-coal px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            Buy
            <span className="font-mono text-[0.625rem] tracking-wider text-kapture-yellow">
              £29
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ---------- tier cards ---------- */

interface CardProps {
  kicker: string;
  title: string;
  price: string;
  priceFoot: string;
  body: string;
  cta: { label: string; href: string; primary: boolean };
  highlight?: boolean;
}

function TierCard({ kicker, title, price, priceFoot, body, cta, highlight }: CardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl border p-6 flex flex-col transition ${
        highlight
          ? "border-kapture-black shadow-[0_2px_18px_rgba(0,0,0,0.08)]"
          : "border-kapture-fog hover:border-kapture-mist hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 right-5 inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          MOST POPULAR
        </span>
      )}
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-kapture-mist">
        {kicker}
      </div>
      <h3 className="mt-2 font-display font-semibold text-xl tracking-[-0.01em] text-kapture-black">
        {title}
      </h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display font-semibold text-3xl tracking-[-0.02em] text-kapture-black">
          {price}
        </span>
        <span className="text-xs text-kapture-mist font-mono uppercase tracking-wider">
          {priceFoot}
        </span>
      </div>
      <p className="mt-4 text-sm text-kapture-smoke leading-relaxed flex-1">{body}</p>
      <Link
        href={cta.href}
        className={`mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
          cta.primary
            ? "bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
            : "bg-kapture-black text-white hover:bg-kapture-coal"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}

/* ---------- stat row ---------- */

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist mb-1">
        {label}
      </div>
      <div className="font-display font-semibold text-2xl tracking-[-0.02em] text-kapture-black">
        {value}
      </div>
      <div className="text-sm text-kapture-smoke mt-1">{caption}</div>
    </div>
  );
}

/* ---------- footer ---------- */

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog text-sm text-kapture-smoke">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs">
          <KaptureSun size={16} />
          <span className="font-mono uppercase tracking-widest text-kapture-mist">
            © {new Date().getFullYear()} Kapture · United Kingdom
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
          <Link href="/how-to" className="hover:text-kapture-black">
            How-to
          </Link>
          <Link href="/how-to/audit-hash" className="hover:text-kapture-black">
            Audit hash
          </Link>
          <Link href="/how-to/regulators" className="hover:text-kapture-black">
            Regulators
          </Link>
          <Link
            href="mailto:forms@thekapture.com?subject=Publisher%20application"
            className="hover:text-kapture-black"
          >
            Publishers
          </Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black">
            Contact
          </a>
          <Link href="https://thekapture.com" className="hover:text-kapture-black">
            thekapture.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
