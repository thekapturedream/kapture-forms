import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { FormatBadge } from "@components/FormatBadge";
import { createSupabaseServerClient } from "@lib/supabase/server";
import { getProduct, type ExportFormat } from "@lib/products";
import { isAdmin } from "@lib/admin";

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

const FORMAT_DETAILS: Array<{
  format: ExportFormat;
  endpoint: string;
  filename: string;
  blurb: string;
  howTo: string;
}> = [
  {
    format: "pdf",
    endpoint: "pdf",
    filename: ".pdf",
    blurb: "Print-ready A4 with audit footer + signature block.",
    howTo: "/how-to/pdf",
  },
  {
    format: "docx",
    endpoint: "docx",
    filename: ".docx",
    blurb: "Editable Word — drop into your house style.",
    howTo: "/how-to/docx",
  },
  {
    format: "html",
    endpoint: "html",
    filename: ".html",
    blurb: "Self-contained embeddable form for your site.",
    howTo: "/how-to/html",
  },
  {
    format: "csv",
    endpoint: "csv",
    filename: ".csv",
    blurb: "Field schema CSV — Bamboo, Breathe, Workday import-ready.",
    howTo: "/how-to/csv",
  },
  {
    format: "gforms",
    endpoint: "gforms",
    filename: ".json",
    blurb: "Apps Script + JSON spec to recreate as a Google Form.",
    howTo: "/how-to/google-forms",
  },
];

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  const { data: customer } = await supabase
    .from("customers")
    .select("id, email")
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
            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin(user!.email) && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-3.5 py-1.5 rounded-full text-sm font-semibold transition"
                >
                  Admin →
                </Link>
              )}
              <Link href="/how-to" className="btn-secondary text-sm">
                How-to guides
              </Link>
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
                Once you check out, your downloads + hosted URL land here. The first live
                pack is staff onboarding for UK care providers.
              </p>
              <Link
                href="/products/staff-onboarding-uk-care"
                className="btn-yellow text-sm justify-center"
              >
                Open the live product →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {list.map((lic) => {
                const product = getProduct(lic.product_id);
                if (!product) return null;
                return (
                  <article
                    key={lic.id}
                    className="bg-white border border-kapture-fog rounded-2xl overflow-hidden"
                  >
                    {/* HEADER */}
                    <header className="bg-kapture-black text-white px-6 py-5 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow mb-1">
                          {lic.mode === "subscription" ? "HOSTED · MONTHLY" : "DOWNLOAD · LIFETIME"}
                          {" · "}LICENSE {lic.slug.slice(0, 12)}
                        </div>
                        <h2 className="font-display font-semibold text-xl">{product.shortTitle}</h2>
                      </div>
                      <span
                        className={`chip ${
                          lic.status === "active" ? "chip-ok" : ""
                        }`}
                      >
                        {lic.status.toUpperCase()}
                      </span>
                    </header>

                    {/* HOSTED RUNNER */}
                    {lic.mode === "subscription" && (
                      <div className="border-b border-kapture-fog px-6 py-5 bg-kapture-paper flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-1">
                            HOSTED FORM
                          </div>
                          <p className="text-sm text-kapture-smoke">
                            Branded URL with magic-link invites + queue + audit hash on every
                            submission.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/run/${lic.slug}`}
                            className="btn-yellow text-xs"
                          >
                            Open form →
                          </Link>
                          <Link
                            href={`/dashboard/customize/${lic.slug}`}
                            className="btn-secondary text-xs"
                          >
                            Customise
                          </Link>
                          <Link href="/how-to/hosted" className="btn-secondary text-xs">
                            How-to
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* DOWNLOADS GRID */}
                    <div className="p-6">
                      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-4">
                        DOWNLOAD IN ANY FORMAT
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {FORMAT_DETAILS.filter((d) => product.exports.includes(d.format)).map(
                          (d) => (
                            <div
                              key={d.format}
                              className="border border-kapture-fog rounded-xl p-4 bg-white flex flex-col"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <FormatBadge format={d.format} />
                                <span className="font-mono text-xs text-kapture-mist">
                                  {d.filename}
                                </span>
                              </div>
                              <p className="text-xs text-kapture-smoke leading-relaxed mb-3 flex-1">
                                {d.blurb}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                <a
                                  href={`/api/export/${lic.slug}/${d.endpoint}`}
                                  className="btn-primary text-xs flex-1 justify-center"
                                  download
                                >
                                  Download
                                </a>
                                <Link
                                  href={d.howTo}
                                  className="btn-secondary text-xs justify-center"
                                >
                                  How-to
                                </Link>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Submissions CSV (subs only) */}
                      {lic.mode === "subscription" && (
                        <div className="mt-4 pt-4 border-t border-kapture-fog flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-1">
                              SUBMISSIONS · CSV
                            </div>
                            <p className="text-xs text-kapture-smoke">
                              Every hosted submission as a row. Audit hash + timestamp included.
                            </p>
                          </div>
                          <a
                            href={`/api/export/${lic.slug}/csv?kind=submissions`}
                            className="btn-secondary text-xs"
                            download
                          >
                            Download submissions CSV
                          </a>
                        </div>
                      )}
                    </div>

                    {/* META */}
                    <footer className="border-t border-kapture-fog bg-kapture-paper px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
                        Active from {new Date(lic.active_from).toLocaleDateString("en-GB")}
                        {lic.active_until && (
                          <>
                            {" · "}until {new Date(lic.active_until).toLocaleDateString("en-GB")}
                          </>
                        )}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs text-kapture-black hover:underline font-medium"
                      >
                        View product page →
                      </Link>
                    </footer>
                  </article>
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
