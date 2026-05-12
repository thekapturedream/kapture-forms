import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: number;
}

/**
 * Kapture · forms wordmark. Theme-aware via Tailwind's `dark:` modifier —
 * renders dark text on light surface, white text on dark surface.
 */
export function Logo({ href = "/", size = 26 }: LogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0" aria-label="Kapture Forms">
      <span className="text-kapture-black dark:text-white">
        <KaptureSun size={size} />
      </span>
      <span className="lowercase tracking-[-0.005em] text-[15px] sm:text-base">
        <span className="font-semibold text-kapture-black dark:text-white">kapture</span>
        <span className="mx-1.5 text-kapture-mist dark:text-white/40">·</span>
        <span className="font-medium text-kapture-smoke dark:text-white/65">forms</span>
      </span>
    </Link>
  );
}

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
