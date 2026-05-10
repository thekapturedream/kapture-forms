import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { HOW_TO_GUIDES } from "@lib/how-to-content";

export const metadata: Metadata = {
  title: "How-to · implement any Kapture Forms format",
  description:
    "Universal implementation guides for every Kapture Forms export — PDF, DOCX, HTML embed, CSV, Google Forms, hosted runner. Plus deep-dives on the audit hash, co-branding, and regulator mapping.",
  alternates: { canonical: "/how-to" },
};

const FORMAT_GUIDES = HOW_TO_GUIDES.filter((g) =>
  ["pdf", "docx", "html", "csv", "gforms", "web"].includes(g.format ?? "")
);
const DEEP_DIVES = HOW_TO_GUIDES.filter((g) =>
  ["audit-hash", "branding", "regulators"].includes(g.format ?? "")
);

export default function HowToIndexPage() {
  return (
    <>
      <Nav variant="marketing" />

      {/* HERO */}
      <section className="bg-kapture-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full bg-kapture-yellow/15 blur-3xl pointer-events-none"
        />
        <div className="container-c relative py-14 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="chip chip-yellow">HOW-TO</span>
              <span className="chip chip-outline-light">Universal · all packs</span>
            </div>
            <h1 className="h-section text-white mb-5">
              Every Kapture Forms format. Every implementation path. Step-by-step.
            </h1>
            <p className="font-serif text-lg text-white/80 leading-relaxed mb-7">
              Six exports plus three deep-dives. Pick the path your stack lives on. Each guide
              is a 3–6 minute read with the exact commands, code snippets, and inspector-grade
              defenses. The same guides apply to every Kapture pack — staff onboarding,
              patient intake, incident reports, the lot.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#formats" className="btn-yellow">
                Pick a format →
              </Link>
              <Link href="/how-to/audit-hash" className="btn-ghost-light">
                What is the audit hash?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAT GRID */}
      <section
        id="formats"
        className="bg-kapture-paper py-16 lg:py-20 border-b border-kapture-fog"
      >
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">SIX EXPORT FORMATS</span>
            <h2 className="h-section text-kapture-black">
              One pack. Five files. One hosted runner.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Every Kapture pack ships with the same export menu. Pick the file your stack
              actually consumes. Each guide is the same shape — download, drop in, prove the
              audit trail.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FORMAT_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/how-to/${g.slug}`}
                className="bg-white rounded-2xl border border-kapture-fog p-5 hover:border-kapture-black transition-all hover:-translate-y-0.5 hover:shadow-kapture-card flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  {g.format && g.format !== "audit-hash" && g.format !== "branding" && g.format !== "regulators" ? (
                    <FormatBadge format={g.format} />
                  ) : (
                    <span className="chip chip-yellow">DEEP DIVE</span>
                  )}
                  <span className="font-mono text-xs text-kapture-mist">{g.readTime}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{g.title}</h3>
                <p className="text-sm text-kapture-smoke leading-relaxed mb-3 flex-1">
                  {g.subtitle}
                </p>
                <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
                  {g.audience.join(" · ")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DEEP DIVES */}
      <section className="bg-white py-16 lg:py-20 border-b border-kapture-fog">
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">DEEP DIVES</span>
            <h2 className="h-section text-kapture-black">
              The defensible bits. Inspector-grade.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Three guides for the questions an auditor will ask: the audit hash, the
              regulator mapping, and how to put your brand on the runner without breaking
              defensibility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEEP_DIVES.map((g) => (
              <Link
                key={g.slug}
                href={`/how-to/${g.slug}`}
                className="bg-kapture-paper rounded-2xl border border-kapture-fog p-5 hover:border-kapture-black transition-all hover:-translate-y-0.5 hover:shadow-kapture-card flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="chip chip-yellow">DEEP DIVE</span>
                  <span className="font-mono text-xs text-kapture-mist">{g.readTime}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{g.title}</h3>
                <p className="text-sm text-kapture-smoke leading-relaxed mb-3 flex-1">
                  {g.subtitle}
                </p>
                <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
                  {g.audience.join(" · ")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONVERSION CTA */}
      <section className="bg-kapture-yellow py-16 lg:py-20">
        <div className="container-c grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="ed-kicker" style={{ color: "#876300" }}>
              READY TO BUY
            </span>
            <h2 className="h-section text-kapture-black mb-4">
              Same pack. Five formats. £29 once or £29 / mo hosted.
            </h2>
            <p className="font-serif text-base text-kapture-coal leading-relaxed mb-5">
              The first live pack is staff onboarding for UK care providers. Four pathways.
              Nine sections. Sixty-plus regulator-mapped fields. Same audit hash, however you
              consume it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/staff-onboarding-uk-care"
                className="btn-primary"
              >
                Open the live pack →
              </Link>
              <Link href="/" className="btn-secondary">
                Back to marketplace
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-kapture-black text-white rounded-2xl p-6">
              <div className="font-mono text-[0.625rem] tracking-widest uppercase text-kapture-yellow mb-3">
                EVERY GUIDE ENDS WITH
              </div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>Step-by-step download → implement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>Code / shell snippet for the integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>FAQ for the inspector / auditor question</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>Cross-links to the related deep-dives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
