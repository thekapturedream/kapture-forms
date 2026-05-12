import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@components/ProductPage";
import { getStoreProduct } from "@lib/store-product";

/**
 * Static product page for the first live pack. Same renderer as the
 * dynamic /products/[slug] route so the layout stays in sync.
 */

export const metadata: Metadata = {
  title: "Staff onboarding · UK care providers",
  description:
    "Pre-built staff onboarding pack for UK care providers. Four pathways. Five export formats. CQC SAF aligned. £29 download or £29/mo hosted.",
  alternates: { canonical: "/products/staff-onboarding-uk-care" },
};

export default function StaffOnboardingPage() {
  const product = getStoreProduct("staff-onboarding-uk-care");
  if (!product) notFound();
  return <ProductPageContent product={product} />;
}
