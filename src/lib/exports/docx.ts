import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { Field, PackSchema } from "../schemas/types";

/**
 * Generate an editable Microsoft Word .docx for a Kapture Forms pack.
 *
 * - Black + yellow Kapture cover
 * - One section per page block, with regulator citations
 * - Signature table at the end
 * - Footer with license slug + generated date on every page
 *
 * Returns the binary .docx as a Uint8Array. Stream from an API route with
 * `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
 */

interface BuildDocxArgs {
  schema: PackSchema;
  licenseSlug: string;
  buyerName?: string;
}

const KAPTURE_BLACK = "0A0A0A";
const KAPTURE_YELLOW = "FFD400";
const KAPTURE_PAPER = "F5F5F5";

export async function buildDocx({ schema, licenseSlug, buyerName }: BuildDocxArgs): Promise<Uint8Array> {
  const children: (Paragraph | Table)[] = [];

  // Cover
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "KAPTURE FORMS", color: KAPTURE_BLACK, bold: true, size: 16, font: "Courier New" }),
      ],
      spacing: { after: 240 },
    }),
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: schema.title, color: KAPTURE_BLACK, bold: true, size: 56 })],
      spacing: { after: 240 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Pathways: " + schema.pathways.map((p) => p.name).join(" · "),
          color: "333333",
          size: 22,
        }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${schema.sections.length} sections · ${schema.sections.reduce(
            (n, s) => n + s.fields.length,
            0
          )} fields · audit-hashed on submission`,
          color: "555555",
          size: 18,
          font: "Courier New",
        }),
      ],
      spacing: { after: 480 },
    }),
    buyerName
      ? new Paragraph({
          children: [new TextRun({ text: `Prepared for: ${buyerName}`, bold: true, color: KAPTURE_BLACK, size: 24 })],
          spacing: { after: 240 },
        })
      : new Paragraph({ children: [], spacing: { after: 0 } })
  );

  // Sections
  for (const section of schema.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: section.name, bold: true, color: KAPTURE_BLACK })],
        shading: { type: ShadingType.SOLID, color: KAPTURE_YELLOW, fill: KAPTURE_YELLOW },
        spacing: { before: 480, after: 120 },
      })
    );
    if (section.intro) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.intro, color: "333333", italics: true, size: 20 })],
          spacing: { after: 120 },
        })
      );
    }
    for (const f of section.fields) {
      children.push(fieldBlock(f));
    }
  }

  // Signature
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Sign-off", bold: true, color: KAPTURE_BLACK })],
      shading: { type: ShadingType.SOLID, color: KAPTURE_YELLOW, fill: KAPTURE_YELLOW },
      spacing: { before: 480, after: 240 },
    }),
    signatureTable("Applicant signature & date"),
    new Paragraph({ children: [], spacing: { after: 240 } }),
    signatureTable("Authorised by · name & role")
  );

  const doc = new Document({
    creator: "Kapture Forms",
    title: schema.title,
    description: `License ${licenseSlug}`,
    styles: {
      default: {
        document: { run: { font: "Calibri" } },
        title: { run: { font: "Helvetica", size: 56, bold: true } },
        heading1: { run: { font: "Helvetica", size: 32, bold: true } },
      },
    },
    sections: [
      {
        properties: { page: { margin: { top: 1100, right: 1100, bottom: 1100, left: 1100 } } },
        children,
        footers: {
          default: footer(licenseSlug),
        },
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

function fieldBlock(f: Field): Paragraph {
  const runs: TextRun[] = [
    new TextRun({ text: f.label, bold: true, color: KAPTURE_BLACK, size: 22 }),
  ];
  if (f.required) runs.push(new TextRun({ text: " *", color: "B42318", bold: true }));
  if (f.regulator) runs.push(new TextRun({ text: `   ${f.regulator}`, color: KAPTURE_BLACK, size: 16, font: "Courier New" }));
  if (f.pathways && f.pathways.length > 0) {
    runs.push(
      new TextRun({
        text: `   [${f.pathways.join(" · ")}]`,
        color: "555555",
        size: 14,
        font: "Courier New",
      })
    );
  }

  // Inline answer line
  let answerText = "_______________________________________________________________________";
  if (f.type === "checkbox") answerText = "☐  " + (f.help ?? "Tick to confirm");
  if (f.type === "textarea") answerText = "_____________________________________________________________________________________________\n_____________________________________________________________________________________________\n_____________________________________________________________________________________________";
  if (f.type === "select" && f.options) answerText = "Options: " + f.options.join(" · ");

  return new Paragraph({
    children: [
      ...runs,
      new TextRun({ text: "\n", break: 1 }),
      new TextRun({ text: answerText, color: "888888", size: 18, font: "Courier New" }),
    ],
    spacing: { before: 120, after: 200 },
    border: {
      bottom: { color: "D4D4D4", space: 4, style: BorderStyle.SINGLE, size: 4 },
    },
  });
}

function signatureTable(label: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22 })], spacing: { after: 360 } }),
              new Paragraph({ children: [new TextRun({ text: "_______________________________", color: "888888" })] }),
              new Paragraph({ children: [new TextRun({ text: "Signature", color: "555555", size: 16 })], spacing: { before: 40 } }),
            ],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Date", bold: true, size: 22 })], spacing: { after: 360 } }),
              new Paragraph({ children: [new TextRun({ text: "_______________________________", color: "888888" })] }),
              new Paragraph({ children: [new TextRun({ text: "DD / MM / YYYY", color: "555555", size: 16 })], spacing: { before: 40 } }),
            ],
          }),
        ],
      }),
    ],
  });
}

function footer(licenseSlug: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `Kapture Forms · License ${licenseSlug.slice(0, 24)} · Generated ${new Date()
              .toISOString()
              .slice(0, 10)}`,
            color: "777777",
            size: 14,
            font: "Courier New",
          }),
        ],
      }),
    ],
  });
}
