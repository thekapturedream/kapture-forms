import Link from "next/link";
import { ArrowLeft, Check, ArrowUpRight } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { BuyControls } from "@components/BuyControls";
import { type StoreProduct, relatedProducts } from "@lib/store-product";

/**
 * Apple-style product page.
 *
 *   1. Minimal header
 *   2. Small "back to industry" anchor
 *   3. Centred hero — tiny category tag, massive bold title, one-line
 *      hook, price + plan toggle + single Buy button
 *   4. Section A — three feature blocks, generous whitespace
 *   5. Section B — what's in the pack (single list)
 *   6. Section C — closing buy band (one CTA repeated)
 *   7. Related products (4 cards) + footer
 *
 * All copy bold-leaning. Single accent (yellow) on the Buy button only.
 */
export function ProductPageContent({ product }: { product: StoreProduct }) {
  const related = relatedProducts(product.slug);
  const isPreorder = product.status === "soon";
  const isPass = product.status === "pass";
  const isBundle = product.status === "bundle";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Back link */}
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 pt-6">
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            All packs
          </Link>
        </div>

        {/* HERO — centred, generous whitespace */}
        <section>
          <div className="mx-auto max-w-[800px] px-5 sm:px-6 lg:px-10 pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 text-center">
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-kapture-smoke dark:text-white/55 mb-5">
              {isPass
                ? "DESIGNER PASS"
                : isBundle
                  ? "BUNDLE"
                  : isPreorder
                    ? `PRE-ORDER · ${product.release ?? "SOON"}`
                    : product.industry}
            </div>

            <h1 className="font-bold text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.02] tracking-[-0.035em] text-kapture-black dark:text-white">
              {product.title}
            </h1>

            <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-kapture-smoke dark:text-white/70 leading-relaxed font-medium max-w-2xl mx-auto">
              {product.hook}
            </p>

            <div className="mt-10 sm:mt-12">
              <BuyControls product={product} />
            </div>
          </div>
        </section>

        {/* SECTION — three feature blocks */}
        <section>
          <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl tracking-[-0.025em] text-kapture-black dark:text-white text-center mb-12 sm:mb-16">
              What makes it different.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {product.features.slice(0, 3).map((f) => (
                <div key={f.title} className="text-center">
                  <h3 className="font-bold text-lg sm:text-xl text-kapture-black dark:text-white tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-kapture-smoke dark:text-white/65 leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION — what's in the pack */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[800px] px-5 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl tracking-[-0.025em] text-kapture-black dark:text-white text-center mb-12">
              What&apos;s in the pack.
            </h2>
            <ul className="max-w-xl mx-auto space-y-4">
              {product.whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base sm:text-lg text-kapture-smoke dark:text-white/75 leading-relaxed font-medium"
                >
                  <Check size={20} strokeWidth={2.5} className="text-kapture-yellow shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION — specs (quiet, single column) */}
        <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[640px] px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
            <h2 className="font-bold text-xl sm:text-2xl tracking-[-0.02em] text-kapture-black dark:text-white text-center mb-8">
              Specifications.
            </h2>
            <dl className="divide-y divide-kapture-fog dark:divide-white/10 rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.04]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-5 sm:px-6 py-3.5 text-sm sm:text-base">
                  <dt className="text-kapture-smoke dark:text-white/65 font-medium">{s.label}</dt>
                  <dd className="font-bold text-kapture-black dark:text-white text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[800px] px-5 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-28 text-center">
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white">
              Ready when you are.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-kapture-smoke dark:text-white/65 max-w-xl mx-auto font-medium">
              {closingLine(product)}
            </p>
            <div className="mt-10">
              <BuyControls product={product} />
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-16 sm:py-20">
              <h2 className="font-bold text-xl sm:text-2xl tracking-[-0.02em] text-kapture-black dark:text-white text-center mb-10">
                More in {product.subcategory ?? product.industry}.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                        strokeWidth={2.5}
                        className="text-kapture-mist group-hover:text-kapture-black dark:group-hover:text-white transition"
                      />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-kapture-black dark:text-white tracking-[-0.01em] flex-1">
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

function closingLine(product: StoreProduct): string {
  if (product.status === "soon")
    return `Reserve your copy at half price. Pack ships ${product.release ?? "at launch"}.`;
  if (product.status === "pass") return "Unlimited downloads. Cancel anytime.";
  if (product.status === "bundle") return "All packs. One purchase. Lifetime updates.";
  return "Five formats. One purchase. Lifetime updates.";
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Home</Link>
          <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Store</Link>
          <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">How-to</Link>
        </nav>
        <ThemeToggle size={34} />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog dark:border-white/5">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
