import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { MiniBuyForm } from "@components/MiniBuyForm";
import { getProduct } from "@lib/products";

const PRODUCT_ID = "staff-onboarding-uk-care";

export default function HomePage() {
  const product = getProduct(PRODUCT_ID)!;

  return (
    <>
      <Nav variant="marketing" />

      {/* HERO + MINI BUY */}
      <section className="bg-kapture-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-kapture-yellow/10 blur-3xl pointer-events-none"
        />
        <div className="container-c relative pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-kapture-yellow mb-5 inline-block">
                COMPLIANCE FORMS · BY KAPTURE
              </span>
              <h1 className="font-display font-semibold text-[2.75rem] leading-[1] tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4.25rem] mb-6 max-w-3xl">
                Compliance forms<br />
                <span className="text-white/60">that ship in 30 seconds.</span>
              </h1>
              <p className="text-base lg:text-lg text-white/65 max-w-xl leading-relaxed mb-8">
                Pay once. Download in PDF, DOCX, HTML, CSV, or Google Forms. Or run hosted
                with a magic-link queue. Audit-hashed on every submission.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-white/45">
                <span><span className="text-kapture-yellow">●</span>&nbsp; Live: UK care onboarding</span>
                <span><span className="text-kapture-yellow">●</span>&nbsp; 5 export formats</span>
                <span><span className="text-kapture-yellow">●</span>&nbsp; SHA-256 audit trail</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div id="buy" className="scroll-mt-20">
                <MiniBuyForm
                  productId={product.id}
                  productTitle={product.shortTitle}
                  oneOffLabel={`${product.price.oneOffDisplay} once`}
                  subscriptionLabel={product.price.subscriptionDisplay}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="container-c py-4 flex items-center justify-between gap-4 flex-wrap text-xs font-mono text-white/40">
            <span>Trusted format basis · CQC SAF · NMC · HCPC · DSPT · MCA · Care Cert.</span>
            <Link href="/how-to/regulators" className="text-white/55 hover:text-white">
              See regulator mapping →
            </Link>
          </div>
        </div>
      </section>

      {/* THREE FEATURES — Vercel-style minimal row */}
      <section className="bg-white border-b border-kapture-fog">
        <div className="container-c py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <Feature
              kicker="01 · PRE-BUILT"
              title="Fields the regulator wrote."
              body="Every field is mapped to the clause it satisfies — CQC SAF, NMC, HCPC, DSPT, MCA. Defensible the first day you ship."
            />
            <Feature
              kicker="02 · FIVE FORMATS"
              title="One pack. Five files. One URL."
              body="Download as PDF, DOCX, HTML embed, CSV, or Google Forms. Or run hosted with a branded URL and magic-link invites."
            />
            <Feature
              kicker="03 · AUDIT-HASHED"
              title="SHA-256 on every submission."
              body="Every entry signed, timestamped, append-only. Tamper-evident. Defensible to an inspector. No extra setup."
            />
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE — single live pack, prominent */}
      <section id="product" className="bg-kapture-paper">
        <div className="container-c py-16 lg:py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div className="max-w-xl">
              <span className="ed-kicker">FIRST LIVE PACK</span>
              <h2 className="font-display font-semibold text-3xl lg:text-4xl tracking-[-0.02em] text-kapture-black">
                Staff onboarding · UK care providers.
              </h2>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="btn-secondary text-sm"
            >
              Open product →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Stat label="Pathways" value="4" caption="clinical · non-clinical · agency · volunteer" />
            <Stat label="Sections" value="9" caption="personal · DBS · references · training · consents" />
            <Stat label="Regulator-mapped fields" value="60+" caption="CQC SAF · NMC · HCPC · DSPT · MCA" />
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {(["pdf", "docx", "html", "csv", "gforms", "web"] as const).map((f) => (
              <Link
                key={f}
                href={`/how-to/${f === "web" ? "hosted" : f === "gforms" ? "google-forms" : f}`}
                className="bg-white border border-kapture-fog rounded-xl p-4 hover:border-kapture-black transition"
              >
                <div className="font-mono text-xs uppercase tracking-widest text-kapture-mist mb-1">
                  {labelFor(f)}
                </div>
                <div className="text-sm text-kapture-black font-medium">How-to →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — minimal, two tiers, monochrome */}
      <section id="pricing" className="bg-white border-t border-kapture-fog">
        <div className="container-c py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <span className="ed-kicker">PRICING</span>
            <h2 className="font-display font-semibold text-3xl lg:text-4xl tracking-[-0.02em] text-kapture-black">
              £29 once. Or £29 / mo hosted.
            </h2>
            <p className="text-sm text-kapture-smoke mt-3">No setup fee. No seat tax. Cancel anytime on hosted.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <PriceCard
              name="One-off"
              price="£29"
              foot="lifetime · single workspace"
              points={[
                "All pathways · all sections",
                "Download in five formats",
                "Lifetime access to updates",
                "No subscription",
              ]}
              cta={{ label: "Buy one-off →", href: "#buy" }}
              tone="default"
            />
            <PriceCard
              name="Hosted"
              price="£29 / mo"
              foot="unlimited submissions · cancel anytime"
              points={[
                "Branded URL + magic-link invites",
                "HR queue + approvals",
                "All five formats included",
                "Inspector read-only access",
                "Audit hash on every submission",
              ]}
              cta={{ label: "Start hosted →", href: "#buy" }}
              tone="featured"
            />
          </div>
        </div>
      </section>

      {/* AUDIT HASH BAND — dark, mono, technical credibility */}
      <section className="bg-kapture-black text-white border-y border-white/5">
        <div className="container-c py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-kapture-yellow mb-5 inline-block">
                AUDIT HASH
              </span>
              <h2 className="font-display font-semibold text-3xl lg:text-4xl tracking-[-0.02em] mb-5">
                Every submission. Signed.<br />
                <span className="text-white/60">SHA-256. Inspector-grade.</span>
              </h2>
              <p className="text-white/65 leading-relaxed max-w-lg mb-6">
                Tamper-evident. Reproducible. Same hash on the database row, the submissions
                CSV, the PDF footer, and the candidate&apos;s success screen.
              </p>
              <Link href="/how-to/audit-hash" className="btn-ghost-light text-sm">
                Read the explainer →
              </Link>
            </div>
            <div className="lg:col-span-6">
              <pre className="bg-kapture-coal border border-kapture-ash rounded-2xl p-5 lg:p-6 font-mono text-xs lg:text-sm text-kapture-yellow leading-relaxed overflow-x-auto">
{`audit_hash = sha256(JSON.stringify({
  license_id:   "staff-onboarding-uk-care-a3f7",
  pathway:      "permanent-clinical",
  payload:      { …submission… },
  submitted_at: "2026-05-10T18:32:14Z",
}))

→ 5b51d34c8a92bf4a…
   ✓ written to submissions.audit_hash
   ✓ printed in PDF footer
   ✓ shown to candidate at submit`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER · publishers */}
      <section id="partner" className="bg-kapture-paper">
        <div className="container-c py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="ed-kicker">PUBLISHER PROGRAMME</span>
            <h2 className="font-display font-semibold text-3xl lg:text-4xl tracking-[-0.02em] text-kapture-black mb-4">
              You wrote the form once. Sell it forever.
            </h2>
            <p className="text-base text-kapture-smoke leading-relaxed max-w-2xl mb-6">
              Compliance officers, HR consultants, sector specialists — your pack is an asset.
              List it on Kapture Forms and earn 70% of every download, every monthly licence,
              every multi-site renewal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="mailto:forms@thekapture.com?subject=Publisher%20application" className="btn-primary">
                Apply to publish →
              </Link>
              <Link href="/how-to" className="btn-secondary">
                See the spec
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-kapture-black text-white rounded-2xl p-6">
              <div className="font-mono text-[0.625rem] tracking-widest uppercase text-kapture-yellow mb-3">
                70 / 30 SPLIT
              </div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>Brandable storefront on forms.thekapture.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>We host the infra + payments + audit trail</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>DPA + indemnity templates supplied</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-kapture-yellow font-bold">·</span>
                  <span>Editorial review before launch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white border-t border-kapture-fog">
        <div className="container-c py-16 lg:py-20 text-center">
          <h2 className="font-display font-semibold text-3xl lg:text-5xl tracking-[-0.03em] text-kapture-black max-w-3xl mx-auto mb-6">
            Five formats. One pack. <span className="text-kapture-mist">£29.</span>
          </h2>
          <div className="flex items-center justify-center flex-wrap gap-3">
            <Link href="#buy" className="btn-yellow text-sm">
              Buy now →
            </Link>
            <Link href={`/products/${product.slug}`} className="btn-secondary text-sm">
              See the pack
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- helpers ---------- */

function Feature({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-[0.6875rem] tracking-[0.14em] text-kapture-mist mb-3 uppercase">
        {kicker}
      </div>
      <h3 className="font-display font-semibold text-xl tracking-[-0.01em] text-kapture-black mb-2.5">
        {title}
      </h3>
      <p className="text-sm text-kapture-smoke leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="bg-white border border-kapture-fog rounded-2xl p-6">
      <div className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-kapture-mist">
        {label}
      </div>
      <div className="font-display font-semibold text-5xl text-kapture-black tracking-[-0.03em] my-2">
        {value}
      </div>
      <div className="text-xs text-kapture-smoke leading-relaxed">{caption}</div>
    </div>
  );
}

function PriceCard({
  name,
  price,
  foot,
  points,
  cta,
  tone,
}: {
  name: string;
  price: string;
  foot: string;
  points: string[];
  cta: { label: string; href: string };
  tone: "default" | "featured";
}) {
  const isFeatured = tone === "featured";
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col ${
        isFeatured
          ? "bg-kapture-black text-white border border-kapture-yellow"
          : "bg-white border border-kapture-fog"
      }`}
    >
      <div
        className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] mb-4 ${
          isFeatured ? "text-kapture-yellow" : "text-kapture-mist"
        }`}
      >
        {name}
      </div>
      <div
        className={`font-display font-semibold text-4xl tracking-[-0.03em] ${
          isFeatured ? "text-white" : "text-kapture-black"
        }`}
      >
        {price}
      </div>
      <div className={`text-xs mt-1 mb-5 ${isFeatured ? "text-white/55" : "text-kapture-smoke"}`}>
        {foot}
      </div>
      <ul className="space-y-2 mb-6">
        {points.map((p) => (
          <li
            key={p}
            className={`text-sm flex items-start gap-2 leading-relaxed ${
              isFeatured ? "text-white/85" : "text-kapture-smoke"
            }`}
          >
            <span className={isFeatured ? "text-kapture-yellow" : "text-kapture-black"}>·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`text-xs justify-center mt-auto ${
          isFeatured ? "btn-yellow" : "btn-primary"
        }`}
      >
        {cta.label}
      </Link>
    </div>
  );
}

function labelFor(f: "pdf" | "docx" | "html" | "csv" | "gforms" | "web"): string {
  switch (f) {
    case "pdf": return "PDF";
    case "docx": return "DOCX";
    case "html": return "HTML embed";
    case "csv": return "CSV";
    case "gforms": return "Google Forms";
    case "web": return "Hosted";
  }
}
