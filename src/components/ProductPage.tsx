import Link from "next/link";
import {
  ArrowLeft,
  Check,
  FileText,
  Shield,
  RefreshCw,
  Mail,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { IndustryIcon } from "@components/IndustryIcon";
import { BuyControls } from "@components/BuyControls";
import { type StoreProduct, relatedProducts } from "@lib/store-product";

const FORMAT_DETAILS: Record<string, { label: string; body: string }> = {
  pdf: { label: "PDF", body: "A4 · audit footer · signature block" },
  docx: { label: "DOCX", body: "Editable Word · track-changes ready" },
  html: { label: "HTML", body: "Embeddable form · scoped CSS" },
  csv: { label: "CSV", body: "Schema · submissions · HRIS-ready" },
  gforms: { label: "GFORMS", body: "Apps Script importer · JSON spec" },
  web: { label: "HOSTED", body: "Branded URL · magic links · queue" },
};

/**
 * Amazon-style product page used by:
 *   - /products/[slug] (dynamic, every taxonomy form + bundles + pass)
 *   - /products/staff-onboarding-uk-care (static — live pack)
 *
 * Layout:
 *   - Breadcrumb (industry → subcategory → product)
 *   - Two-column hero: visual + format badges on the left,
 *     price card with buy controls on the right
 *   - Description, features, what's included, specifications
 *   - Related products from the same subcategory
 */
export function ProductPageContent({ product }: { product: StoreProduct }) {
  const related = relatedProducts(product.slug);
  const isLive = product.status === "live";
  const isBundle = product.status === "bundle";
  const isPass = product.status === "pass";
  const isSoon = product.status === "soon";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Home</Link>
            <Link href="/store" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Store</Link>
            <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How-to</Link>
            <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle size={34} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-3 flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-kapture-black dark:hover:text-white">Home</Link>
            <span className="text-kapture-mist dark:text-white/30">/</span>
            <Link href="/store" className="hover:text-kapture-black dark:hover:text-white">Store</Link>
            {product.industry !== "Cross-sector" && (
              <>
                <span className="text-kapture-mist dark:text-white/30">/</span>
                <Link
                  href={`/store/${slugifyIndustry(product.industry)}`}
                  className="hover:text-kapture-black dark:hover:text-white"
                >
                  {product.industry}
                </Link>
              </>
            )}
            {product.subcategory && (
              <>
                <span className="text-kapture-mist dark:text-white/30">/</span>
                <span className="text-kapture-mist dark:text-white/40">{product.subcategory}</span>
              </>
            )}
            <span className="text-kapture-mist dark:text-white/30">/</span>
            <span className="text-kapture-black dark:text-white truncate">{product.title}</span>
          </div>
        </div>

        {/* HERO BLOCK */}
        <section>
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT — visual + format showcase */}
            <div className="lg:col-span-7">
              {/* Top status row */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
                    isLive || isPass
                      ? "bg-kapture-yellow text-kapture-black"
                      : isBundle
                        ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black"
                        : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/15"
                  }`}
                >
                  {isPass ? "DESIGNER PASS" : isBundle ? "BUNDLE" : isLive ? "LIVE NOW" : `PRE-ORDER · ${product.release ?? "SOON"}`}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
                  {product.industry}
                  {product.subcategory && ` · ${product.subcategory}`}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] leading-[1.05] text-kapture-black dark:text-white">
                {product.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-kapture-smoke dark:text-white/70 leading-relaxed">
                {product.hook}
              </p>

              {/* Rating placeholder */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-kapture-yellow" fill="#FFD400" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-kapture-smoke dark:text-white/65 font-mono text-xs">
                  4.9 · {isLive ? "12 reviews" : "Pre-launch"}
                </span>
              </div>

              {/* Visual / format tiles */}
              <div className="mt-8 rounded-3xl border border-kapture-fog dark:border-white/15 bg-gradient-to-br from-kapture-paper to-white dark:from-white/[0.04] dark:to-transparent p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black">
                    <IndustryIcon name={product.industry} size={24} />
                  </span>
                  <div>
                    <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
                      WHAT YOU GET
                    </div>
                    <div className="font-semibold text-base text-kapture-black dark:text-white">
                      5 export formats + hosted runner
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.formats.map((f) => {
                    const d = FORMAT_DETAILS[f];
                    return (
                      <div
                        key={f}
                        className="rounded-xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-3"
                      >
                        <span className="inline-flex items-center bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded">
                          {d.label}
                        </span>
                        <div className="mt-2 text-xs text-kapture-smoke dark:text-white/55 leading-relaxed">
                          {d.body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — buy controls */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <BuyControls product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION + FEATURES */}
        <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                ABOUT THIS PACK
              </div>
              <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white mb-4">
                Description
              </h2>
              <p className="text-base text-kapture-smoke dark:text-white/70 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5"
                  >
                    <h3 className="font-semibold text-base text-kapture-black dark:text-white tracking-[-0.01em]">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-kapture-smoke dark:text-white/65 leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* What's included */}
              <div>
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                  WHAT&apos;S INCLUDED
                </div>
                <ul className="space-y-2.5">
                  {product.whatsIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-kapture-smoke dark:text-white/75 leading-relaxed">
                      <Check size={16} strokeWidth={2.5} className="text-kapture-yellow shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs */}
              <div className="rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] overflow-hidden">
                <div className="px-5 py-3 border-b border-kapture-fog dark:border-white/10 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40">
                  SPECIFICATIONS
                </div>
                <dl className="divide-y divide-kapture-fog dark:divide-white/10">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
                      <dt className="text-kapture-smoke dark:text-white/65">{s.label}</dt>
                      <dd className="font-semibold text-kapture-black dark:text-white text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-t border-kapture-fog dark:border-white/5">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <TrustItem icon={<Shield size={18} strokeWidth={2} />} label="Audit-hashed" body="SHA-256 on every submission" />
            <TrustItem icon={<RefreshCw size={18} strokeWidth={2} />} label="Lifetime updates" body="Regulator changes auto-deliver" />
            <TrustItem icon={<Mail size={18} strokeWidth={2} />} label="Instant delivery" body="Magic link to your inbox" />
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
              <div className="mb-6">
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
                  CUSTOMERS ALSO LIKE
                </div>
                <h2 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                  More in {product.subcategory ?? product.industry}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 hover:border-kapture-black dark:hover:border-white/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
                          r.status === "live"
                            ? "bg-kapture-yellow text-kapture-black"
                            : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/15"
                        }`}
                      >
                        {r.status === "live" ? "LIVE" : r.release ?? "SOON"}
                      </span>
                      <ArrowUpRight size={14} strokeWidth={2} className="text-kapture-mist group-hover:text-kapture-black dark:group-hover:text-white transition" />
                    </div>
                    <h3 className="font-semibold text-sm text-kapture-black dark:text-white tracking-[-0.01em] flex-1">
                      {r.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-base text-kapture-black dark:text-white">
                        £{r.options[0]?.pricePence != null ? (r.options[0].pricePence / 100).toFixed(0) : "29"}
                      </span>
                      <span className="text-xs font-medium text-kapture-black dark:text-white">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-kapture-fog dark:border-white/5">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-smoke dark:text-white/40">
            © {new Date().getFullYear()} Kapture · UK
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55">
            <Link href="/store" className="hover:text-kapture-black dark:hover:text-white">Store</Link>
            <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
            <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black shrink-0">
        {icon}
      </span>
      <div>
        <div className="font-semibold text-sm text-kapture-black dark:text-white">{label}</div>
        <div className="text-xs text-kapture-smoke dark:text-white/65">{body}</div>
      </div>
    </div>
  );
}

function slugifyIndustry(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
