-- ============================================================
-- Kapture Forms · builder bundle format
-- ============================================================
-- Allow the 'all' value in builder_orders.format so a single row can
-- represent an all-5-formats bundle (£8). The fulfillment helper
-- renders five files and attaches them all to one email.
-- ============================================================

alter table public.builder_orders drop constraint if exists builder_orders_format_check;

alter table public.builder_orders
  add constraint builder_orders_format_check
  check (format in ('pdf', 'docx', 'html', 'csv', 'gforms', 'all'));
