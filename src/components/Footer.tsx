import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-kapture-black text-white py-12">
      <div className="container-c grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-kapture-yellow"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="font-display font-semibold lowercase tracking-wide text-base">
              forms · store
            </span>
          </Link>
          <p className="text-xs text-white/55 leading-relaxed">
            By Kapture. The forms store for every industry, every workflow. Pre-built.
            Audit-hashed. Exportable. White-label ready.
          </p>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow mb-3">
            FORMS
          </div>
          <Link href="/#industries" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Industries
          </Link>
          <Link href="/#featured" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Featured products
          </Link>
          <Link href="/#exports" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Export formats
          </Link>
          <Link href="/#pricing" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Pricing
          </Link>
          <Link href="/#partner" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Become a publisher
          </Link>
          <Link href="/how-to" className="block text-sm text-white/55 hover:text-white mb-1.5">
            How-to guides
          </Link>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow mb-3">
            KAPTURE
          </div>
          <Link
            href="https://kooper-care.vercel.app/kooper-care-landing.html"
            className="block text-sm text-white/55 hover:text-white mb-1.5"
          >
            kooper · care
          </Link>
          <Link
            href="/products/staff-onboarding-uk-care"
            className="block text-sm text-white/55 hover:text-white mb-1.5"
          >
            kooper · onboarding
          </Link>
          <Link href="/auth/login" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Sign in
          </Link>
          <Link href="/dashboard" className="block text-sm text-white/55 hover:text-white mb-1.5">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="container-c mt-8 pt-6 border-t border-kapture-ash text-xs text-white/40 font-mono flex flex-wrap items-center justify-between gap-3">
        <span>Forms · v0.1 early access · By Kapture</span>
        <span>· Curated marketplace · Editorial review on submit · 70/30 publisher share</span>
      </div>
    </footer>
  );
}
