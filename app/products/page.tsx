import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { getAllProducts, getAllCategories } from "@/lib/queries";
import ProductCatalog from "@/components/products/ProductCatalog";
import CatalogLoading from "@/components/products/CatalogLoading";

export const metadata: Metadata = pageMetadata.products;

export default function ProductsPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[42svh] items-center overflow-hidden bg-navy-950 px-5 py-16 sm:px-8">
        <Image
          src="/about/dispatch.jpg"
          alt="Illustrative product storage and logistics warehouse"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/75" />
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase text-gold-300">
            Our Catalog
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
            Products We Deal In
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-200">
            Explore our import and export portfolio. Product details,
            specifications, and inquiries, all in one place.
          </p>
        </div>
      </section>
      <Suspense fallback={<CatalogLoading />}>
        <CatalogData />
      </Suspense>
    </>
  );
}

async function CatalogData() {
  await connection();
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  return <ProductCatalog products={products} categories={categories} />;
}
