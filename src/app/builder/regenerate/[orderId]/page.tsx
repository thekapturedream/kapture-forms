import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { RegenerateClient } from "./RegenerateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regenerate in another format",
  description:
    "Get the same form in a different Kapture format — PDF, DOCX, HTML, CSV, or Google Forms — for £2. Or get all 5 for £8.",
};

interface PageProps {
  params: { orderId: string };
}

/**
 * Public regenerate page. Anyone with the link can request another format
 * for the same schema; price tag keeps abuse self-limiting.
 *
 * Server component loads the order with the service-role client (RLS is
 * on, so the anon client can't reach it). We surface only the fields the
 * client needs — title, primary format already delivered — not the full
 * schema, so the page stays small.
 */
export default async function RegeneratePage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("builder_orders")
    .select("id, title, format, status, email")
    .eq("id", params.orderId)
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <RegenerateClient
      orderId={data.id}
      title={data.title ?? "Your Kapture form"}
      originalFormat={data.format}
      maskedEmail={maskEmail(data.email)}
      status={data.status}
    />
  );
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return "your email";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const head = user.slice(0, Math.max(1, Math.min(2, user.length)));
  return `${head}${"•".repeat(Math.max(2, user.length - 2))}@${domain}`;
}
