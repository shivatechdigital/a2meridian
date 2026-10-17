import { organizationGraph, serializeJsonLd } from "@/lib/structured-data";

export default function SchemaMarkup() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationGraph()) }}
    />
  );
}
