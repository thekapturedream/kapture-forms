"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, FileText } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { BuyControls } from "@components/BuyControls";
import { DeviceShowcase } from "@components/DeviceShowcase";
import { type StoreProduct, relatedProducts } from "@lib/store-product";
import { ACCENTS, FONTS, type FontChoice } from "@lib/customization";

const FONT_FAMILY: Record<FontChoice, string> = {
  manrope: "'Manrope', system-ui, sans-serif",
  inter: "'Inter', system-ui, sans-serif",
  "space-grotesk": "'Space Grotesk', system-ui, sans-serif",
};

/**
 * Apple-shop-pattern product page.
 *
 *   • 100vh hero: device showcase left · plan + customise quick swatches right
 *   • Below: features, what's-in, specs, related, footer
 *   • Mobile: stacks cleanly, device shrinks to 60vh
 */
export function ProductPageContent({ product }: { product: StoreProduct }) {
  const related = relatedProducts(product.slug);
  const isPass = product.status === "pass";
  const isBundle = product.status === "bundle";
  const isPreorder = product.status === "soon";

  // Customise quick controls — apply to the device preview in real time.
  const [accent, setAccent] = useState<string>("#FFD400");
  const [font, setFont] = useState<FontChoice>("manrope");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO — 100vh */}
        <section className="min-h-[calc(100vh-3.5rem)] flex items-center bg-white dark:bg-kapture-black">
          <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* LEFT — device showcase */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] flex items-center justify-center rounded-[32px] bg-kapture-paper/60 dark:bg-white/[0.03]">
                <DeviceShowcase
                  product={product}
                  accent={accent}
                  fontFamily={FONT_FAMILY[font]}
                />
              </div>
            </div>

            {/* RIGHT — content */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/55 mb-3">
                {isPass ? "DESIGNER PASS" : isBundle ? "BUNDLE" : isPreorder ? `PRE-ORDER · ${product.release ?? "SOON"}` : product.industry}
                {product.subcategory && ` · ${product.subcategory}`}
              </div>
              <h1 className="font-semibold text-2xl sm:text-3xl lg:text-[2.25rem] leading-[1.1] tracking-[-0.02em] text-kapture-black dark:text-white">
                {product.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base font-medium text-kapture-smoke dark:text-white/70 leading-relaxed">
                {priceLine(product)}
              </p>

              {/* Plan section */}
              <div className="mt-7">
                <h2 className="font-semibold text-base tracking-[-0.01em]">
                  <span className="text-kapture-black dark:text-white">Plan.</span>
                  <span className="text-kapture-mist dark:text-white/40"> Which suits you?</span>
                </h2>
                <div className="mt-3">
                  <BuyControls product={product} />
                </div>
              </div>

              {/* Customise quick swatches */}
              <div className="mt-7 pt-7 border-t border-kapture-fog dark:border-white/10">
                <h2 className="font-semibold text-base tracking-[-0.01em]">
                  <span className="text-kapture-black dark:text-white">Customise.</span>
                  <span className="text-kapture-mist dark:text-white/40"> Preview your style.</span>
                </h2>

                {/* Accent swatches */}
                <div className="mt-3">
                  <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40 mb-2">
                    Accent
                  </div>
                  <div className="flex items-center gap-2">
                    {ACCENTS.map((a) => {
                      const active = accent.toUpperCase() === a.hex.toUpperCase();
                      return (
                        <button
                          key={a.hex}
                          type="button"
                          onClick={() => setAccent(a.hex)}
                          aria-label={a.label}
                          title={a.label}
                          className={`relative w-7 h-7 rounded-full border-2 transition ${
                            active
                              ? "border-kapture-black dark:border-white"
                              : "border-transparent hover:border-kapture-fog dark:hover:border-white/30"
                          }`}
                          style={{ backgroundColor: a.hex }}
                        >
                          {active && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check
                                size={12}
                                strokeWidth={3}
                                className={parseInt(a.hex.slice(1), 16) > 0x888888 ? "text-kapture-black" : "text-white"}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font picker */}
                <div className="mt-4">
                  <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40 mb-2">
                    Font
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {FONTS.map((f) => {
                      const active = font === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFont(f.id)}
                          className={`rounded-lg border py-2 transition ${
                            active
                              ? "border-kapture-black dark:border-kapture-yellow"
                              : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
                          }`}
                        >
                          <span
                            className="block text-xs font-medium text-kapture-black dark:text-white"
                            style={{ fontFamily: FONT_FAMILY[f.id] }}
                          >
                            {f.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-4 text-[0.6875rem] text-kapture-mist dark:text-white/45">
                  Full customisation — headline, button shape, card corners — opens in your dashboard after purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
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

        {/* IN THE PACK */}
        <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[800px] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
            <SectionTitle pre="In the pack." post="What you get." center />
            <ul className="mt-8 space-y-3.5">
              {product.whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base font-medium text-kapture-smoke dark:text-white/80 leading-relaxed"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SPECS */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[640px] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
            <SectionTitle pre="Specs." post="At a glance." center />
            <dl className="mt-8 divide-y divide-kapture-fog dark:divide-white/10 rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.04]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <dt className="font-medium text-kapture-smoke dark:text-white/70">{s.label}</dt>
                  <dd className="font-bold text-kapture-black dark:text-white text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
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
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between gap-3">
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
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
