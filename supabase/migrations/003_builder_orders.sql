-- ============================================================
-- Kapture Forms · builder orders
-- ============================================================
-- One row per paid "generate-and-send" request from /builder.
-- Workflow:
--   1. Builder POSTs schema + email + format to /api/builder/checkout.
--      The row is inserted with status='pending' and a Stripe Checkout
--      session is created with metadata.type='builder' + the row id.
--   2. Stripe checkout.session.completed → webhook loads this row by
--      id, renders the requested format from the schema, emails it to
--      the customer via Resend, and stamps fulfilled_at + status='fulfilled'.
--   3. If rendering or email fails, status='failed' and `error` is set.
-- ============================================================

create table if not exists public.builder_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  format text not null check (format in ('pdf', 'docx', 'html', 'csv', 'gforms')),
  title text,
  schema jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'failed')),
  stripe_session_id text,
  fulfilled_at timestamptz,
  error text
);

create index if not exists builder_orders_status_idx on public.builder_orders (status);
create index if not exists builder_orders_session_idx on public.builder_orders (stripe_session_id);

alter table public.builder_orders enable row level security;

-- No anon / authenticated user access. The webhook uses the service-role
-- client to read and update rows. Customers receive their file by email,
-- so they don't need direct DB access to the schema they submitted.
