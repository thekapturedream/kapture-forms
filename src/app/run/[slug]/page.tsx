import { notFound } from "next/navigation";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getProduct } from "@lib/products";
import { OnboardingForm } from "./OnboardingForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export default async function RunFormPage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: license } = await supabase
    .from("licenses")
    .select("id, product_id, slug, status, mode, customer_id, active_until")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!license) notFound();

  const product = getProduct(license.product_id);
  if (!product) notFound();

  const isExpired =
    license.status !== "active" ||
    (license.active_until && new Date(license.active_until) < new Date());

  return (
    <>
      <Nav variant="compact" />
      <section className="bg-kapture-paper py-10 min-h-[80vh]">
        <div className="container-c max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <span className="ed-kicker">HOSTED FORM</span>
              <h1 className="font-display font-semibold text-2xl mb-1">{product.title}</h1>
              <p className="text-sm text-kapture-smoke">
                License{" "}
                <span className="font-mono text-xs">{license.slug.slice(0, 12)}…</span>
              </p>
            </div>
            <span className={`chip ${license.status === "active" ? "chip-ok" : ""}`}>
              {license.status.toUpperCase()}
            </span>
          </div>

          {isExpired ? (
            <div className="bg-white border border-kapture-fog rounded-2xl p-8 text-center">
              <span className="ed-kicker">LICENSE EXPIRED</span>
              <h2 className="font-display font-semibold text-xl mb-2">
                This hosted licence is no longer active.
              </h2>
              <p className="text-sm text-kapture-smoke">
                Re-activate from the dashboard to continue capturing submissions.
              </p>
            </div>
          ) : (
            <OnboardingForm slug={license.slug} pathways={product.pathways} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
