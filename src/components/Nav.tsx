import Link from "next/link";
import { Logo } from "./Logo";

interface NavProps {
  /** Render compact nav (used inside product pages, runner, dashboard). */
  variant?: "marketing" | "compact";
}

export function Nav({ variant = "marketing" }: NavProps) {
  return (
    <nav className="bg-kapture-black text-white sticky top-0 z-50">
      <div className="container-c">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />
          {variant === "marketing" && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/#industries" className="nav-link">
                Industries
              </Link>
              <Link href="/#featured" className="nav-link">
                Featured
              </Link>
              <Link href="/#exports" className="nav-link">
                Exports
              </Link>
              <Link href="/how-to" className="nav-link">
                How-to
              </Link>
              <Link href="/#pricing" className="nav-link">
                Pricing
              </Link>
              <Link href="/#partner" className="nav-link">
                Become a publisher
              </Link>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </div>
          )}
          {variant === "compact" && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="nav-link">
                Marketplace
              </Link>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Link
              href="/products/staff-onboarding-uk-care"
              className="hidden md:inline-flex btn-ghost-light text-sm"
            >
              Live demo
            </Link>
            <Link href="/auth/login" className="btn-yellow text-sm">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
