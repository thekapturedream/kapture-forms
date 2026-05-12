import Link from "next/link";
import { KaptureSunDisc, Logo } from "@components/Logo";
import { SearchHero } from "@components/SearchHero";

/**
 * Dark-canvas landing. Visually consistent with kapture · logistics.
 * Big translucent hero headline with a yellow underline accent under
 * one word. Search-first below. Yellow Kapture sun disc + Contact pill
 * top right. Lowercase wordmark top left.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-kapture-black text-white">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(255,212,0,0.08),_transparent_60%)] pointer-events-none"
          />
          <div className="relative mx-auto w-full max-w-[1100px] px-5 sm:px-6 lg:px-10 pt-14 sm:pt-20 lg:pt-28 pb-14 lg:pb-20">
            {/* HEADLINE — big, translucent, yellow underline on key word */}
            <h1 className="font-semibold tracking-[-0.04em] text-[3rem] leading-[0.96] sm:text-[4.25rem] lg:text-[5.5rem] text-center text-white/35">
              <span className="inline-block relative">
                <span className="relative text-white">Find</span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 h-[6px] sm:h-[8px] lg:h-[10px] bg-kapture-yellow/85"
                  style={{ borderRadius: 2 }}
                />
              </span>{" "}
              a form today.
            </h1>

            <p className="mt-6 sm:mt-8 text-center text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
              Pre-built. Audit-hashed. Five formats. <span className="text-white">£29</span> a pack.
            </p>

            <div className="mt-10 sm:mt-12">
              <SearchHero />
            </div>
          </div>
        </section>

        {/* TIER CARDS */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-14 lg:py-16">
            <div className="mb-8 sm:mb-10 flex items-end justify-between gap-4">
              <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.02em]">
                Three ways in.
              </h2>
              <Link href="/how-to" className="text-sm text-white/55 hover:text-white">
                How-to →
              </Link>
            </div>
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
                body="Compliance officer, HR consultant, sector specialist? List your form. Earn 70%."
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
        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <Stat label="LIVE NOW" value="1 pack" caption="Staff onboarding · UK care" />
            <Stat label="ROADMAP" value="30+" caption="10 industries · 2026–27" />
            <Stat label="SECURITY" value="SHA-256" caption="Audit hash on every submission" />
          </div>
        </section>

        {/* REGULATOR STRIP */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/40 text-center sm:text-left shrink-0">
              Mapped to
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">
              {[
                "CQC SAF",
                "NMC",
                "HCPC",
                "DSPT",
                "MCA",
                "DBS",
                "Care Certificate",
              ].map((reg) => (
                <span
                  key={reg}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10"
                >
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
    <header className="sticky top-0 z-40 bg-kapture-black/90 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Logo on="dark" />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/products/staff-onboarding-uk-care" className="px-3 py-1.5 text-white/70 hover:text-white rounded-md font-medium">
            Live pack
          </Link>
          <Link href="/how-to" className="px-3 py-1.5 text-white/70 hover:text-white rounded-md font-medium">
            How-to
          </Link>
          <Link
            href="mailto:forms@thekapture.com?subject=Publisher%20application"
            className="px-3 py-1.5 text-white/70 hover:text-white rounded-md font-medium"
          >
            Publishers
          </Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-white/70 hover:text-white rounded-md font-medium">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <KaptureSunDisc size={36} href="/" ariaLabel="Home" />
          <Link
            href="/products/staff-onboarding-uk-care#buy"
            className="inline-flex items-center gap-1.5 bg-white text-kapture-black hover:bg-kapture-paper px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            Buy
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
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
      className={`relative rounded-2xl border p-5 sm:p-6 flex flex-col transition ${
        highlight
          ? "border-kapture-yellow/60 bg-white/[0.03] shadow-[0_8px_40px_rgba(255,212,0,0.08)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 right-5 inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          MOST POPULAR
        </span>
      )}
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white/40">{kicker}</div>
      <h3 className="mt-2 font-bold text-xl tracking-[-0.015em]">{title}</h3>
      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="font-bold text-[1.75rem] tracking-[-0.025em] leading-none">{price}</span>
        <span className="text-xs text-white/45 font-mono uppercase tracking-wider">{priceFoot}</span>
      </div>
      <p className="mt-3 text-sm text-white/65 leading-relaxed flex-1">{body}</p>
      <Link
        href={cta.href}
        className={`mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
          cta.primary
            ? "bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
            : "bg-white text-kapture-black hover:bg-kapture-paper"
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
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/40 mb-1.5">{label}</div>
      <div className="font-bold text-2xl tracking-[-0.02em] text-white leading-none">{value}</div>
      <div className="text-sm text-white/55 mt-1.5">{caption}</div>
    </div>
  );
}

/* ---------------- footer ---------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40">
            <KaptureSunDisc size={20} />
          </span>
          <span className="font-mono uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Kapture · UK
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-white/55">
          <Link href="/how-to" className="hover:text-white">How-to</Link>
          <Link href="/how-to/audit-hash" className="hover:text-white">Audit hash</Link>
          <Link href="/how-to/regulators" className="hover:text-white">Regulators</Link>
          <Link
            href="mailto:forms@thekapture.com?subject=Publisher%20application"
            className="hover:text-white"
          >
            Publishers
          </Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-white">Contact</a>
          <Link href="https://thekapture.com" className="hover:text-white">thekapture.com</Link>
        </div>
      </div>
    </footer>
  );
}
