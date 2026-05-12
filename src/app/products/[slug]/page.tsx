import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductPageContent } from "@components/ProductPage";
import { getStoreProduct, getAllProductSlugs } from "@lib/store-product";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  // Pre-generate static pages for every form, bundle, and the pass.
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getStoreProduct(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.hook,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.title} · Kapture Forms`,
      description: product.hook,
    },
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getStoreProduct(params.slug);
  if (!product) notFound();
  return <ProductPageContent product={product} />;
}
