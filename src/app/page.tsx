import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { INDUSTRIES, PRODUCTS, getLiveProducts } from "@lib/products";

export default function HomePage() {
  const liveProducts = getLiveProducts();
  const featured = PRODUCTS;
  const headlineProduct = liveProducts[0];

  return (
    <>
      <Nav variant="marketing" />

      {/* HERO */}
      <section className="bg-kapture-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full bg-kapture-yellow/15 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -left-40 bottom-0 w-[400px] h-[400px] rounded-full bg-kapture-yellow/10 blur-3xl pointer-events-none"
        />
        <div className="container-c relative py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="chip chip-yellow">FORMS · STORE</span>
                <span className="chip chip-outline-light">By Kapture</span>
                <span className="chip chip-outline-light">v0.1 · early access</span>
              </div>
              <h1 className="h-section text-white mb-5">
                The forms store.
                <br />
                For every industry. For every workflow.
              </h1>
              <p className="font-serif text-lg text-white/80 leading-relaxed max-w-2xl mb-7">
                Pre-built, branded, audit-hashed compliance forms. Healthcare. HR. Legal.
                Finance. Education. Hospitality. Real estate. Construction. One form set, five
                export formats — printable PDF, DOCX, embeddable HTML, HRIS-ready CSV, Google
                Forms spec. Pay once or run hosted with magic links.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#industries" className="btn-yellow">
                  Browse industries →
                </Link>
                <Link href="/products/staff-onboarding-uk-care" className="btn-ghost-light">
                  Try the live one
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-xs text-white/55 font-mono flex-wrap">
                <span>
                  <span className="text-kapture-yellow">●</span> {liveProducts.length} live ·{" "}
                  {PRODUCTS.length - liveProducts.length} in review
                </span>
                <span>
                  <span className="text-kapture-yellow">●</span> 5 export formats
                </span>
                <span>
                  <span className="text-kapture-yellow">●</span> White-label ready
                </span>
              </div>
            </div>
            {headlineProduct && (
              <div className="lg:col-span-5">
                <div className="bg-kapture-coal border border-kapture-ash rounded-2xl p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[0.625rem] tracking-widest uppercase text-kapture-yellow">
                      FIRST LIVE PRODUCT
                    </span>
                    <span
                      className="chip"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        color: "#86EFAC",
                        borderColor: "rgba(16,185,129,0.3)",
                        fontFamily: "var(--font-mono), JetBrains Mono, monospace",
                        fontSize: "0.625rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">
                    {headlineProduct.shortTitle}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    {headlineProduct.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {headlineProduct.exports.map((f) => (
                      <FormatBadge key={f} format={f} />
                    ))}
                  </div>
                  <div className="pt-4 border-t border-kapture-ash flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-mono text-xs text-white/55">
                      From {headlineProduct.price.subscriptionDisplay}
                    </span>
                    <Link
                      href={`/products/${headlineProduct.slug}`}
                      className="btn-yellow text-xs"
                    >
                      Open product →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section
        id="industries"
        className="bg-white py-16 lg:py-20 border-b border-kapture-fog"
      >
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">TEN INDUSTRIES</span>
            <h2 className="h-section text-kapture-black">
              Pick your sector. We&apos;ve already drafted the form.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Each industry pack ships with the regulator&apos;s required fields, the audit
              trail you need to defend in front of an inspector, and your brand chrome on top.
              Healthcare ships first. The rest open in 2026.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.id}
                href={ind.status === "live" ? "#featured" : "#partner"}
                className={`ind-card${ind.status === "live" ? " live" : ""}`}
              >
                <div className="ind-icon">{ind.initials}</div>
                <div
                  className={`font-mono text-[0.625rem] uppercase tracking-widest mb-1 ${
                    ind.status === "live" ? "text-kapture-yellow" : "text-kapture-mist"
                  }`}
                >
                  {ind.status === "live"
                    ? `LIVE · ${ind.productCount} PRODUCT${ind.productCount === 1 ? "" : "S"}`
                    : `SOON · ${ind.release}`}
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{ind.label}</h3>
                <p className="text-xs text-kapture-smoke leading-relaxed">{ind.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="bg-kapture-paper py-16 lg:py-20">
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">HEALTHCARE PACK</span>
            <h2 className="h-section text-kapture-black">
              First wave: six healthcare forms. One live today.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Each form is a pre-engineered template — fields locked to the regulator&apos;s
              required schema, conditional logic for the role / setting / risk band, audit hash
              baked into every submission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => {
              const isLive = p.status === "live";
              return isLive ? (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="prod-card live"
                >
                  <div className="prod-cover">
                    <div className="prod-init">{p.initials}</div>
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
                  </div>
                  <div className="prod-body">
                    <h3 className="font-display text-lg font-semibold mb-1">{p.shortTitle}</h3>
                    <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-3">
                      {p.meta}
                    </div>
                    <p className="text-sm text-kapture-smoke leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.exports.map((f) => (
                        <FormatBadge key={f} format={f} />
                      ))}
                    </div>
                  </div>
                  <div className="prod-foot">
                    <span className="price">
                      {p.price.oneOffDisplay} <small>/ one-off or {p.price.subscriptionDisplay}</small>
                    </span>
                    <span className="text-xs font-medium text-kapture-black">Open product →</span>
                  </div>
                </Link>
              ) : (
                <div key={p.id} className="prod-card" style={{ opacity: 0.85 }}>
                  <div className="prod-cover" style={{ background: "#3A3A3A" }}>
                    <div className="prod-init" style={{ background: "#9A9A9A" }}>
                      {p.initials}
                    </div>
                    <span className="chip">Coming soon</span>
                  </div>
                  <div className="prod-body">
                    <h3 className="font-display text-lg font-semibold mb-1">{p.shortTitle}</h3>
                    <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-3">
                      {p.meta}
                    </div>
                    <p className="text-sm text-kapture-smoke leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.exports.map((f) => (
                        <FormatBadge key={f} format={f} />
                      ))}
                    </div>
                  </div>
                  <div className="prod-foot">
                    <span className="price">
                      {p.price.oneOffDisplay} <small>/ {p.price.subscriptionDisplay}</small>
                    </span>
                    <span className="text-xs text-kapture-mist">{p.release}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPORT FORMATS */}
      <section
        id="exports"
        className="bg-white py-16 lg:py-20 border-t border-kapture-fog"
      >
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">EXPORTS</span>
            <h2 className="h-section text-kapture-black">
              One submission. Six shapes. Buyer&apos;s choice.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Every Forms product ships with the same export menu. Pick what your stack
              actually consumes — no rebuild, no rework, just a different button.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPORT_BLOCKS.map((b) => (
              <div
                key={b.format}
                className="bg-kapture-paper rounded-xl p-5 border border-kapture-fog"
              >
                <FormatBadge format={b.format} />
                <h3 className="font-display font-semibold text-base mb-1 mt-3">{b.title}</h3>
                <p className="text-sm text-kapture-smoke leading-relaxed">{b.body}</p>
                <div className="font-mono text-xs text-kapture-mist mt-2">{b.foot}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="bg-kapture-paper py-16 lg:py-20 border-t border-kapture-fog"
      >
        <div className="container-c">
          <div className="max-w-3xl mb-10">
            <span className="ed-kicker">PRICING MODEL</span>
            <h2 className="h-section text-kapture-black">
              Buy once. Run hosted. Or licence as a marketplace partner.
            </h2>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-3">
              Same form pack, three commercial models. Pick the one your operations team will
              actually use day-to-day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="tier">
              <h3>Single download</h3>
              <p className="text-xs text-kapture-smoke">
                One-time, lifetime use, single workspace.
              </p>
              <div className="price">£29</div>
              <div className="price-foot">one-time · per pack</div>
              <ul>
                <li>· All pack pathways</li>
                <li>· PDF + CSV included</li>
                <li>· Other formats add-on</li>
                <li>· Single workspace</li>
              </ul>
              <Link
                href="/products/staff-onboarding-uk-care"
                className="btn-secondary text-xs justify-center mt-auto"
              >
                Try the live one
              </Link>
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
              <div className="price-foot">unlimited submissions</div>
              <ul>
                <li>· Branded URL</li>
                <li>· Magic-link invites</li>
                <li>· HR queue + approvals</li>
                <li>· All formats included</li>
                <li>· Inspector read-only</li>
              </ul>
              <Link
                href="/products/staff-onboarding-uk-care#buy"
                className="btn-yellow text-xs justify-center mt-auto"
              >
                Start hosted licence
              </Link>
            </div>

            <div className="tier">
              <h3>Multi-site / NHS</h3>
              <p className="text-xs text-kapture-smoke">
                Group rollup, SSO, custom templates.
              </p>
              <div className="price">
                From £199{" "}
                <span className="text-sm font-medium text-kapture-smoke font-display">/ mo</span>
              </div>
              <div className="price-foot">10+ sites · pricing on application</div>
              <ul>
                <li>· Multi-site dashboard</li>
                <li>· SSO + SAML</li>
                <li>· Custom templates</li>
                <li>· Account manager + SLA</li>
              </ul>
              <Link href="#partner" className="btn-secondary text-xs justify-center mt-auto">
                Talk to us
              </Link>
            </div>

            <div
              className="tier"
              style={{ background: "#0A0A0A", color: "#fff", borderColor: "#0A0A0A" }}
            >
              <h3 style={{ color: "#fff" }}>Marketplace publisher</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                List your form pack on Forms · earn revenue share.
              </p>
              <div className="price" style={{ color: "#FFD400" }}>
                70 / 30
              </div>
              <div className="price-foot" style={{ color: "rgba(255,255,255,0.6)" }}>
                publisher / platform · transparent
              </div>
              <ul style={{ color: "rgba(255,255,255,0.85)" }}>
                <li style={{ color: "#FFD400" }}>· Brandable storefront</li>
                <li style={{ color: "#FFD400" }}>· Hosted infra + payments</li>
                <li style={{ color: "#FFD400" }}>· DPA / DPO supplied</li>
                <li style={{ color: "#FFD400" }}>· Editorial review on submit</li>
              </ul>
              <Link href="#partner" className="btn-yellow text-xs justify-center mt-auto">
                Publish a pack →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER */}
      <section id="partner" className="bg-kapture-yellow py-16 lg:py-20">
        <div className="container-c grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="ed-kicker" style={{ color: "#876300" }}>
              PUBLISHER PROGRAMME
            </span>
            <h2 className="h-section text-kapture-black mb-4">
              You wrote the form once. Sell it forever.
            </h2>
            <p className="font-serif text-base text-kapture-coal leading-relaxed mb-5">
              Compliance officers, HR consultants, sector specialists,
              regulators-turned-consultants — your form pack is an asset. List it on Forms and
              earn 70% of every download, every monthly licence, every multi-site renewal. We
              handle the platform, the auditing, the payments, the marketing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/login?intent=publisher" className="btn-primary">
                Apply to publish →
              </Link>
              <Link href="#exports" className="btn-secondary">
                See export schema
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-kapture-black text-white rounded-2xl p-6">
              <div className="font-mono text-[0.625rem] tracking-widest uppercase text-kapture-yellow mb-3">
                PUBLISHER REQUIREMENTS
              </div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">01</span> Subject-matter
                  authority — relevant qualification or sector role.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">02</span> Form pack passes
                  editorial review (regulator-mapped fields, audit trail, conditional logic
                  correctness).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">03</span> DPA + indemnity in
                  place — Kapture supplies templates.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kapture-yellow font-bold">04</span> Two annual revisions
                  (regulators move; your pack moves with them).
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

const EXPORT_BLOCKS: Array<{
  format: "pdf" | "docx" | "html" | "csv" | "gforms" | "web";
  title: string;
  body: string;
  foot: string;
}> = [
  {
    format: "pdf",
    title: "Print-ready PDF",
    body: "A4. Signature blocks. Audit footer with hash. Drop in the HR file.",
    foot: "Included in every pack",
  },
  {
    format: "docx",
    title: "Editable DOCX",
    body: "Microsoft Word. Track-changes ready. Edit in your house style.",
    foot: "£9 / pack add-on",
  },
  {
    format: "html",
    title: "Embeddable HTML",
    body: "Drop in your careers / intake page. Same form, your domain.",
    foot: "£19 / domain",
  },
  {
    format: "csv",
    title: "HRIS / system CSV",
    body: "Standard fields plus extras column. Imports into Bamboo, Breathe, Workday.",
    foot: "Included in every pack",
  },
  {
    format: "gforms",
    title: "Google Forms spec",
    body: "Importable JSON. Same fields, same logic, paste into Google Forms.",
    foot: "£12 / pack add-on",
  },
  {
    format: "web",
    title: "Hosted web form",
    body: "Branded URL. Magic-link invitations. We host the queue and audit log.",
    foot: "From £29 / mo",
  },
];
