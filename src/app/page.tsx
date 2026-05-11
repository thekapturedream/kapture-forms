import Link from "next/link";
import { KaptureSun } from "@components/Logo";
import { SearchHero } from "@components/SearchHero";

/**
 * Google-style landing.
 * White canvas. Big centred sun. Wordmark. Search. Two buttons. Footer.
 * Nothing else above the fold.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* TOP BAR — Google-clone, right-aligned utility links */}
      <header className="px-6 sm:px-8 lg:px-10 pt-4 pb-2">
        <div className="flex items-center justify-end gap-4 text-sm">
          <Link
            href="/how-to"
            className="text-kapture-smoke hover:text-kapture-black hover:underline underline-offset-2"
          >
            How-to
          </Link>
          <Link
            href="/dashboard"
            className="text-kapture-smoke hover:text-kapture-black hover:underline underline-offset-2"
          >
            Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="text-kapture-smoke hover:text-kapture-black hover:underline underline-offset-2"
          >
            Sign in
          </Link>
          <Link
            href="/products/staff-onboarding-uk-care#buy"
            className="bg-kapture-black text-white px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-kapture-coal transition"
          >
            Buy
          </Link>
        </div>
      </header>

      {/* HERO — vertically centred Google-style */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 -mt-10">
        <div className="w-full max-w-[640px] mx-auto text-center">
          {/* Mark + Wordmark */}
          <div className="flex flex-col items-center mb-9">
            <div className="text-kapture-black">
              <KaptureSun size={88} />
            </div>
            <h1 className="mt-5 font-display tracking-[-0.02em]">
              <span className="font-semibold text-[2rem] sm:text-[2.5rem] text-kapture-black">
                Kapture
              </span>
              <span className="font-medium text-[2rem] sm:text-[2.5rem] ml-2 text-kapture-smoke">
                Forms
              </span>
            </h1>
          </div>
          <SearchHero />
          <p className="mt-12 text-xs text-kapture-mist font-mono uppercase tracking-widest">
            Pre-built · audit-hashed · five formats · UK first
          </p>
        </div>
      </main>

      {/* FOOTER — Google-clone two-row */}
      <footer className="border-t border-kapture-fog text-sm text-kapture-smoke">
        <div className="px-6 sm:px-8 lg:px-10 py-3 border-b border-kapture-fog">
          <span className="text-xs font-mono uppercase tracking-widest text-kapture-mist">
            United Kingdom
          </span>
        </div>
        <div className="px-6 sm:px-8 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/how-to" className="hover:text-kapture-black hover:underline underline-offset-2">
              How-to
            </Link>
            <Link
              href="/products/staff-onboarding-uk-care"
              className="hover:text-kapture-black hover:underline underline-offset-2"
            >
              Live pack
            </Link>
            <Link
              href="/how-to/audit-hash"
              className="hover:text-kapture-black hover:underline underline-offset-2"
            >
              Audit hash
            </Link>
            <Link
              href="mailto:forms@thekapture.com?subject=Publisher%20application"
              className="hover:text-kapture-black hover:underline underline-offset-2"
            >
              Publishers
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="mailto:forms@thekapture.com"
              className="hover:text-kapture-black hover:underline underline-offset-2"
            >
              Contact
            </a>
            <Link href="/how-to/regulators" className="hover:text-kapture-black hover:underline underline-offset-2">
              Regulators
            </Link>
            <Link
              href="https://thekapture.com"
              className="hover:text-kapture-black hover:underline underline-offset-2"
            >
              thekapture.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
