import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAllProducts } from "@/lib/queries";
import { absoluteUrl, INDEXABLE_PATHS } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const products = await getAllProducts();
  return [
    ...INDEXABLE_PATHS.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...products
      .filter((product) => !product.isSample)
      .map((product) => ({
        url: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];
}
