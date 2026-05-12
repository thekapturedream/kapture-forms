-- ============================================================
-- Kapture Forms · license-level customizations
-- ============================================================
-- Lets buyers re-skin their hosted runner: headline copy, fonts,
-- button shapes, accent colour, border radius, etc. Persists to the
-- license row as JSONB so the hosted runner can read it at render time.
-- ============================================================

alter table public.licenses
  add column if not exists customization jsonb not null default '{}'::jsonb;

-- Update RLS so licensees can write their own customization back.
drop policy if exists "licenses: update own customization" on public.licenses;
create policy "licenses: update own customization" on public.licenses
  for update using (
    customer_id in (select id from public.customers where user_id = auth.uid())
  )
  with check (
    customer_id in (select id from public.customers where user_id = auth.uid())
  );

comment on column public.licenses.customization is
  'JSONB blob of buyer-set theme overrides. Read by the hosted runner. Shape:
   {
     "headline": "Welcome to your onboarding form",
     "font": "manrope" | "inter" | "space-grotesk",
     "accent": "#FFD400",
     "buttonShape": "square" | "rounded" | "pill",
     "borderRadius": "sharp" | "round" | "pill"
   }';
