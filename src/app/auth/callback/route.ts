import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@lib/supabase/server";

/**
 * GET /auth/callback?code=...&next=/dashboard
 *
 * Exchanges the magic-link code for a session, links the resulting
 * auth user to any pre-existing `customers` row (created by the
 * Stripe webhook before the buyer authenticated), then redirects
 * to `next`.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_code", url));
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error?.message ?? "exchange_failed")}`, url)
    );
  }

  // Link the auth user to any pre-existing customer row (the webhook
  // creates one with user_id=null when payment lands before sign-in).
  const userId = data.session.user.id;
  const email = data.session.user.email;
  if (email) {
    const admin = createSupabaseAdminClient();
    const { data: customer } = await admin
      .from("customers")
      .select("id, user_id")
      .eq("email", email)
      .maybeSingle();
    if (customer && !customer.user_id) {
      await admin.from("customers").update({ user_id: userId }).eq("id", customer.id);
    } else if (!customer) {
      await admin.from("customers").insert({ user_id: userId, email });
    }
  }

  return NextResponse.redirect(new URL(next, url));
}
