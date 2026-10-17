import type { CatalogProduct } from "@/lib/catalog-types";
import { productData, serializeJsonLd } from "@/lib/structured-data";
import { urlFor } from "@/sanity/lib/image";

export default function ProductSchema({
  product,
}: {
  product: CatalogProduct;
}) {
  const schema = productData(
    product,
    product.images.map((image) =>
      urlFor(image).width(1200).auto("format").url(),
    ),
  );
  return schema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  ) : null;
}
