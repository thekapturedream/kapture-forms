import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@components/ProductPage";
import { getStoreProduct } from "@lib/store-product";

export const metadata: Metadata = {
  title: "Designer Pass · unlimited downloads",
  description:
    "Designer Pass — unlimited form pack downloads, source files, white-label rights. £49/mo · cancel anytime.",
  alternates: { canonical: "/designer-pass" },
};

export default function DesignerPassPage() {
  const product = getStoreProduct("designer-pass");
  if (!product) notFound();
  return <ProductPageContent product={product} />;
}
