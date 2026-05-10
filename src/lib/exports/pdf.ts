import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { PackSchema, Field } from "../schemas/types";

/**
 * Generate a print-ready A4 PDF for a Kapture Forms pack.
 *
 * - Black + yellow Kapture chrome on the cover page
 * - One section per group of fields (with regulator citation in caption)
 * - Signature block at the end
 * - Audit footer on every page (license slug + page number + generated-at)
 *
 * Returns the binary PDF as a Uint8Array. Stream this directly out of an
 * API route with `Content-Type: application/pdf`.
 */

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = { top: 56, right: 48, bottom: 64, left: 48 };
const KAPTURE_BLACK = rgb(0.039, 0.039, 0.039);
const KAPTURE_YELLOW = rgb(1, 0.831, 0);
const NEUTRAL_INK = rgb(0.16, 0.16, 0.16);
const NEUTRAL_MUTED = rgb(0.42, 0.42, 0.42);
const HAIRLINE = rgb(0.83, 0.83, 0.83);

interface BuildPdfArgs {
  schema: PackSchema;
  licenseSlug: string;
  /** Pretty print of the buyer's organisation name on the cover. */
  buyerName?: string;
}

export async function buildPdf({ schema, licenseSlug, buyerName }: BuildPdfArgs): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(schema.title);
  doc.setProducer("Kapture Forms");
  doc.setCreator("forms.thekapture.com");
  doc.setCreationDate(new Date());

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await doc.embedFont(StandardFonts.Courier);

  const ctx: Ctx = {
    doc,
    fontRegular,
    fontBold,
    fontMono,
    licenseSlug,
    pages: [],
    currentPage: null,
    cursorY: 0,
    pageNumber: 0,
  };

  // Cover page
  ctx.currentPage = doc.addPage([A4.width, A4.height]);
  ctx.pages.push(ctx.currentPage);
  ctx.pageNumber += 1;
  drawCover(ctx, schema, buyerName);

  // Section pages
  for (const section of schema.sections) {
    newPage(ctx);
    drawSectionHeader(ctx, section.name, section.intro);
    for (const field of section.fields) {
      drawField(ctx, field);
    }
  }

  // Signature page
  newPage(ctx);
  drawSignatureBlock(ctx, schema);

  // Audit footer on every page
  ctx.pages.forEach((p, i) => drawFooter(ctx, p, i + 1, ctx.pages.length));

  return doc.save();
}

interface Ctx {
  doc: PDFDocument;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  fontMono: PDFFont;
  licenseSlug: string;
  pages: PDFPage[];
  currentPage: PDFPage | null;
  cursorY: number;
  pageNumber: number;
}

function newPage(ctx: Ctx) {
  ctx.currentPage = ctx.doc.addPage([A4.width, A4.height]);
  ctx.pages.push(ctx.currentPage);
  ctx.pageNumber += 1;
  ctx.cursorY = A4.height - MARGIN.top;
}

function ensureRoom(ctx: Ctx, needed: number) {
  if (ctx.cursorY - needed < MARGIN.bottom + 24) {
    newPage(ctx);
  }
}

function drawCover(ctx: Ctx, schema: PackSchema, buyerName?: string) {
  const page = ctx.currentPage!;
  // Top yellow band
  page.drawRectangle({ x: 0, y: A4.height - 12, width: A4.width, height: 12, color: KAPTURE_YELLOW });
  // Brand mark
  page.drawText("KAPTURE FORMS", {
    x: MARGIN.left,
    y: A4.height - 80,
    size: 9,
    font: ctx.fontMono,
    color: KAPTURE_BLACK,
  });
  // Title
  page.drawText(schema.title, {
    x: MARGIN.left,
    y: A4.height - 160,
    size: 28,
    font: ctx.fontBold,
    color: KAPTURE_BLACK,
    maxWidth: A4.width - MARGIN.left - MARGIN.right,
    lineHeight: 32,
  });
  // Pathways line
  const pathwaysLine = "Pathways: " + schema.pathways.map((p) => p.name).join(" · ");
  page.drawText(wrap(pathwaysLine, 88), {
    x: MARGIN.left,
    y: A4.height - 230,
    size: 10,
    font: ctx.fontRegular,
    color: NEUTRAL_INK,
    lineHeight: 14,
    maxWidth: A4.width - MARGIN.left - MARGIN.right,
  });
  // Buyer line
  if (buyerName) {
    page.drawText(`Prepared for: ${buyerName}`, {
      x: MARGIN.left,
      y: 260,
      size: 11,
      font: ctx.fontBold,
      color: KAPTURE_BLACK,
    });
  }
  // Section count
  const fieldCount = schema.sections.reduce((n, s) => n + s.fields.length, 0);
  page.drawText(
    `${schema.sections.length} sections · ${fieldCount} fields · ${schema.pathways.length} pathways`,
    { x: MARGIN.left, y: 240, size: 10, font: ctx.fontMono, color: NEUTRAL_MUTED }
  );
  // Black bottom band with audit notice
  page.drawRectangle({ x: 0, y: 0, width: A4.width, height: 80, color: KAPTURE_BLACK });
  page.drawText("Every submission is signed, timestamped, and audit-hashed.", {
    x: MARGIN.left,
    y: 50,
    size: 11,
    font: ctx.fontBold,
    color: KAPTURE_YELLOW,
  });
  page.drawText("forms.thekapture.com", {
    x: MARGIN.left,
    y: 30,
    size: 9,
    font: ctx.fontMono,
    color: rgb(1, 1, 1),
  });
  ctx.cursorY = MARGIN.bottom; // cover doesn't reserve cursor
}

function drawSectionHeader(ctx: Ctx, name: string, intro?: string) {
  const page = ctx.currentPage!;
  // Yellow tab
  page.drawRectangle({ x: MARGIN.left, y: ctx.cursorY - 4, width: 24, height: 2, color: KAPTURE_YELLOW });
  page.drawText("SECTION", { x: MARGIN.left + 32, y: ctx.cursorY - 8, size: 7, font: ctx.fontMono, color: NEUTRAL_MUTED });
  ctx.cursorY -= 24;
  page.drawText(name, { x: MARGIN.left, y: ctx.cursorY, size: 16, font: ctx.fontBold, color: KAPTURE_BLACK });
  ctx.cursorY -= 24;
  if (intro) {
    const wrapped = wrap(intro, 90);
    page.drawText(wrapped, {
      x: MARGIN.left,
      y: ctx.cursorY,
      size: 9,
      font: ctx.fontRegular,
      color: NEUTRAL_INK,
      lineHeight: 12,
      maxWidth: A4.width - MARGIN.left - MARGIN.right,
    });
    ctx.cursorY -= 12 * (wrapped.split("\n").length + 1);
  }
  // Hairline
  page.drawLine({
    start: { x: MARGIN.left, y: ctx.cursorY + 4 },
    end: { x: A4.width - MARGIN.right, y: ctx.cursorY + 4 },
    thickness: 0.5,
    color: HAIRLINE,
  });
  ctx.cursorY -= 12;
}

function drawField(ctx: Ctx, field: Field) {
  const ROW_HEIGHT = field.type === "textarea" ? 70 : field.type === "checkbox" ? 26 : 44;
  ensureRoom(ctx, ROW_HEIGHT);
  const page = ctx.currentPage!;
  const y = ctx.cursorY;

  // Field label
  page.drawText(field.label + (field.required ? " *" : ""), {
    x: MARGIN.left,
    y,
    size: 9,
    font: ctx.fontBold,
    color: KAPTURE_BLACK,
  });
  // Pathway tag
  if (field.pathways && field.pathways.length > 0) {
    const tag = `[${field.pathways.join(" · ")}]`;
    page.drawText(tag, {
      x: MARGIN.left + textWidth(ctx.fontBold, field.label + (field.required ? " *" : ""), 9) + 8,
      y,
      size: 7,
      font: ctx.fontMono,
      color: NEUTRAL_MUTED,
    });
  }
  // Regulator citation right-aligned
  if (field.regulator) {
    const reg = field.regulator;
    const w = textWidth(ctx.fontMono, reg, 7);
    page.drawText(reg, {
      x: A4.width - MARGIN.right - w,
      y,
      size: 7,
      font: ctx.fontMono,
      color: KAPTURE_BLACK,
    });
  }

  if (field.type === "checkbox") {
    page.drawRectangle({
      x: MARGIN.left,
      y: y - 16,
      width: 10,
      height: 10,
      borderColor: KAPTURE_BLACK,
      borderWidth: 0.6,
    });
  } else {
    // Input line(s)
    const linesNeeded = field.type === "textarea" ? 3 : 1;
    for (let i = 0; i < linesNeeded; i++) {
      const lineY = y - 16 - i * 14;
      page.drawLine({
        start: { x: MARGIN.left, y: lineY },
        end: { x: A4.width - MARGIN.right, y: lineY },
        thickness: 0.5,
        color: HAIRLINE,
      });
    }
  }

  if (field.options && field.type === "select") {
    const opts = field.options.join(" · ");
    // Inside this branch type is "select" so the row offset is the
    // single-line value (28). Textarea selects don't exist in our schema.
    page.drawText(`Options: ${opts}`, {
      x: MARGIN.left,
      y: y - 28,
      size: 7,
      font: ctx.fontMono,
      color: NEUTRAL_MUTED,
      maxWidth: A4.width - MARGIN.left - MARGIN.right,
    });
  }

  ctx.cursorY -= ROW_HEIGHT;
}

function drawSignatureBlock(ctx: Ctx, schema: PackSchema) {
  ensureRoom(ctx, 200);
  const page = ctx.currentPage!;
  page.drawRectangle({ x: MARGIN.left, y: ctx.cursorY - 4, width: 24, height: 2, color: KAPTURE_YELLOW });
  page.drawText("SIGN-OFF", {
    x: MARGIN.left + 32,
    y: ctx.cursorY - 8,
    size: 7,
    font: ctx.fontMono,
    color: NEUTRAL_MUTED,
  });
  ctx.cursorY -= 24;
  page.drawText("Applicant signature & date", {
    x: MARGIN.left,
    y: ctx.cursorY,
    size: 12,
    font: ctx.fontBold,
    color: KAPTURE_BLACK,
  });
  ctx.cursorY -= 60;
  // Signature line
  page.drawLine({
    start: { x: MARGIN.left, y: ctx.cursorY },
    end: { x: A4.width / 2 - 16, y: ctx.cursorY },
    thickness: 0.5,
    color: HAIRLINE,
  });
  page.drawLine({
    start: { x: A4.width / 2 + 16, y: ctx.cursorY },
    end: { x: A4.width - MARGIN.right, y: ctx.cursorY },
    thickness: 0.5,
    color: HAIRLINE,
  });
  page.drawText("Signature", { x: MARGIN.left, y: ctx.cursorY - 12, size: 8, font: ctx.fontMono, color: NEUTRAL_MUTED });
  page.drawText("Date", { x: A4.width / 2 + 16, y: ctx.cursorY - 12, size: 8, font: ctx.fontMono, color: NEUTRAL_MUTED });
  ctx.cursorY -= 60;

  page.drawText("Authorised by · name & role", {
    x: MARGIN.left,
    y: ctx.cursorY,
    size: 12,
    font: ctx.fontBold,
    color: KAPTURE_BLACK,
  });
  ctx.cursorY -= 60;
  page.drawLine({
    start: { x: MARGIN.left, y: ctx.cursorY },
    end: { x: A4.width / 2 - 16, y: ctx.cursorY },
    thickness: 0.5,
    color: HAIRLINE,
  });
  page.drawLine({
    start: { x: A4.width / 2 + 16, y: ctx.cursorY },
    end: { x: A4.width - MARGIN.right, y: ctx.cursorY },
    thickness: 0.5,
    color: HAIRLINE,
  });
  page.drawText("Name & role", { x: MARGIN.left, y: ctx.cursorY - 12, size: 8, font: ctx.fontMono, color: NEUTRAL_MUTED });
  page.drawText("Date", { x: A4.width / 2 + 16, y: ctx.cursorY - 12, size: 8, font: ctx.fontMono, color: NEUTRAL_MUTED });
}

function drawFooter(ctx: Ctx, page: PDFPage, n: number, total: number) {
  page.drawLine({
    start: { x: MARGIN.left, y: 36 },
    end: { x: A4.width - MARGIN.right, y: 36 },
    thickness: 0.4,
    color: HAIRLINE,
  });
  const left = `Kapture Forms · License ${ctx.licenseSlug.slice(0, 24)}`;
  const right = `Page ${n} / ${total} · Generated ${isoDate()}`;
  page.drawText(left, { x: MARGIN.left, y: 24, size: 7, font: ctx.fontMono, color: NEUTRAL_MUTED });
  const w = textWidth(ctx.fontMono, right, 7);
  page.drawText(right, {
    x: A4.width - MARGIN.right - w,
    y: 24,
    size: 7,
    font: ctx.fontMono,
    color: NEUTRAL_MUTED,
  });
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function textWidth(font: PDFFont, str: string, size: number): number {
  return font.widthOfTextAtSize(str, size);
}

/** Soft-wrap a string to a fixed character width. pdf-lib has no built-in wrap. */
function wrap(s: string, cols: number): string {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > cols) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur += " " + w;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.join("\n");
}
