import Link from "next/link";
import { ArrowUpRight, Check, Plus, FileText } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { IndustryIcon } from "@components/IndustryIcon";
import { BuyControls } from "@components/BuyControls";
import { type StoreProduct, relatedProducts } from "@lib/store-product";

/**
 * Apple-style product page.
 *
 * Layout follows apple.com/shop:
 *   - Top bar: small title left, "from £X" right
 *   - Below that: shipping / pickup row
 *   - Two-column body:
 *       LEFT  · big visual (form preview placeholder)
 *       RIGHT · section headings ("Plan. Which is best for you?"),
 *               selection cards, helper, customise teaser, single Buy CTA
 *   - Below the fold: features, what's-in-the-pack, related row
 *
 * Typography: titles 1.5–2rem (not 4.5rem!), bold but compact.
 * Section headings two-tone — "Plan. Which is best for you?"
 */
export function ProductPageContent({ product }: { product: StoreProduct }) {
  const related = relatedProducts(product.slug);
  const fromOption =
    product.options.find((o) => o.primary) ?? product.options[0];
  const isPass = product.status === "pass";
  const isBundle = product.status === "bundle";
  const isPreorder = product.status === "soon";
  const isLive = product.status === "live";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* TOP BAR — Apple's "iPhone 17 Pro · From $1099" pattern */}
        <section className="border-b border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-6 sm:py-7 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-semibold text-xl sm:text-2xl tracking-[-0.015em] text-kapture-black dark:text-white">
                {isBundle ? "Bundle" : isPass ? "Subscribe to" : "Buy"}{" "}
                <span>{product.title}</span>
              </h1>
              <p className="mt-1 text-sm sm:text-base text-kapture-smoke dark:text-white/65">
                {priceLine(product)}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-kapture-smoke dark:text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-kapture-paper dark:bg-white/[0.06]">
                  <FileText size={12} strokeWidth={2} />
                </span>
                Instant delivery
              </span>
              <span className="w-px h-4 bg-kapture-fog dark:bg-white/15" />
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-kapture-paper dark:bg-white/[0.06]">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                Audit-hashed
              </span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN BODY */}
        <section>
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT — visual placeholder */}
            <div>
              <div className="aspect-[4/5] rounded-[28px] bg-kapture-paper dark:bg-white/[0.04] border border-kapture-fog dark:border-white/10 flex items-center justify-center p-10 sm:p-14">
                <FormPreview product={product} />
              </div>
              {/* Tiny indicator row (Apple's pagination dots) */}
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-kapture-black dark:bg-white" />
                <span className="w-1.5 h-1.5 rounded-full bg-kapture-fog dark:bg-white/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-kapture-fog dark:bg-white/25" />
              </div>
            </div>

            {/* RIGHT — selection */}
            <div className="space-y-10 lg:space-y-12">
              {/* Plan section */}
              <div>
                <SectionTitle pre={planTitle(product)} post="Which suits you?" />
                <div className="mt-5 space-y-3">
                  <BuyControls product={product} />
                </div>
              </div>

              {/* Customise teaser */}
              {isLive || isBundle ? (
                <div>
                  <SectionTitle pre="Customise." post="After purchase." />
                  <div className="mt-5 rounded-2xl border border-kapture-fog dark:border-white/15 bg-kapture-paper dark:bg-white/[0.04] p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 shrink-0">
                        <Plus size={16} strokeWidth={2} className="text-kapture-black dark:text-white" />
                      </span>
                      <div className="text-sm text-kapture-smoke dark:text-white/70 leading-relaxed">
                        Change the headline, swap the font, set your accent
                        colour, round the buttons. Brand the hosted runner.
                        Available the moment your purchase clears — from your
                        dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24">
            <SectionTitle pre="What makes it different." post="Three reasons." center />
            <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {product.features.slice(0, 3).map((f) => (
                <div key={f.title} className="text-center">
                  <h3 className="font-semibold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-kapture-smoke dark:text-white/65 leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* In the pack */}
        <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[800px] px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
            <SectionTitle pre="In the pack." post="What you get." center />
            <ul className="mt-8 space-y-3.5">
              {product.whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-kapture-smoke dark:text-white/75 leading-relaxed"
                >
                  <Check size={18} strokeWidth={2.5} className="text-kapture-yellow shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Specs */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[640px] px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
            <SectionTitle pre="Specs." post="At a glance." center />
            <dl className="mt-8 divide-y divide-kapture-fog dark:divide-white/10 rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.04]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <dt className="text-kapture-smoke dark:text-white/65">{s.label}</dt>
                  <dd className="font-semibold text-kapture-black dark:text-white text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
              <SectionTitle
                pre={`More in ${product.subcategory ?? product.industry}.`}
                post="You might also like."
                center
              />
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 hover:border-kapture-black dark:hover:border-white/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
                          r.status === "live"
                            ? "bg-kapture-yellow text-kapture-black"
                            : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/15"
                        }`}
                      >
                        {r.status === "live" ? "LIVE" : r.release ?? "SOON"}
                      </span>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2.25}
                        className="text-kapture-mist group-hover:text-kapture-black dark:group-hover:text-white transition"
                      />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-kapture-black dark:text-white tracking-[-0.005em] flex-1">
                      {r.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-base text-kapture-black dark:text-white">
                        £{r.options[0] ? (r.options[0].pricePence / 100).toFixed(0) : "29"}
                      </span>
                      <span className="text-xs font-semibold text-kapture-black dark:text-white">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─── pieces ─── */

function SectionTitle({
  pre,
  post,
  center,
}: {
  pre: string;
  post?: string;
  center?: boolean;
}) {
  return (
    <h2
      className={`font-semibold text-xl sm:text-2xl tracking-[-0.015em] ${
        center ? "text-center" : ""
      }`}
    >
      <span className="text-kapture-black dark:text-white">{pre}</span>
      {post && <span className="text-kapture-mist dark:text-white/40"> {post}</span>}
    </h2>
  );
}

function FormPreview({ product }: { product: StoreProduct }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-white/[0.06] border border-kapture-fog dark:border-white/10 mb-6">
        <IndustryIcon name={product.industry} size={36} className="text-kapture-black dark:text-white" />
      </div>
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/55 mb-2">
        {product.industry}
        {product.subcategory && ` · ${product.subcategory}`}
      </div>
      <div className="font-semibold text-base sm:text-lg text-kapture-black dark:text-white tracking-[-0.01em] max-w-[18rem] mx-auto">
        {product.title}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {product.formats.map((f) => (
          <span
            key={f}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-mono font-bold tracking-wider bg-white dark:bg-white/[0.06] border border-kapture-fog dark:border-white/10 text-kapture-smoke dark:text-white/65 uppercase"
          >
            {f === "web" ? "Hosted" : f === "gforms" ? "GForms" : f}
          </span>
        ))}
      </div>
    </div>
  );
}

function priceLine(product: StoreProduct): string {
  const opt = product.options.find((o) => o.primary) ?? product.options[0];
  if (!opt) return "";
  if (opt.mode === "preorder") {
    return `From £${(opt.pricePence / 100).toFixed(2)} to reserve · £${((opt.rrpPence ?? 2900) / 100).toFixed(0)} at launch.`;
  }
  if (opt.mode === "subscription" || opt.mode === "pass") {
    return `£${(opt.pricePence / 100).toFixed(0)} / month. Cancel anytime.`;
  }
  if (opt.mode === "bundle") {
    return `Bundle: £${(opt.pricePence / 100).toFixed(0)} · save vs individual packs.`;
  }
  return `From £${(opt.pricePence / 100).toFixed(0)}. Lifetime updates.`;
}

function planTitle(product: StoreProduct): string {
  if (product.status === "soon") return "Pre-order.";
  if (product.status === "pass") return "Plan.";
  if (product.status === "bundle") return "Bundle.";
  return "Plan.";
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Home</Link>
          <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Store</Link>
          <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">How-to</Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Dashboard</Link>
        </nav>
        <ThemeToggle size={32} />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-smoke dark:text-white/40">
          © {new Date().getFullYear()} Kapture · UK
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55 font-medium">
          <Link href="/store" className="hover:text-kapture-black dark:hover:text-white">Store</Link>
          <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
          <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
