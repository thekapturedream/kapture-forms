import Link from "next/link";
import { KaptureSun } from "@components/Logo";
import { SearchHero } from "@components/SearchHero";

/**
 * Conversion-tuned landing. Mobile-first. Manrope-led.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-kapture-black">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(255,212,0,0.10),_transparent_55%)] pointer-events-none"
          />
          <div className="relative mx-auto w-full max-w-[680px] px-5 sm:px-6 pt-10 sm:pt-14 lg:pt-20 pb-12 lg:pb-16 text-center">
            <Link
              href="/products/staff-onboarding-uk-care"
              className="inline-flex items-center gap-2 rounded-full border border-kapture-fog bg-white pl-1.5 pr-3 py-1 text-xs font-medium text-kapture-smoke hover:border-kapture-black hover:shadow-sm transition max-w-full"
            >
              <span className="inline-flex items-center gap-1.5 bg-kapture-yellow text-kapture-black rounded-full px-2 py-0.5 text-[0.625rem] font-mono font-bold uppercase tracking-wider shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-kapture-black animate-pulse" />
                Live
              </span>
              <span className="text-kapture-black font-semibold truncate">Staff onboarding</span>
              <span className="text-kapture-mist hidden sm:inline">·</span>
              <span className="hidden sm:inline">UK care</span>
              <span className="text-kapture-mist">→</span>
            </Link>

            <h1 className="mt-6 sm:mt-7 font-semibold text-[2.25rem] leading-[1.02] tracking-[-0.035em] sm:text-[3rem] lg:text-[3.75rem] sm:leading-[0.98]">
              <span className="text-kapture-black">Compliance forms</span>
              <br />
              <span className="text-kapture-mist">for every industry.</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-[15px] sm:text-base text-kapture-smoke max-w-md mx-auto leading-relaxed">
              Pre-built. Audit-hashed. Five formats. <strong className="text-kapture-black font-semibold">£29 a pack.</strong>
            </p>

            <div className="mt-8 sm:mt-9">
              <SearchHero />
            </div>
          </div>
        </section>

        {/* TIER CARDS */}
        <section className="bg-kapture-paper/40 border-t border-kapture-fog/70">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 py-12 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <TierCard
                kicker="01 · DOWNLOAD"
                title="Buy a pack."
                price="£29"
                priceFoot="once · all formats"
                body="One-off purchase. Five export formats. Lifetime updates as the regulator changes."
                cta={{ label: "Buy now", href: "/products/staff-onboarding-uk-care#buy", primary: true }}
              />
              <TierCard
                kicker="02 · HOSTED"
                title="Run hosted."
                price="£29 / mo"
                priceFoot="branded URL · queue"
                body="Magic-link invites, HR queue, audit hash on every submission, inspector read-only."
                cta={{ label: "Start hosted", href: "/products/staff-onboarding-uk-care#buy", primary: false }}
                highlight
              />
              <TierCard
                kicker="03 · PUBLISH"
                title="List your pack."
                price="70 / 30"
                priceFoot="publisher / platform"
                body="Compliance officer, HR consultant, sector specialist? List your form. Earn 70% on every sale."
                cta={{
                  label: "Apply",
                  href: "mailto:forms@thekapture.com?subject=Publisher%20application",
                  primary: false,
                }}
              />
            </div>
          </div>
        </section>

        {/* STAT ROW */}
        <section className="border-t border-kapture-fog/70">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <Stat label="LIVE NOW" value="1 pack" caption="Staff onboarding · UK care" />
            <Stat label="ROADMAP" value="30+" caption="Across 10 industries · 2026–27" />
            <Stat label="SECURITY" value="SHA-256" caption="Audit hash on every submission" />
          </div>
        </section>

        {/* REGULATOR TRUST */}
        <section className="border-t border-kapture-fog/70 bg-kapture-paper/40">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist text-center sm:text-left shrink-0">
              Mapped to
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-kapture-smoke">
              {[
                "CQC SAF",
                "NMC",
                "HCPC",
                "DSPT",
                "MCA",
                "DBS",
                "Care Certificate",
              ].map((reg) => (
                <span key={reg} className="px-2 py-1 rounded bg-white border border-kapture-fog">
                  {reg}
                </span>
              ))}
            </div>
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
    <header className="border-b border-kapture-fog/60 bg-white/85 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Kapture Forms">
          <span className="text-kapture-black">
            <KaptureSun size={24} />
          </span>
          <span className="tracking-[-0.01em] text-[15px] sm:text-base">
            <span className="font-bold text-kapture-black">Kapture</span>
            <span className="font-medium text-kapture-smoke ml-1.5">Forms</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/how-to"
            className="hidden sm:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
          >
            How-to
          </Link>
          <Link
            href="/dashboard"
            className="hidden md:inline-flex px-2.5 py-1.5 text-kapture-smoke hover:text-kapture-black rounded-md font-medium"
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
            className="inline-flex items-center gap-1.5 bg-kapture-black text-white hover:bg-kapture-coal px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            Buy
            <span className="font-mono text-[0.625rem] tracking-wider text-kapture-yellow">£29</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ---------------- tier cards ---------------- */

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
      className={`relative bg-white rounded-2xl border p-5 sm:p-6 flex flex-col transition ${
        highlight
          ? "border-kapture-black shadow-[0_2px_18px_rgba(0,0,0,0.08)]"
          : "border-kapture-fog hover:border-kapture-mist"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 right-5 inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          MOST POPULAR
        </span>
      )}
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-kapture-mist">{kicker}</div>
      <h3 className="mt-2 font-bold text-xl tracking-[-0.015em] text-kapture-black">{title}</h3>
      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="font-bold text-[1.75rem] tracking-[-0.025em] text-kapture-black leading-none">{price}</span>
        <span className="text-xs text-kapture-mist font-mono uppercase tracking-wider">{priceFoot}</span>
      </div>
      <p className="mt-3 text-sm text-kapture-smoke leading-relaxed flex-1">{body}</p>
      <Link
        href={cta.href}
        className={`mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
          cta.primary
            ? "bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
            : "bg-kapture-black text-white hover:bg-kapture-coal"
        }`}
      >
        {cta.label} →
      </Link>
    </div>
  );
}

/* ---------------- stat row ---------------- */

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-mist mb-1.5">{label}</div>
      <div className="font-bold text-2xl tracking-[-0.02em] text-kapture-black leading-none">{value}</div>
      <div className="text-sm text-kapture-smoke mt-1.5">{caption}</div>
    </div>
  );
}

/* ---------------- footer ---------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog text-sm text-kapture-smoke">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs">
          <KaptureSun size={14} />
          <span className="font-mono uppercase tracking-widest text-kapture-mist">
            © {new Date().getFullYear()} Kapture · UK
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs">
          <Link href="/how-to" className="hover:text-kapture-black">How-to</Link>
          <Link href="/how-to/audit-hash" className="hover:text-kapture-black">Audit hash</Link>
          <Link href="/how-to/regulators" className="hover:text-kapture-black">Regulators</Link>
          <Link
            href="mailto:forms@thekapture.com?subject=Publisher%20application"
            className="hover:text-kapture-black"
          >
            Publishers
          </Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black">Contact</a>
        </div>
      </div>
    </footer>
  );
}
