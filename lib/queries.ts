import "server-only";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog-types";

const projection = `{
  _id, name, "slug": slug.current,
  "categoryName": coalesce(category->name, "Uncategorized"),
  "categorySlug": coalesce(category->slug.current, ""),
  hsCode, tradeType, shortDescription, description,
  "images": coalesce(images[defined(asset._ref)], []), originCountry, originFlag,
  "specifications": coalesce(specifications[], []),
  "certifications": coalesce(certifications, []), moq, packaging,
  "isFeatured": coalesce(isFeatured, false), "isSample": coalesce(isSample, false)
}`;
const validProduct = `_type == "product" && defined(slug.current) && defined(name) && tradeType in ["import", "export", "both"]`;
export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) { _id, name, "slug": slug.current, description, icon, "productCount": count(*[${validProduct} && category._ref == ^._id]) }`,
);
export const PRODUCTS_QUERY = defineQuery(
  `*[${validProduct}] | order(_createdAt desc, _id asc) ${projection}`,
);
export const CATEGORY_PRODUCTS_QUERY = defineQuery(
  `*[${validProduct} && category->slug.current == $categorySlug] | order(_createdAt desc, _id asc) ${projection}`,
);
export const PRODUCT_QUERY = defineQuery(
  `*[${validProduct} && slug.current == $slug][0] ${projection}`,
);
export const FEATURED_QUERY = defineQuery(
  `*[${validProduct} && isFeatured == true] | order(_createdAt desc, _id asc)[0...6] ${projection}`,
);
export const RELATED_QUERY = defineQuery(
  `*[${validProduct} && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(_createdAt desc, _id asc)[0...4] ${projection}`,
);

const publicClient = client.withConfig({
  useCdn: false,
  perspective: "published",
  timeout: 15000,
  maxRetries: 1,
});
const options = { cache: "no-store" as const };
export const getAllCategories = () =>
  publicClient.fetch<CatalogCategory[]>(CATEGORIES_QUERY, {}, options);
export const getAllProducts = () =>
  publicClient.fetch<CatalogProduct[]>(PRODUCTS_QUERY, {}, options);
export const getProductsByCategory = (categorySlug: string) =>
  publicClient.fetch<CatalogProduct[]>(
    CATEGORY_PRODUCTS_QUERY,
    { categorySlug },
    options,
  );
export const getProductBySlug = (slug: string) =>
  publicClient.fetch<CatalogProduct | null>(PRODUCT_QUERY, { slug }, options);
export const getFeaturedProducts = () =>
  publicClient.fetch<CatalogProduct[]>(FEATURED_QUERY, {}, options);
export const getRelatedProducts = (categorySlug: string, currentSlug: string) =>
  publicClient.fetch<CatalogProduct[]>(
    RELATED_QUERY,
    { categorySlug, currentSlug },
    options,
  );
