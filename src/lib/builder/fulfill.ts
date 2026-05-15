/**
 * Builder order fulfillment.
 *
 * Called from the Stripe webhook when checkout.session.completed arrives
 * with metadata.type === 'builder'. Renders the stored schema into the
 * customer's chosen format and emails it via Resend. Stamps the row
 * fulfilled or failed.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPdf } from "@lib/exports/pdf";
import { buildDocx } from "@lib/exports/docx";
import { buildSchemaCsv } from "@lib/exports/csv";
import { buildEmbedHtml } from "@lib/exports/html-embed";
import { buildGFormsSpec } from "@lib/exports/gforms";
import {
  BUILDER_FORMATS,
  SINGLE_FORMATS,
  type BuilderFormat,
  type SingleBuilderFormat,
} from "./types";
import type { PackSchema } from "@lib/schemas/types";

interface BuilderOrderRow {
  id: string;
  email: string;
  format: BuilderFormat;
  title: string | null;
  schema: PackSchema;
  status: string;
}

interface RenderedFile {
  buffer: Buffer;
  contentType: string;
  filename: string;
  format: SingleBuilderFormat;
}

export async function fulfillBuilderOrder(
  supabase: SupabaseClient,
  orderId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("builder_orders")
    .select("id, email, format, title, schema, status")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    // Nothing to fulfill; webhook continues silently. Stripe will not retry
    // because we 200'd it elsewhere.
    return;
  }

  const order = data as BuilderOrderRow;
  if (order.status === "fulfilled") return; // idempotent

  await supabase
    .from("builder_orders")
    .update({ status: "paid" })
    .eq("id", order.id);

  try {
    const files = await renderOrder(order);
    await sendBuilderEmail({
      to: order.email,
      title: order.title ?? order.schema.title ?? "Your Kapture form",
      format: order.format,
      files,
      orderId: order.id,
    });

    await supabase
      .from("builder_orders")
      .update({
        status: "fulfilled",
        fulfilled_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", order.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await supabase
      .from("builder_orders")
      .update({ status: "failed", error: message })
      .eq("id", order.id);
    // Re-throw so the webhook logs it; Stripe still gets a 200 from the
    // outer handler because we wrap there.
    throw err;
  }
}

/* ─────────── rendering ─────────── */

async function renderOrder(order: BuilderOrderRow): Promise<RenderedFile[]> {
  // 'all' bundle renders every single format in delivery order. Individual
  // orders just render the one file. Returning an array unifies the email
  // attachment path — sendBuilderEmail iterates regardless.
  if (order.format === "all") {
    return Promise.all(SINGLE_FORMATS.map((f) => renderOne(order, f)));
  }
  return [await renderOne(order, order.format)];
}

async function renderOne(
  order: BuilderOrderRow,
  format: SingleBuilderFormat,
): Promise<RenderedFile> {
  const formatSpec = BUILDER_FORMATS.find((f) => f.id === format);
  if (!formatSpec) {
    throw new Error(`Unsupported builder format: ${format}`);
  }
  const baseSlug = slugify(order.title ?? order.schema.title ?? "kapture-form");
  const filename = `${baseSlug}.${formatSpec.extension}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forms.thekapture.com";
  const licenseSlug = `builder-${order.id.slice(0, 8)}`;

  switch (format) {
    case "pdf": {
      const bytes = await buildPdf({
        schema: order.schema,
        licenseSlug,
        buyerName: order.email,
      });
      return { buffer: Buffer.from(bytes), contentType: formatSpec.mime, filename, format };
    }
    case "docx": {
      const bytes = await buildDocx({
        schema: order.schema,
        licenseSlug,
        buyerName: order.email,
      });
      return { buffer: Buffer.from(bytes), contentType: formatSpec.mime, filename, format };
    }
    case "html": {
      const html = buildEmbedHtml({
        schema: order.schema,
        licenseSlug,
        baseUrl,
      });
      return {
        buffer: Buffer.from(html, "utf8"),
        contentType: formatSpec.mime,
        filename,
        format,
      };
    }
    case "csv": {
      const csv = buildSchemaCsv(order.schema);
      return {
        buffer: Buffer.from(csv, "utf8"),
        contentType: formatSpec.mime,
        filename,
        format,
      };
    }
    case "gforms": {
      const spec = buildGFormsSpec(order.schema);
      const json = JSON.stringify(spec, null, 2);
      return {
        buffer: Buffer.from(json, "utf8"),
        contentType: formatSpec.mime,
        filename,
        format,
      };
    }
  }
}

/* ─────────── email ─────────── */

interface BuilderEmailArgs {
  to: string;
  title: string;
  format: BuilderFormat;
  files: RenderedFile[];
  orderId: string;
}

async function sendBuilderEmail(args: BuilderEmailArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }
  const from =
    process.env.KAPTURE_EMAIL_FROM ?? "Kapture Forms <forms@thekapture.com>";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://forms.thekapture.com";
  const regenerateUrl = `${baseUrl}/builder/regenerate/${args.orderId}`;

  const isBundle = args.format === "all";
  const fmtNames = args.files
    .map((f) => BUILDER_FORMATS.find((x) => x.id === f.format)?.label ?? f.format)
    .join(", ");
  const headline = isBundle
    ? "Your forms are ready · all 5 formats."
    : "Your form is ready.";
  const subject = isBundle
    ? `All 5 formats ready · ${args.title}`
    : `Your form is ready · ${args.title}`;
  const subline = isBundle
    ? `We generated <strong>${escapeHtml(args.title)}</strong> in every format: ${escapeHtml(fmtNames)}. All five files are attached.`
    : `We generated <strong>${escapeHtml(args.title)}</strong> as <strong>${escapeHtml(fmtNames)}</strong>. The file is attached.`;

  const html = `<!doctype html>
<html><body style="font-family: -apple-system, system-ui, Segoe UI, Arial, sans-serif; color: #0A0A0A; background:#FFFFFF; padding: 32px;">
  <div style="max-width: 540px; margin: 0 auto;">
    <div style="font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em; font-weight: 700; color: #876300; margin-bottom: 24px;">KAPTURE FORMS · BUILDER</div>
    <h1 style="font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 16px;">${escapeHtml(headline)}</h1>
    <p style="font-size: 15px; line-height: 1.55; color: #3a3a3a; margin: 0 0 20px;">
      ${subline} Open them, drop them into your stack, ship.
    </p>
    ${
      isBundle
        ? ""
        : `<div style="background:#FAFAF7; border:1px solid #ECEAE3; border-radius:14px; padding:18px 20px; margin: 24px 0;">
            <div style="font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; font-weight: 700; color:#FFD400; background:#0A0A0A; display:inline-block; padding:4px 8px; border-radius:6px; margin-bottom:12px;">WANT ANOTHER FORMAT?</div>
            <p style="font-size: 14px; line-height: 1.55; color: #3a3a3a; margin: 0 0 14px;">
              Same form, different output — PDF, DOCX, HTML, CSV, or Google Forms — for £2 each. Or get all 5 for £8.
            </p>
            <a href="${escapeHtml(regenerateUrl)}" style="display:inline-block; background:#FFD400; color:#0A0A0A; padding:10px 18px; border-radius:10px; font-weight:700; font-size:13px; text-decoration:none;">Get another format →</a>
          </div>`
    }
    <p style="font-size: 14px; line-height: 1.55; color: #3a3a3a; margin: 24px 0;">
      Need to tweak the schema instead? Head back to <a href="${baseUrl}/builder" style="color:#0A0A0A; font-weight: 600;">the builder</a> — your last session is saved locally in your browser.
    </p>
    <hr style="border:none; border-top: 1px solid #ECEAE3; margin: 24px 0;">
    <p style="font-size: 12px; color: #6b7280; margin: 0;">Kapture Forms · forms.thekapture.com</p>
  </div>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject,
      html,
      attachments: args.files.map((f) => ({
        filename: f.filename,
        content: f.buffer.toString("base64"),
        content_type: f.contentType,
      })),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text || res.statusText}`);
  }
}

/* ─────────── helpers ─────────── */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "kapture-form";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
