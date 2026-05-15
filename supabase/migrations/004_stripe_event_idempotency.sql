-- ============================================================
-- Kapture Forms · Stripe webhook idempotency
-- ============================================================
-- Stripe will retry webhook deliveries on any non-2xx response and may
-- occasionally deliver the same event twice in normal operation. Track
-- event ids here so handlers can detect a duplicate and bail without
-- side-effecting twice (e.g. emailing a builder order twice).
--
-- The webhook does INSERT ... ON CONFLICT DO NOTHING RETURNING id. If
-- the RETURN is empty, this event was already processed → early return.
-- ============================================================

create table if not exists public.stripe_events (
  event_id text primary key,
  event_type text,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- No anon access — service-role only (webhook).
