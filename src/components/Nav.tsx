import Link from "next/link";
import { Logo } from "./Logo";

interface NavProps {
  variant?: "marketing" | "compact";
}

export function Nav({ variant = "marketing" }: NavProps) {
  return (
    <nav className="bg-kapture-black text-white sticky top-0 z-50 border-b border-white/5">
      <div className="container-c">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />
          {variant === "marketing" && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/products/staff-onboarding-uk-care" className="nav-link">
                Live pack
              </Link>
              <Link href="/how-to" className="nav-link">
                How-to
              </Link>
              <Link
                href="mailto:forms@thekapture.com?subject=Publisher%20application"
                className="nav-link"
              >
                Publishers
              </Link>
            </div>
          )}
          {variant === "compact" && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/how-to" className="nav-link">
                How-to
              </Link>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden md:inline-flex btn-ghost-light text-sm">
              Sign in
            </Link>
            <Link href="/products/staff-onboarding-uk-care#buy" className="btn-yellow text-sm">
              Buy
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
