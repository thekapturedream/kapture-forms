import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@lib/supabase/server";
import { CustomizerClient } from "./CustomizerClient";
import { DEFAULT_CUSTOMIZATION, type Customization } from "@lib/customization";

export const metadata = { title: "Customise your form" };
export const dynamic = "force-dynamic";

export default async function CustomizePage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?next=/dashboard/customize/${params.slug}`);

  const admin = createSupabaseAdminClient();
  const { data: license } = await admin
    .from("licenses")
    .select("id, slug, product_id, customer_id, customization")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!license) redirect("/dashboard");

  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!customer || customer.id !== license.customer_id) redirect("/dashboard");

  const initial: Customization = {
    ...DEFAULT_CUSTOMIZATION,
    ...(license.customization as Customization),
  };

  return (
    <CustomizerClient
      slug={license.slug}
      productId={license.product_id}
      initial={initial}
    />
  );
}
