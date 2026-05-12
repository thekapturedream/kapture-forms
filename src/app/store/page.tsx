import type { Metadata } from "next";
import { StoreClient } from "./StoreClient";
import { SEARCH_CATALOG } from "@lib/search-catalog";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { CartButton } from "@components/cart/CartButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Store · all packs",
  description: "Browse every Kapture Forms pack. Filter by industry, format, status.",
};

export default function StorePage({ searchParams }: { searchParams: { industry?: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
        <div className="kap-shell h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-kapture-smoke dark:text-white/55">
              <span className="text-kapture-fog dark:text-white/20">/</span>
              <span className="text-kapture-black dark:text-white">Store</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Home</Link>
            <Link href="/#bundles" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Bundles</Link>
            <Link href="/#designer" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Designers</Link>
            <Link href="/how-to" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">How-to</Link>
            <Link href="/dashboard" className="px-3 py-1.5 text-kapture-smoke dark:text-white/70 hover:text-kapture-black dark:hover:text-white rounded-md font-medium">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-1">
            <CartButton size={34} />
            <ThemeToggle size={34} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <StoreClient
          initialIndustry={searchParams.industry ?? null}
          allEntries={SEARCH_CATALOG}
        />
      </main>

      <footer className="border-t border-kapture-fog dark:border-white/5">
        <div className="kap-shell py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono uppercase tracking-widest text-[0.625rem] text-kapture-smoke dark:text-white/40">
            © {new Date().getFullYear()} Kapture · UK
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-white/55">
            <Link href="/" className="hover:text-kapture-black dark:hover:text-white">Home</Link>
            <Link href="/how-to" className="hover:text-kapture-black dark:hover:text-white">How-to</Link>
            <a href="mailto:forms@thekapture.com" className="hover:text-kapture-black dark:hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
