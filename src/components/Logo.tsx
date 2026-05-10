import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  href?: string;
  showWordmark?: boolean;
  size?: number;
}

/**
 * Kapture sun + Kapture Forms wordmark.
 *
 * The sun is the locked Kapture brand mark — 8-dot mandala with the
 * top-right intercardinal in #FFD400. Same mark used by kapture-care,
 * kapture-logistics, kurongeka.
 */
export function Logo({
  variant = "light",
  href = "/",
  showWordmark = true,
  size = 28,
}: LogoProps) {
  const isDark = variant === "dark";
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0">
      <KaptureSun size={size} />
      {showWordmark && (
        <span
          className={`font-display tracking-[-0.01em] ${
            isDark ? "text-kapture-black" : "text-white"
          }`}
        >
          <span className="font-semibold text-[1.0625rem]">Kapture</span>
          <span className="font-medium text-[1.0625rem] ml-1.5 text-kapture-yellow">
            Forms
          </span>
        </span>
      )}
    </Link>
  );
}

/**
 * The Kapture sun mark — 8-dot mandala with the top-right intercardinal
 * (NE) dot rendered in #FFD400. All other dots inherit text colour.
 */
export function KaptureSun({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-label="Kapture"
      role="img"
    >
      {/* N */}
      <circle cx="16" cy="3.5" r="2.2" fill="currentColor" />
      {/* NE — yellow accent */}
      <circle cx="25.5" cy="6.5" r="2.2" fill="#FFD400" />
      {/* E */}
      <circle cx="28.5" cy="16" r="2.2" fill="currentColor" />
      {/* SE */}
      <circle cx="25.5" cy="25.5" r="2.2" fill="currentColor" />
      {/* S */}
      <circle cx="16" cy="28.5" r="2.2" fill="currentColor" />
      {/* SW */}
      <circle cx="6.5" cy="25.5" r="2.2" fill="currentColor" />
      {/* W */}
      <circle cx="3.5" cy="16" r="2.2" fill="currentColor" />
      {/* NW */}
      <circle cx="6.5" cy="6.5" r="2.2" fill="currentColor" />
    </svg>
  );
}
