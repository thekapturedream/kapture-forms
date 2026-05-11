import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { SearchHero } from "@components/SearchHero";

export default function HomePage() {
  return (
    <>
      <Nav variant="marketing" />

      {/* SEARCH-FIRST HERO — the entire above-the-fold */}
      <section className="bg-kapture-black text-white relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[800px] rounded-full bg-kapture-yellow/8 blur-3xl pointer-events-none"
        />
        <div className="container-c relative w-full py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-kapture-yellow inline-block mb-6">
              KAPTURE FORMS
            </span>
            <h1 className="font-display font-semibold text-[2.75rem] sm:text-[3.5rem] lg:text-[5rem] leading-[0.95] tracking-[-0.04em] mb-8">
              Forms for everything.
            </h1>
            <p className="text-base lg:text-lg text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
              Pre-built, audit-hashed, regulator-mapped. Search the form you need.
            </p>
          </div>
          <SearchHero />
        </div>
      </section>

      {/* TINY FOOT — single line of trust + a quiet how-to link */}
      <section className="bg-white border-t border-kapture-fog">
        <div className="container-c py-5 flex items-center justify-between gap-4 flex-wrap text-xs font-mono text-kapture-mist">
          <span className="uppercase tracking-widest">
            <span className="text-kapture-yellow">●</span>&nbsp; 1 LIVE · 30 IN ROADMAP · 5 EXPORT FORMATS · SHA-256 AUDIT
          </span>
          <div className="flex items-center gap-4">
            <Link href="/how-to" className="hover:text-kapture-black">
              How-to →
            </Link>
            <Link
              href="/products/staff-onboarding-uk-care#buy"
              className="hover:text-kapture-black"
            >
              Pricing →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
