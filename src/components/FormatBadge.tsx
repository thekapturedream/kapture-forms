import { ExportFormat, FORMAT_LABELS } from "@lib/products";

export function FormatBadge({ format }: { format: ExportFormat }) {
  return (
    <span className={`fmt-badge fmt-${format}`}>{FORMAT_LABELS[format]}</span>
  );
}
