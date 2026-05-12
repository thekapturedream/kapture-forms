import type { Metadata } from "next";
import { BuilderClient } from "./BuilderClient";

export const metadata: Metadata = {
  title: "Form builder",
  description:
    "Compose a Kapture form from typed primitives. Live preview, conditional logic, instant JSON export. Schema-ready for PDF, DOCX, HTML, CSV, Google Forms, and the hosted runner.",
  alternates: { canonical: "/builder" },
};

export default function BuilderPage() {
  return <BuilderClient />;
}
