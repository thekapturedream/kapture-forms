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
 * The sun is the official Kapture brand mark — central disc + 8-dot
 * mandala with the NE intercardinal in #FFCC00 (the brand-locked yellow).
 * `currentColor` flows through the body of the mark, so pass any text
 * colour via Tailwind class.
 */
export function Logo({
  variant = "light",
  href = "/",
  showWordmark = true,
  size = 28,
}: LogoProps) {
  const isDark = variant === "dark";
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0 group">
      <KaptureSun size={size} />
      {showWordmark && (
        <span
          className={`font-display tracking-[-0.01em] ${
            isDark ? "text-kapture-black" : "text-kapture-black"
          }`}
        >
          <span className="font-semibold text-[1.0625rem]">Kapture</span>
          <span className="font-medium text-[1.0625rem] ml-1.5 text-kapture-smoke">
            Forms
          </span>
        </span>
      )}
    </Link>
  );
}

/**
 * The Kapture sun. Inherits text colour for the body; the NE accent dot
 * is brand-locked at #FFCC00.
 */
export function KaptureSun({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fillRule="evenodd"
      clipRule="evenodd"
      aria-label="Kapture"
      role="img"
      className={className}
    >
      <path
        d="M255.75 133.125c67.679 0 122.625 54.946 122.625 122.625S323.429 378.375 255.75 378.375 133.125 323.429 133.125 255.75s54.946-122.625 122.625-122.625m0-132.75c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121S236.918.375 255.75.375M75.173 75.173c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M511.125 255.75c0 18.832-15.289 34.121-34.121 34.121s-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121M255.75 442.883c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121m132.323-54.81c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M68.617 255.75c0 18.832-15.289 34.121-34.121 34.121S.375 274.582.375 255.75s15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121m54.81 132.323c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"
        fill="currentColor"
      />
      <path
        d="M436.327 75.173c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"
        fill="#FFCC00"
      />
    </svg>
  );
}
