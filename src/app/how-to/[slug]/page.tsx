import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { HOW_TO_GUIDES, getGuide } from "@lib/how-to-content";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return HOW_TO_GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "How-to" };
  return {
    title: `${guide.title} · how-to`,
    description: guide.description,
    alternates: { canonical: `/how-to/${guide.slug}` },
    openGraph: {
      title: `${guide.title} · how-to · Kapture Forms`,
      description: guide.description,
    },
  };
}

export default function HowToGuidePage({ params }: Props) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const isFormatGuide =
    guide.format && ["pdf", "docx", "html", "csv", "gforms", "web"].includes(guide.format);
  const related = (guide.related ?? [])
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <>
      <Nav variant="marketing" />

      {/* HERO */}
      <section className="bg-kapture-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full bg-kapture-yellow/15 blur-3xl pointer-events-none"
        />
        <div className="container-c relative py-12 lg:py-16">
          <Link
            href="/how-to"
            className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow mb-4 inline-flex items-center gap-1.5 hover:text-white"
          >
            ← All how-to guides
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-4">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {isFormatGuide && guide.format && guide.format !== "audit-hash" && guide.format !== "branding" && guide.format !== "regulators" ? (
                  <FormatBadge format={guide.format} />
                ) : (
                  <span className="chip chip-yellow">DEEP DIVE</span>
                )}
                <span className="chip chip-outline-light">{guide.readTime}</span>
                {guide.audience.map((a) => (
                  <span key={a} className="chip chip-outline-light">
                    {a}
                  </span>
                ))}
              </div>
              <h1 className="h-section text-white mb-4">{guide.title}</h1>
              <p className="font-serif text-lg text-white/85 leading-relaxed">
                {guide.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + STEPS */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container-c grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8 prose-kapture">
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mb-10">
              {guide.intro}
            </p>

            <span className="ed-kicker">STEPS</span>
            <ol className="space-y-8 mt-2">
              {guide.steps.map((step, i) => (
                <li key={step.title} className="relative pl-12">
                  <span className="absolute left-0 top-0 w-9 h-9 rounded-xl bg-kapture-black text-kapture-yellow font-mono font-bold text-sm flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-semibold text-lg mb-2 text-kapture-black">
                    {step.title}
                  </h3>
                  <p className="text-base text-kapture-smoke leading-relaxed">{step.body}</p>
                  {step.code && (
                    <pre className="mt-3 bg-kapture-black text-kapture-yellow font-mono text-xs leading-relaxed p-4 rounded-xl overflow-x-auto whitespace-pre">
                      {step.code}
                    </pre>
                  )}
                </li>
              ))}
            </ol>

            {guide.faqs && guide.faqs.length > 0 && (
              <div className="mt-12">
                <span className="ed-kicker">FAQ</span>
                <div className="space-y-5 mt-3">
                  {guide.faqs.map((f) => (
                    <div
                      key={f.q}
                      className="border border-kapture-fog rounded-xl p-5 bg-kapture-paper"
                    >
                      <h4 className="font-display font-semibold text-base mb-2">{f.q}</h4>
                      <p className="text-sm text-kapture-smoke leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="bg-kapture-yellow rounded-2xl p-5">
              <span
                className="ed-kicker"
                style={{ color: "#876300" }}
              >
                BUY THE PACK
              </span>
              <h3 className="font-display font-semibold text-lg mb-2 text-kapture-black">
                Staff onboarding · UK care providers
              </h3>
              <p className="text-sm text-kapture-coal leading-relaxed mb-4">
                Four pathways. Nine sections. The first live Kapture pack — and the one
                every guide on this site uses as the reference example.
              </p>
              <Link
                href="/products/staff-onboarding-uk-care"
                className="btn-primary text-xs justify-center w-full"
              >
                Open the product →
              </Link>
            </div>

            {related.length > 0 && (
              <div className="bg-kapture-paper border border-kapture-fog rounded-2xl p-5">
                <span className="ed-kicker">RELATED GUIDES</span>
                <div className="space-y-2 mt-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/how-to/${r.slug}`}
                      className="block text-sm font-medium text-kapture-black hover:text-kapture-smoke"
                    >
                      → {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-kapture-fog rounded-2xl p-5">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-2">
                NEED HELP?
              </div>
              <p className="text-sm text-kapture-smoke leading-relaxed mb-3">
                Email <span className="font-mono text-xs">forms@thekapture.com</span> with
                your licence slug and the format you&apos;re implementing. We respond within
                one working day.
              </p>
              <Link href="/dashboard" className="btn-secondary text-xs">
                Open dashboard
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-kapture-paper py-12 border-t border-kapture-fog">
        <div className="container-c flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="ed-kicker">NEXT</span>
            <h3 className="font-display font-semibold text-lg text-kapture-black">
              Browse the rest of the how-to hub.
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/how-to" className="btn-secondary text-sm">
              All guides
            </Link>
            <Link href="/products/staff-onboarding-uk-care" className="btn-yellow text-sm">
              Buy the pack →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
