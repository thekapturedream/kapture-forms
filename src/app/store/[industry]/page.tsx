import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { IndustryIcon } from "@components/IndustryIcon";
import { getIndustryBySlug, TAXONOMY } from "@lib/taxonomy";

interface PageProps {
  params: { industry: string };
}

export function generateStaticParams() {
  return TAXONOMY.map((i) => ({ industry: i.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const ind = getIndustryBySlug(params.industry);
  if (!ind) return { title: "Industry" };
  return {
    title: `${ind.name} · forms`,
    description: ind.description,
    alternates: { canonical: `/store/${ind.slug}` },
  };
}

const NOTIFY = (label: string) =>
  `mailto:forms@thekapture.com?subject=${encodeURIComponent(`Notify me · ${label}`)}`;

export default function IndustryPage({ params }: PageProps) {
  const ind = getIndustryBySlug(params.industry);
  if (!ind) notFound();
  const total = ind.subcategories.reduce((n, s) => n + s.forms.length, 0);
  const live = ind.subcategories.reduce(
    (n, s) => n + s.forms.filter((f) => f.status === "live").length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
        <div className="kap-shell h-16 flex items-center justify-between gap-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Home</Link>
            <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">All packs</Link>
            <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How-to</Link>
            <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle size={34} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Industry hero */}
        <section className="border-b border-kapture-fog dark:border-white/5">
          <div className="kap-shell py-10 sm:py-14">
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white mb-5"
            >
              <ArrowLeft size={12} strokeWidth={2.5} />
              All packs
            </Link>
            <div className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black shrink-0">
                <IndustryIcon name={ind.name} size={28} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-1.5">
                  INDUSTRY · {total} PACKS{live > 0 && ` · ${live} LIVE`}
                </div>
                <h1 className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white">
                  {ind.name}
                </h1>
                <p className="mt-3 text-sm sm:text-base text-kapture-smoke dark:text-white/65 leading-relaxed max-w-2xl">
                  {ind.description}
                </p>
              </div>
            </div>

            {/* Sub-category jump nav */}
            <nav className="mt-8 flex flex-wrap gap-1.5">
              {ind.subcategories.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white hover:border-kapture-black dark:hover:border-white/40 transition"
                >
                  {s.name}
                  <span className="font-mono text-[0.625rem] text-kapture-mist dark:text-white/40">
                    {s.forms.length}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Sub-categories stacked */}
        {ind.subcategories.map((sub) => (
          <section
            key={sub.id}
            id={sub.id}
            className="border-b border-kapture-fog dark:border-white/5 scroll-mt-20"
          >
            <div className="kap-shell py-10 sm:py-14">
              <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-1.5">
                    SUBCATEGORY · {sub.forms.length} PACKS
                  </div>
                  <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                    {sub.name}
                  </h2>
                  <p className="mt-1.5 text-sm text-kapture-smoke dark:text-white/60">
                    {sub.tagline}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sub.forms.map((f) => {
                  const isLive = f.status === "live";
                  return (
                    <Link
                      key={f.id}
                      href={isLive && f.href ? f.href : NOTIFY(f.title)}
                      className="group rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 transition hover:border-kapture-black dark:hover:border-white/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
                            isLive
                              ? "bg-kapture-yellow text-kapture-black"
                              : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/15"
                          }`}
                        >
                          {isLive ? "LIVE" : f.release ?? "SOON"}
                        </span>
                        <ArrowUpRight
                          size={14}
                          strokeWidth={2}
                          className="text-kapture-mist group-hover:text-kapture-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                        />
                      </div>
                      <h3 className="font-semibold text-[15px] text-kapture-black dark:text-white tracking-[-0.01em] flex-1">
                        {f.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
                          {isLive ? "£29" : "Notify"}
                        </span>
                        <span className="text-xs font-medium text-kapture-black dark:text-white">
                          {isLive ? "Buy →" : "Email me →"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-kapture-fog dark:border-white/5">
        <div className="kap-shell py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-smoke dark:text-white/40">
            © {new Date().getFullYear()} Kapture · UK
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55">
            <Link href="/store" className="hover:text-kapture-black dark:hover:text-white">All packs</Link>
            <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
            <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
