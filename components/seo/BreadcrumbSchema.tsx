import { breadcrumbData, serializeJsonLd } from "@/lib/structured-data";

export default function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(breadcrumbData(items)),
      }}
    />
  );
}
