import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { BuyButton } from "@components/BuyButton";
import { getProduct } from "@lib/products";

const SLUG = "staff-onboarding-uk-care";

export const metadata: Metadata = {
  title: "Staff onboarding · UK care providers",
  description:
    "Pre-built staff onboarding pack for UK care providers. Four pathways. Five export formats. CQC SAF aligned. £29 download or £29/mo hosted.",
};

export default function ProductPage() {
  const product = getProduct(SLUG);
  if (!product) notFound();

  return (
    <>
      <Nav variant="compact" />

      {/* HERO */}
      <section className="bg-kapture-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full bg-kapture-yellow/15 blur-3xl pointer-events-none"
        />
        <div className="container-c relative py-12 lg:py-16">
          <Link
            href="/"
            className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow mb-4 inline-flex items-center gap-1.5 hover:text-white"
          >
            ← Back to marketplace
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-4">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span
                  className="chip"
                  style={{
                    background: "rgba(16,185,129,0.2)",
                    color: "#86EFAC",
                    borderColor: "rgba(16,185,129,0.4)",
                    fontFamily: "var(--font-mono), JetBrains Mono, monospace",
                    fontSize: "0.625rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  LIVE
                </span>
                <span className="chip chip-outline-light">Healthcare</span>
                <span className="chip chip-outline-light">CQC SAF aligned</span>
              </div>
              <h1 className="h-section text-white mb-5">{product.title}</h1>
              <p className="font-serif text-lg text-white/80 leading-relaxed max-w-2xl mb-6">
                {product.longDescription}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {product.exports.map((f) => (
                  <FormatBadge key={f} format={f} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3" id="buy">
                <BuyButton
                  productId={product.id}
                  mode="oneoff"
                  label={`Buy download · ${product.price.oneOffDisplay}`}
                />
                <BuyButton
                  productId={product.id}
                  mode="subscription"
                  label={`Start hosted · ${product.price.subscriptionDisplay}`}
                  className="btn-ghost-light"
                />
              </div>
              <p className="font-mono text-[0.625rem] tracking-widest uppercase text-white/50 mt-4">
                Both tiers backed by Stripe · UK VAT applied at checkout
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-kapture-coal border border-kapture-ash rounded-2xl p-6">
                <div className="font-mono text-[0.625rem] tracking-widest uppercase text-kapture-yellow mb-3">
                  WHAT YOU GET
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="text-kapture-yellow font-bold mt-0.5">·</span>
                    <span>
                      <strong className="text-white">{product.pathways.length} role pathways</strong>
                      <br />
                      <span className="text-white/65 text-xs">
                        Conditional fields per role, setting, risk band.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-kapture-yellow font-bold mt-0.5">·</span>
                    <span>
                      <strong className="text-white">{product.sections.length} sections</strong>
                      <br />
                      <span className="text-white/65 text-xs">
                        Personal details, right to work, DBS, references, training, bank, pension,
                        consents.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-kapture-yellow font-bold mt-0.5">·</span>
                    <span>
                      <strong className="text-white">SHA-256 audit hash</strong>
                      <br />
                      <span className="text-white/65 text-xs">
                        Every submission signed and timestamped — defensible in front of an
                        inspector.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-kapture-yellow font-bold mt-0.5">·</span>
                    <span>
                      <strong className="text-white">5 export formats</strong>
                      <br />
                      <span className="text-white/65 text-xs">
                        PDF, DOCX, HTML, CSV, Google Forms — pick what your stack consumes.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-kapture-yellow font-bold mt-0.5">·</span>
                    <span>
                      <strong className="text-white">Hosted runner</strong>
                      <br />
                      <span className="text-white/65 text-xs">
                        Branded URL + magic-link invites + queue + inspector read-only.
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="bg-white py-16 lg:py-20 border-b border-kapture-fog">
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">FOUR PATHWAYS</span>
            <h2 className="h-section text-kapture-black">
              The four onboarding cases UK care providers actually face.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Each pathway shows only the fields that apply to that role. No more &ldquo;tick
              N/A&rdquo; through 60 questions that don&apos;t apply. No more missing the field
              that does.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {product.pathways.map((p, i) => (
              <div
                key={p.id}
                className="border border-kapture-fog rounded-2xl p-6 bg-kapture-paper"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow bg-kapture-black text-kapture-yellow px-2 py-1 rounded">
                    PATH {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-semibold text-lg">{p.name}</span>
                </div>
                <p className="text-sm text-kapture-smoke leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="bg-kapture-paper py-16 lg:py-20">
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">{product.sections.length} SECTIONS</span>
            <h2 className="h-section text-kapture-black">
              The full field map. Locked to the regulator.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Field-for-field aligned with CQC SAF, NMC, HCPC, DSPT, and DBS guidance. No
              freelance interpretation. No extra questions to look diligent. Just what the
              regulator actually asks for.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.sections.map((s, i) => (
              <div
                key={s.id}
                className="bg-white border border-kapture-fog rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
                    SECTION {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-display font-semibold text-sm mt-0.5">{s.name}</div>
                </div>
                <div className="font-mono text-xs text-kapture-smoke">
                  {s.fieldCount} fields
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + BUY */}
      <section className="bg-white py-16 lg:py-20 border-t border-kapture-fog">
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">PICK YOUR TIER</span>
            <h2 className="h-section text-kapture-black">£29 download. £29 / mo hosted.</h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Pay once for a lifetime download in five formats, or run hosted with a branded
              URL, magic-link invites, queue, and inspector read-only access. The £29 floor is
              non-negotiable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            <div className="tier">
              <h3>Single download</h3>
              <p className="text-xs text-kapture-smoke">
                One-time, lifetime use, single workspace.
              </p>
              <div className="price">£29</div>
              <div className="price-foot">one-time · per pack</div>
              <ul>
                <li>· All 4 pathways</li>
                <li>· PDF + CSV included</li>
                <li>· DOCX, HTML, Google Forms add-on</li>
                <li>· Single workspace</li>
                <li>· No subscription</li>
              </ul>
              <BuyButton
                productId={product.id}
                mode="oneoff"
                label="Buy download"
                className="btn-secondary text-xs justify-center mt-auto"
              />
            </div>
            <div
              className="tier"
              style={{
                borderColor: "#FFD400",
                background: "linear-gradient(180deg,#FFFBEB 0%,#fff 60%)",
              }}
            >
              <h3>Hosted licence</h3>
              <p className="text-xs text-kapture-smoke">Per-pack, per-month, fully hosted.</p>
              <div className="price">
                £29{" "}
                <span className="text-sm font-medium text-kapture-smoke font-display">/ mo</span>
              </div>
              <div className="price-foot">unlimited submissions · cancel anytime</div>
              <ul>
                <li>· Branded URL</li>
                <li>· Magic-link invites</li>
                <li>· HR queue + approvals</li>
                <li>· All formats included</li>
                <li>· Inspector read-only</li>
                <li>· Audit hash on every submission</li>
              </ul>
              <BuyButton
                productId={product.id}
                mode="subscription"
                label="Start hosted licence"
                className="btn-yellow text-xs justify-center mt-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
