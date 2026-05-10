import Link from "next/link";
import { KaptureSun } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-kapture-black text-white border-t border-white/5">
      <div className="container-c py-14 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <KaptureSun size={22} />
            <span className="font-display tracking-[-0.01em]">
              <span className="font-semibold">Kapture</span>
              <span className="font-medium ml-1.5 text-kapture-yellow">Forms</span>
            </span>
          </Link>
          <p className="text-xs text-white/55 leading-relaxed max-w-[14rem]">
            Pre-built compliance forms for every industry. Pay once. Run hosted. Audit-hashed
            on every submission.
          </p>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-white/40 mb-3">
            Product
          </div>
          <Link
            href="/products/staff-onboarding-uk-care"
            className="block text-sm text-white/65 hover:text-white mb-1.5"
          >
            Staff onboarding
          </Link>
          <Link href="/#pricing" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Pricing
          </Link>
          <Link href="/dashboard" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Dashboard
          </Link>
          <Link href="/auth/login" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Sign in
          </Link>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-white/40 mb-3">
            Resources
          </div>
          <Link href="/how-to" className="block text-sm text-white/65 hover:text-white mb-1.5">
            How-to guides
          </Link>
          <Link href="/how-to/audit-hash" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Audit hash
          </Link>
          <Link href="/how-to/regulators" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Regulator mapping
          </Link>
          <Link href="/#partner" className="block text-sm text-white/65 hover:text-white mb-1.5">
            Become a publisher
          </Link>
        </div>
        <div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-white/40 mb-3">
            Kapture
          </div>
          <Link
            href="https://kooper-care.vercel.app/kooper-care-landing.html"
            className="block text-sm text-white/65 hover:text-white mb-1.5"
          >
            kooper · care
          </Link>
          <Link
            href="https://thekapture.com"
            className="block text-sm text-white/65 hover:text-white mb-1.5"
          >
            thekapture.com
          </Link>
          <a
            href="mailto:forms@thekapture.com"
            className="block text-sm text-white/65 hover:text-white mb-1.5"
          >
            forms@thekapture.com
          </a>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-c py-5 flex items-center justify-between gap-3 flex-wrap text-xs text-white/40 font-mono">
          <span>© {new Date().getFullYear()} Kapture · All rights reserved</span>
          <span>v0.1 · early access</span>
        </div>
      </div>
    </footer>
  );
}
