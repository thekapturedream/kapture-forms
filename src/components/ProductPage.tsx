"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, FileText } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { BuyControls } from "@components/BuyControls";
import { DeviceShowcase } from "@components/DeviceShowcase";
import { FormDemoModal } from "@components/FormDemoModal";
import { ProductHighlights } from "@components/ProductHighlights";
import { CartButton } from "@components/cart/CartButton";
import { type StoreProduct, relatedProducts } from "@lib/store-product";
import { ACCENTS } from "@lib/customization";
import { getContrastTextClass } from "@lib/contrast";
import { getSchema } from "@lib/schemas";

const FONT_FAMILY = {
  manrope: "'Manrope', system-ui, sans-serif",
} as const;

/**
 * Apple-shop-pattern product page.
 *
 *   • Hero pinned to 100svh-header on lg so the device demo + right rail
 *     both fit above the fold with 40px breathing
 *   • Inline accent swatches re-tint the demo without a full customise panel
 *   • Below: features, what's-in, specs, related, footer
 *   • Mobile: hero releases its height cap, stacks cleanly and scrolls
 */
export function ProductPageContent({ product }: { product: StoreProduct }) {
  const related = relatedProducts(product.slug);
  const isPass = product.status === "pass";
  const isBundle = product.status === "bundle";
  const isPreorder = product.status === "soon";

  // Accent stays in state so the inline swatch row can re-tint the device preview
  // in real time, without bloating the hero with a full customise block.
  const [accent, setAccent] = useState<string>("#FFD400");

  // Test Form modal — only available when a schema is registered for this product.
  const schema = getSchema(product.id);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO — pinned to 100vh on desktop with uniform padding. The device
            card uses a calc-based height (viewport − header − section padding)
            so the whole template demo always fits above the fold. Mobile and
            tablet keep aspect ratios for natural stacking. */}
        <section className="bg-white dark:bg-kapture-black lg:h-[calc(100svh-3.5rem)] lg:overflow-hidden lg:flex lg:items-center">
          <div className="kap-shell py-10 sm:py-12 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            {/* LEFT — device showcase. overflow-hidden + min-w-0 contain any
                device frame that would otherwise burst out of the card on a
                narrow viewport. */}
            <div className="lg:col-span-7 order-2 lg:order-1 min-w-0">
              <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[calc(100svh-3.5rem-5rem)] flex items-center justify-center rounded-[24px] sm:rounded-[32px] bg-kapture-paper/60 dark:bg-white/[0.03] p-5 sm:p-6 lg:p-6 overflow-hidden">
                <DeviceShowcase
                  product={product}
                  accent={accent}
                  fontFamily={FONT_FAMILY.manrope}
                />
              </div>
            </div>

            {/* RIGHT — content sized to fit alongside the demo on lg. */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55 mb-2.5">
                {isPass ? "DESIGNER PASS" : isBundle ? "BUNDLE" : isPreorder ? `PRE-ORDER · ${product.release ?? "SOON"}` : product.industry}
                {product.subcategory && ` · ${product.subcategory}`}
              </div>
              <h1 className="font-bold text-2xl sm:text-[1.75rem] lg:text-[2rem] xl:text-[2.25rem] leading-[1.1] tracking-[-0.02em] text-kapture-black dark:text-white">
                {product.title}
              </h1>
              <p className="mt-2.5 text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed">
                {priceLine(product)}
              </p>

              {/* Plan + CTAs */}
              <div className="mt-5">
                <h2 className="font-bold text-sm tracking-[-0.005em] mb-2.5">
                  <span className="text-kapture-black dark:text-white">Plan.</span>
                  <span className="text-kapture-mist dark:text-white/40"> Which suits you?</span>
                </h2>
                <BuyControls product={product} />
                {schema && (
                  <button
                    type="button"
                    onClick={() => setDemoOpen(true)}
                    className="mt-2.5 w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-white/[0.06] text-kapture-black dark:text-white border-2 border-kapture-black dark:border-white hover:bg-kapture-paper dark:hover:bg-white/[0.12] px-5 py-3 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Test form →
                  </button>
                )}
              </div>

              {/* Accent strip — single inline row, no headlines, no body. Live-tints the demo. */}
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-kapture-mist dark:text-white/45 shrink-0">
                  Accent
                </span>
                <div className="flex items-center gap-1.5">
                  {ACCENTS.map((a) => {
                    const active = accent.toUpperCase() === a.hex.toUpperCase();
                    return (
                      <button
                        key={a.hex}
                        type="button"
                        onClick={() => setAccent(a.hex)}
                        aria-label={a.label}
                        title={a.label}
                        className={`relative w-6 h-6 rounded-full border-2 transition ${
                          active
                            ? "border-kapture-black dark:border-white"
                            : "border-transparent hover:border-kapture-fog dark:hover:border-white/30"
                        }`}
                        style={{ backgroundColor: a.hex }}
                      >
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check size={10} strokeWidth={3} className={getContrastTextClass(a.hex)} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[0.6875rem] font-medium text-kapture-mist dark:text-white/45 ml-auto">
                  Full theming after purchase →
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="kap-shell py-16 sm:py-24">
            <SectionTitle pre="What makes it different." post="Three reasons." center />
            <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {product.features.slice(0, 3).map((f) => (
                <div key={f.title} className="text-center">
                  <h3 className="font-bold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IN THE PACK · animated stat counters + feature card grid (replaces
            the old single-column 'In the pack' list AND the 'Specs · At a
            glance' table — both were carrying the same data). */}
        <ProductHighlights product={product} />

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <div className="kap-shell py-16 sm:py-20">
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

      {schema && (
        <FormDemoModal
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          schema={schema}
          product={product}
        />
      )}
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
      className={`font-semibold text-xl sm:text-2xl tracking-[-0.015em] ${center ? "text-center" : ""}`}
    >
      <span className="text-kapture-black dark:text-white">{pre}</span>
      {post && <span className="text-kapture-mist dark:text-white/40"> {post}</span>}
    </h2>
  );
}

function priceLine(product: StoreProduct): string {
  const opt = product.options.find((o) => o.primary) ?? product.options[0];
  if (!opt) return "";
  if (opt.mode === "preorder") {
    return `From £${(opt.pricePence / 100).toFixed(2)} to reserve. £${((opt.rrpPence ?? 2900) / 100).toFixed(0)} at launch.`;
  }
  if (opt.mode === "subscription" || opt.mode === "pass") {
    return `£${(opt.pricePence / 100).toFixed(0)} / month. Cancel anytime.`;
  }
  if (opt.mode === "bundle") {
    return `From £${(opt.pricePence / 100).toFixed(0)}. Save vs individual packs.`;
  }
  return `From £${(opt.pricePence / 100).toFixed(0)}. Lifetime updates.`;
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
      <div className="kap-shell h-14 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Home</Link>
          <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Store</Link>
          <Link href="/builder" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Builder</Link>
          <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">How-to</Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-semibold">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-1">
          <CartButton size={32} />
          <ThemeToggle size={32} />
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-kapture-fog dark:border-white/5">
      <div className="kap-shell py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
