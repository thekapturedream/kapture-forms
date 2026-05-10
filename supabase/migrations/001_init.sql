-- ============================================================
-- Kapture Forms · initial schema
-- ============================================================
-- Tables:
--   products       — catalog mirror of src/lib/products.ts
--   customers      — Stripe customer ↔ Supabase auth user
--   orders         — every Stripe Checkout result
--   licenses       — granted access (download or hosted)
--   submissions    — hosted form submissions (audit-hashed)
--   submission_events — append-only audit log
-- All tables: row-level security on. No anon access except the
-- explicit policies below.
-- ============================================================

-- ----------------------------------------------------------------
-- products
-- ----------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  title text not null,
  industry text not null,
  status text not null default 'live',
  one_off_price_id text,
  subscription_price_id text,
  one_off_amount_pence int not null default 2900,
  subscription_amount_pence int not null default 2900,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products: public read" on public.products
  for select using (true);

-- ----------------------------------------------------------------
-- customers
-- ----------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.customers enable row level security;

create policy "customers: read own" on public.customers
  for select using (auth.uid() = user_id);

create policy "customers: insert own" on public.customers
  for insert with check (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  product_id text not null references public.products(id),
  mode text not null check (mode in ('oneoff', 'subscription')),
  status text not null default 'pending',
  stripe_session_id text unique,
  stripe_subscription_id text,
  amount_pence int not null,
  currency text not null default 'gbp',
  customer_email text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  cancelled_at timestamptz
);

alter table public.orders enable row level security;

create policy "orders: read own" on public.orders
  for select using (
    customer_id in (select id from public.customers where user_id = auth.uid())
  );

-- ----------------------------------------------------------------
-- licenses
-- ----------------------------------------------------------------
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id text not null references public.products(id),
  order_id uuid references public.orders(id) on delete set null,
  mode text not null check (mode in ('oneoff', 'subscription')),
  status text not null default 'active',
  slug text not null unique,
  hosted_url text,
  active_from timestamptz not null default now(),
  active_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.licenses enable row level security;

create policy "licenses: read own" on public.licenses
  for select using (
    customer_id in (select id from public.customers where user_id = auth.uid())
  );

create index if not exists licenses_customer_idx on public.licenses (customer_id);
create index if not exists licenses_slug_idx on public.licenses (slug);

-- ----------------------------------------------------------------
-- submissions  (hosted runner only)
-- ----------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.licenses(id) on delete cascade,
  product_id text not null references public.products(id),
  pathway_id text,
  payload jsonb not null,
  audit_hash text not null,
  submitted_by_email text,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted'
    check (status in ('submitted', 'review', 'approved', 'returned'))
);

alter table public.submissions enable row level security;

create policy "submissions: licensee read" on public.submissions
  for select using (
    license_id in (
      select id from public.licenses
      where customer_id in (select id from public.customers where user_id = auth.uid())
    )
  );

-- Open insert via service role only (the API route writes here, never the client).

create index if not exists submissions_license_idx on public.submissions (license_id);
create index if not exists submissions_submitted_idx on public.submissions (submitted_at desc);

-- ----------------------------------------------------------------
-- submission_events  (append-only audit log)
-- ----------------------------------------------------------------
create table if not exists public.submission_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  event_type text not null,
  actor_email text,
  actor_role text,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.submission_events enable row level security;

create policy "submission_events: licensee read" on public.submission_events
  for select using (
    submission_id in (
      select s.id from public.submissions s
      join public.licenses l on l.id = s.license_id
      where l.customer_id in (select id from public.customers where user_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------
-- Seed: the live product
-- ----------------------------------------------------------------
insert into public.products (id, slug, title, industry, status, one_off_amount_pence, subscription_amount_pence)
values (
  'staff-onboarding-uk-care',
  'staff-onboarding-uk-care',
  'Staff onboarding · UK care providers',
  'healthcare',
  'live',
  2900,
  2900
)
on conflict (id) do update set
  title = excluded.title,
  status = excluded.status,
  updated_at = now();
