import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@lib/supabase/server";
import { isAdmin } from "@lib/admin";

export const metadata = { title: "Admin · Kapture Forms" };
export const dynamic = "force-dynamic";

/**
 * Admin dashboard. Gated to emails in src/lib/admin.ts (allowlist).
 *
 * Shows: every customer, every order, every license, latest submissions.
 * Uses the service-role client to bypass RLS — only because the route
 * itself has verified the signed-in user is on the allowlist.
 */
export default async function AdminPage() {
  // Step 1 — must be signed in.
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/admin");

  // Step 2 — must be on the allowlist.
  if (!isAdmin(user.email)) {
    return <ForbiddenView email={user.email ?? null} />;
  }

  // Step 3 — service-role queries (bypass RLS).
  const admin = createSupabaseAdminClient();
  const [{ data: customers }, { data: orders }, { data: licenses }, { data: submissions }] =
    await Promise.all([
      admin.from("customers").select("id, email, created_at").order("created_at", { ascending: false }),
      admin
        .from("orders")
        .select("id, product_id, mode, status, amount_pence, currency, customer_email, paid_at, created_at")
        .order("created_at", { ascending: false }),
      admin
        .from("licenses")
        .select("id, slug, product_id, mode, status, active_until, created_at")
        .order("created_at", { ascending: false }),
      admin
        .from("submissions")
        .select("id, license_id, product_id, pathway_id, audit_hash, submitted_at, status")
        .order("submitted_at", { ascending: false })
        .limit(50),
    ]);

  return (
    <div className="min-h-screen bg-white text-kapture-black dark:bg-kapture-black dark:text-white">
      <header className="sticky top-0 z-40 border-b border-kapture-fog dark:border-white/5 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md">
        <div className="kap-shell h-14 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-kapture-mist dark:text-white/40">
            Kapture Forms · Admin
          </div>
          <div className="text-xs">
            <span className="text-kapture-smoke dark:text-white/55">signed in as </span>
            <span className="font-semibold">{user.email}</span>
            <span className="mx-2 text-kapture-mist">·</span>
            <Link href="/" className="hover:underline">
              ← home
            </Link>
          </div>
        </div>
      </header>

      <main className="kap-shell py-8 space-y-10">
        <StatRow
          stats={[
            { label: "CUSTOMERS", value: String(customers?.length ?? 0) },
            { label: "ORDERS", value: String(orders?.length ?? 0) },
            { label: "LICENSES", value: String(licenses?.length ?? 0) },
            { label: "SUBMISSIONS (50 most recent)", value: String(submissions?.length ?? 0) },
          ]}
        />

        <Table
          title="Customers"
          rows={customers ?? []}
          cols={[
            { key: "id", label: "ID", trunc: 8 },
            { key: "email", label: "Email" },
            { key: "created_at", label: "Created", date: true },
          ]}
        />

        <Table
          title="Orders"
          rows={orders ?? []}
          cols={[
            { key: "id", label: "ID", trunc: 8 },
            { key: "product_id", label: "Product" },
            { key: "mode", label: "Mode" },
            { key: "status", label: "Status" },
            { key: "amount_pence", label: "Amount", money: true },
            { key: "customer_email", label: "Email" },
            { key: "paid_at", label: "Paid", date: true },
          ]}
        />

        <Table
          title="Licenses"
          rows={licenses ?? []}
          cols={[
            { key: "slug", label: "Slug" },
            { key: "product_id", label: "Product" },
            { key: "mode", label: "Mode" },
            { key: "status", label: "Status" },
            { key: "active_until", label: "Active until", date: true },
            { key: "created_at", label: "Created", date: true },
          ]}
        />

        <Table
          title="Submissions"
          rows={submissions ?? []}
          cols={[
            { key: "id", label: "ID", trunc: 8 },
            { key: "license_id", label: "License", trunc: 8 },
            { key: "product_id", label: "Product" },
            { key: "pathway_id", label: "Pathway" },
            { key: "audit_hash", label: "Hash", trunc: 12 },
            { key: "submitted_at", label: "Submitted", date: true },
            { key: "status", label: "Status" },
          ]}
        />
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function StatRow({ stats }: { stats: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-4"
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40">
            {s.label}
          </div>
          <div className="mt-1 font-bold text-2xl tracking-[-0.02em] text-kapture-black dark:text-white">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

interface Col {
  key: string;
  label: string;
  date?: boolean;
  money?: boolean;
  trunc?: number;
}

function Table({ title, rows, cols }: { title: string; rows: Array<Record<string, unknown>>; cols: Col[] }) {
  return (
    <section>
      <h2 className="font-bold text-lg tracking-[-0.01em] mb-3">{title}</h2>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-kapture-fog dark:border-white/10 p-8 text-center text-sm text-kapture-mist dark:text-white/40">
          No rows yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-kapture-fog dark:border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-kapture-paper dark:bg-white/[0.02] text-kapture-smoke dark:text-white/55">
              <tr>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className="text-left px-4 py-2 font-mono text-[0.625rem] uppercase tracking-widest"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-kapture-fog dark:divide-white/5">
              {rows.map((row, i) => (
                <tr key={i}>
                  {cols.map((c) => (
                    <td key={c.key} className="px-4 py-2 align-top font-mono text-xs">
                      {format(row[c.key], c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function format(value: unknown, col: Col): string {
  if (value == null || value === "") return "—";
  if (col.money && typeof value === "number") {
    return `£${(value / 100).toFixed(2)}`;
  }
  if (col.date) {
    const d = new Date(String(value));
    if (!isNaN(d.getTime())) return d.toLocaleString("en-GB");
  }
  const s = String(value);
  if (col.trunc && s.length > col.trunc) return s.slice(0, col.trunc) + "…";
  return s;
}

function ForbiddenView({ email }: { email: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-white text-kapture-black dark:bg-kapture-black dark:text-white">
      <div className="max-w-md text-center">
        <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40 mb-3">
          403 · FORBIDDEN
        </div>
        <h1 className="font-bold text-2xl tracking-[-0.02em] mb-3">Admin access required.</h1>
        <p className="text-sm text-kapture-smoke dark:text-white/65 mb-6">
          Signed in as <span className="font-semibold">{email ?? "(unknown)"}</span>. This
          email is not on the admin allowlist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 px-4 py-2 rounded-full font-semibold text-sm transition"
        >
          ← home
        </Link>
      </div>
    </div>
  );
}
