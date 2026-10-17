import type { CatalogProduct } from "./catalog-types";

export function filterProducts(
  products: CatalogProduct[],
  category: string,
  trade: string,
  query: string,
) {
  const search = query.trim().toLocaleLowerCase("en-US");
  const numericSearch = /^\d[\d.\s-]*$/.test(search)
    ? search.replace(/\D/g, "")
    : "";
  return products.filter((product) => {
    const categoryMatches =
      category === "all" || product.categorySlug === category;
    const tradeMatches =
      trade === "all" ||
      product.tradeType === trade ||
      (trade !== "both" && product.tradeType === "both");
    const textMatches =
      !search ||
      [product.name, product.categoryName, product.hsCode || ""].some((value) =>
        value.toLocaleLowerCase("en-US").includes(search),
      ) ||
      (numericSearch &&
        (product.hsCode || "").replace(/\D/g, "").includes(numericSearch));
    return categoryMatches && tradeMatches && Boolean(textMatches);
  });
}
