import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import ProductDetails from "@/components/products/ProductDetails";
import CatalogLoading from "@/components/products/CatalogLoading";
import { createPageMetadata } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const instant = false;

const loadProduct = cache(getProductBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  return product
    ? createPageMetadata(
        product.name,
        product.shortDescription || product.description.slice(0, 160),
        `/products/${encodeURIComponent(product.slug)}`,
        {
          noindex: product.isSample,
          image: product.images[0]
            ? urlFor(product.images[0])
                .width(1200)
                .height(630)
                .fit("crop")
                .auto("format")
                .url()
            : undefined,
        },
      )
    : { title: "Product Not Found", robots: { index: false } };
}

async function ProductData({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();
  const related = product.categorySlug
    ? await getRelatedProducts(product.categorySlug, slug)
    : [];
  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          {
            name: product.name,
            url: `/products/${encodeURIComponent(product.slug)}`,
          },
        ]}
      />
      <ProductDetails product={product} related={related} />
    </>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <ProductData params={params} />
    </Suspense>
  );
}
