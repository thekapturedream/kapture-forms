import Link from "next/link";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { SearchHero } from "@components/SearchHero";
import { MotionFade } from "@components/MotionFade";
import { CategoryGrid } from "@components/CategoryGrid";
import { SEARCH_CATALOG } from "@lib/search-catalog";
import { BUNDLES, moneyFromPence } from "@lib/bundles";

/**
 * Light-default e-commerce landing.
 * Hero → categories → featured packs → bundles → designer pass → final CTA.
 */

const FORMATS = [
  { tag: "PDF", title: "Print-ready PDF", body: "A4. Signature block. Audit footer." },
  { tag: "DOCX", title: "Editable Word", body: "Track-changes ready." },
  { tag: "HTML", title: "Embeddable form", body: "Drop into your careers page." },
  { tag: "CSV", title: "Schema + submissions", body: "Bamboo · Breathe · Workday." },
  { tag: "GFORMS", title: "Google Forms", body: "Apps Script importer." },
  { tag: "HOSTED", title: "Hosted runner", body: "Branded URL. Magic links." },
];

export default function HomePage() {
  const featured = SEARCH_CATALOG.slice(0, 6);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(255,212,0,0.10),_transparent_60%)] pointer-events-none"
          />
          <div className="relative mx-auto w-full max-w-[1100px] px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-20 pb-12 lg:pb-16 text-center">
            <MotionFade>
              <h1 className="font-semibold tracking-[-0.04em] text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[5rem] sm:leading-[0.96] text-kapture-black dark:text-white">
                Smart forms for
                <br />
                everything.
              </h1>
            </MotionFade>
            <MotionFade delay={0.1}>
              <div className="mt-8 sm:mt-10">
                <SearchHero />
              </div>
            </MotionFade>
          </div>
        </section>

        {/* CATEGORIES — right after hero */}
        <section id="categories" className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-14">
            <MotionFade>
              <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                    BROWSE BY INDUSTRY
                  </div>
                  <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                    10 industries. 46 packs.
                  </h2>
                </div>
                <Link
                  href="/store"
                  className="text-sm font-medium text-kapture-black dark:text-white hover:opacity-70"
                >
                  All packs →
                </Link>
              </div>
            </MotionFade>
            <MotionFade delay={0.06}>
              <CategoryGrid />
            </MotionFade>
          </div>
        </section>

        {/* FEATURED PACKS */}
        <section id="featured" className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
            <MotionFade>
              <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                    FEATURED PACKS
                  </div>
                  <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                    Trending this quarter.
                  </h2>
                </div>
                <Link href="/store" className="text-sm font-medium text-kapture-black dark:text-white hover:opacity-70">
                  Browse store →
                </Link>
              </div>
            </MotionFade>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {featured.map((p, i) => (
                <MotionFade key={p.title} delay={i * 0.04}>
                  <PackCard
                    title={p.title}
                    industry={p.industry}
                    status={p.status}
                    release={p.release}
                    href={p.href}
                  />
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* BUNDLES */}
        <section id="bundles" className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
            <MotionFade>
              <div className="mb-6 sm:mb-8">
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                  BUNDLES · SAVE 30–50%
                </div>
                <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                  Curated multi-pack offers.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-kapture-smoke dark:text-white/60 max-w-2xl">
                  Pre-order pricing — the live pack ships now, the rest land in your inbox as
                  they go live.
                </p>
              </div>
            </MotionFade>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {BUNDLES.map((b, i) => (
                <MotionFade key={b.id} delay={i * 0.04}>
                  <BundleCard bundle={b} />
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* DESIGNER PASS */}
        <section id="designer" className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
            <div className="rounded-3xl border border-kapture-black dark:border-white/20 bg-kapture-black dark:bg-white/[0.04] text-white dark:text-white overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10">
                  <MotionFade>
                    <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-yellow mb-3">
                      FOR DESIGNERS · AGENCIES · STUDIOS
                    </div>
                    <h2 className="font-semibold text-3xl sm:text-4xl tracking-[-0.025em]">
                      The Designer Pass.
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
                      Unlimited downloads in every format. Source files. White-label rights for
                      one client domain. New packs as they ship. Hosted runner included.
                    </p>
                    <ul className="mt-6 space-y-2 text-sm">
                      <PassPoint>Unlimited PDF, DOCX, HTML, CSV, Google Forms exports</PassPoint>
                      <PassPoint>Figma kit · brand tokens · form schema JSON</PassPoint>
                      <PassPoint>White-label on one client domain · re-export rights</PassPoint>
                      <PassPoint>Hosted runner with your brand chrome</PassPoint>
                      <PassPoint>New packs auto-added · cancel anytime</PassPoint>
                    </ul>
                  </MotionFade>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-center">
                  <MotionFade delay={0.08}>
                    <div className="font-mono text-[0.625rem] uppercase tracking-widest text-white/55 mb-2">
                      MONTHLY · CANCEL ANYTIME
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-5xl tracking-[-0.03em]">£49</span>
                      <span className="text-white/55 text-sm font-mono uppercase tracking-wider">/ mo</span>
                    </div>
                    <div className="text-white/55 text-xs font-mono">First 30 days, then £49</div>
                    <Link
                      href="/designer-pass"
                      className="mt-6 inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-5 py-3 rounded-xl font-semibold text-sm transition"
                    >
                      Start designer pass →
                    </Link>
                    <Link
                      href="/store"
                      className="mt-3 text-center text-xs text-white/55 hover:text-white"
                    >
                      Browse all packs →
                    </Link>
                  </MotionFade>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORMATS — sub-feature row */}
        <section id="formats" className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
            <MotionFade>
              <div className="mb-6 sm:mb-8">
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                  EXPORT FORMATS
                </div>
                <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                  One pack. Five files. One hosted URL.
                </h2>
              </div>
            </MotionFade>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FORMATS.map((f, i) => (
                <MotionFade key={f.tag} delay={i * 0.03}>
                  <div className="rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-4">
                    <span className="inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded">
                      {f.tag}
                    </span>
                    <h3 className="mt-3 font-bold text-sm text-kapture-black dark:text-white tracking-[-0.01em]">{f.title}</h3>
                    <p className="mt-1 text-xs text-kapture-smoke dark:text-white/55 leading-relaxed">{f.body}</p>
                  </div>
                </MotionFade>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-12 sm:py-16 text-center">
            <MotionFade>
              <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white">
                Browse the store. Pick a pack.
              </h2>
            </MotionFade>
            <MotionFade delay={0.06}>
              <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-5 py-3 rounded-full font-semibold text-sm transition"
                >
                  Open the store →
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

/* ─── header ─── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Store</Link>
          <Link href="/#bundles" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Bundles</Link>
          <Link href="/#designer" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Designers</Link>
          <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How-to</Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle size={34} />
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
          >
            Shop
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

/* ─── cards ─── */

function PackCard({
  title,
  industry,
  status,
  release,
  href,
}: {
  title: string;
  industry: string;
  status: "live" | "soon";
  release?: string;
  href: string;
}) {
  const isLive = status === "live";
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 transition hover:border-kapture-black dark:hover:border-white/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
          {industry}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
            isLive ? "bg-kapture-yellow text-kapture-black" : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/10"
          }`}
        >
          {isLive ? "LIVE" : (release ?? "SOON")}
        </span>
      </div>
      <h3 className="font-semibold text-base text-kapture-black dark:text-white tracking-[-0.01em] flex-1">{title}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
          {isLive ? "£29" : "Notify"}
        </span>
        <span className="text-sm font-medium text-kapture-black dark:text-white group-hover:translate-x-0.5 transition">
          {isLive ? "Buy →" : "→"}
        </span>
      </div>
    </Link>
  );
}

function BundleCard({ bundle }: { bundle: (typeof BUNDLES)[number] }) {
  const save = bundle.rrpPence - bundle.bundlePence;
  return (
    <div className="rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 sm:p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
          {bundle.industry}
        </span>
        <span className="inline-flex items-center gap-1 bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full">
          SAVE {moneyFromPence(bundle.rrpPence - bundle.bundlePence)}
        </span>
      </div>
      <h3 className="font-semibold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">{bundle.title}</h3>
      <p className="mt-1.5 text-sm text-kapture-smoke dark:text-white/60 leading-relaxed">{bundle.hook}</p>
      <ul className="mt-4 space-y-1 text-xs text-kapture-smoke dark:text-white/55">
        {bundle.packs.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="text-kapture-yellow">·</span>
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-kapture-fog dark:border-white/10 flex items-baseline gap-2 flex-wrap">
        <span className="font-bold text-2xl text-kapture-black dark:text-white tracking-[-0.02em]">
          {moneyFromPence(bundle.bundlePence)}
        </span>
        <span className="text-xs text-kapture-mist dark:text-white/45 font-mono line-through">
          {moneyFromPence(bundle.rrpPence)}
        </span>
        <span className="text-xs text-kapture-yellow font-mono font-semibold ml-auto">
          {Math.round((save / bundle.rrpPence) * 100)}% off
        </span>
      </div>
      <a
        href={`/products/${bundle.slug}`}
        className="mt-4 inline-flex items-center justify-center gap-1.5 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 px-4 py-2.5 rounded-xl font-semibold text-sm transition"
      >
        View bundle →
      </Link>
    </div>
  );
}

function PassPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="text-kapture-yellow font-bold mt-0.5">·</span>
      <span className="text-white/85">{children}</span>
    </li>
  );
}

/* ─── footer ─── */

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-smoke dark:text-white/40">
          © {new Date().getFullYear()} Kapture · UK
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55">
          <Link href="/store" className="hover:text-kapture-black dark:hover:text-white">Store</Link>
          <Link href="/#bundles" className="hover:text-kapture-black dark:hover:text-white">Bundles</Link>
          <Link href="/#designer" className="hover:text-kapture-black dark:hover:text-white">Designers</Link>
          <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
          <Link href="mailto:forms@thekapture.com?subject=Publisher%20application" className="hover:text-kapture-black dark:hover:text-white">Publishers</Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
          <Link href="https://thekapture.com" className="hover:text-kapture-black dark:hover:text-white">thekapture.com</Link>
        </div>
      </div>
    </footer>
  );
}
