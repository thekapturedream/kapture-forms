import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  href?: string;
  showWordmark?: boolean;
}

/**
 * Kapture Forms wordmark — `forms · store` lowercase, dot separator, Space Grotesk.
 * The icon is a document mark (kept consistent with the existing static HTML —
 * the Kapture sun is reserved for nav/footer corners on sister products).
 */
export function Logo({ variant = "light", href = "/", showWordmark = true }: LogoProps) {
  const isDark = variant === "dark";
  return (
    <Link href={href} className="flex items-center gap-3 shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-kapture-yellow"
        aria-label="Kapture Forms"
        role="img"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="9" y1="18" x2="15" y2="18" />
      </svg>
      {showWordmark && (
        <span className="hidden sm:flex items-center gap-2 font-display lowercase tracking-wide text-base">
          <span className="font-semibold">forms</span>
          <span className={isDark ? "text-kapture-mist" : "text-white/40"}>·</span>
          <span className="font-medium text-kapture-yellow">store</span>
        </span>
      )}
    </Link>
  );
}
