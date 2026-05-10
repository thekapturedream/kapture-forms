import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { createSupabaseServerClient } from "@lib/supabase/server";
import { getProduct, type ExportFormat } from "@lib/products";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

interface LicenseRow {
  id: string;
  product_id: string;
  mode: "oneoff" | "subscription";
  status: string;
  slug: string;
  hosted_url: string | null;
  active_from: string;
  active_until: string | null;
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id, email, display_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: licenses } = await supabase
    .from("licenses")
    .select("id, product_id, mode, status, slug, hosted_url, active_from, active_until")
    .eq("customer_id", customer?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  const list = (licenses ?? []) as LicenseRow[];

  return (
    <>
      <Nav variant="compact" />
      <section className="bg-kapture-paper py-12 min-h-[60vh]">
        <div className="container-c">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <span className="ed-kicker">DASHBOARD</span>
              <h1 className="h-section text-kapture-black">Your form packs.</h1>
              <p className="font-serif text-base text-kapture-smoke leading-relaxed mt-2">
                Signed in as{" "}
                <span className="font-mono text-sm text-kapture-black">{user!.email}</span>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="btn-secondary text-sm">
                Browse marketplace
              </Link>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="bg-white border border-kapture-fog rounded-2xl p-10 text-center max-w-2xl">
              <span className="ed-kicker">NOTHING HERE YET</span>
              <h2 className="font-display font-semibold text-xl mb-2">
                You haven&apos;t bought a pack yet.
              </h2>
              <p className="text-sm text-kapture-smoke leading-relaxed mb-5">
                Once you check out, your download links and hosted URLs land here. The first
                live pack is staff onboarding for UK care providers.
              </p>
              <Link
                href="/products/staff-onboarding-uk-care"
                className="btn-yellow text-sm justify-center"
              >
                Open the live product →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((lic) => {
                const product = getProduct(lic.product_id);
                if (!product) return null;
                return (
                  <div
                    key={lic.id}
                    className="bg-white border border-kapture-fog rounded-2xl p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
                        {lic.mode === "subscription" ? "HOSTED · MONTHLY" : "DOWNLOAD · LIFETIME"}
                      </span>
                      <span
                        className={`chip ${
                          lic.status === "active"
                            ? "chip-ok"
                            : lic.status === "cancelled"
                              ? ""
                              : ""
                        }`}
                      >
                        {lic.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1">
                      {product.shortTitle}
                    </h3>
                    <p className="text-xs text-kapture-smoke leading-relaxed mb-3">
                      {product.meta}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.exports.map((f: ExportFormat) => (
                        <FormatBadge key={f} format={f} />
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-kapture-fog flex flex-wrap gap-2">
                      {lic.mode === "subscription" && lic.hosted_url && (
                        <Link href={`/run/${lic.slug}`} className="btn-yellow text-xs flex-1 justify-center">
                          Open hosted form →
                        </Link>
                      )}
                      <Link
                        href={`/api/export/${lic.slug}/pdf`}
                        className="btn-secondary text-xs flex-1 justify-center"
                      >
                        Download PDF
                      </Link>
                    </div>
                    {lic.active_until && (
                      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mt-2">
                        Active until · {new Date(lic.active_until).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
