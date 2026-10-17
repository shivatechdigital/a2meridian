"use client";

import { useDeferredValue } from "react";
import { useSearchParams } from "next/navigation";
import { PackageOpen, ArrowLeft, ArrowRight } from "lucide-react";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog-types";
import { filterProducts } from "@/lib/catalog-filter";
import ProductFilter from "./ProductFilter";
import ProductCard from "./ProductCard";
import StaggerContainer from "@/components/shared/StaggerContainer";

export default function ProductCatalog({
  products,
  categories,
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("q") || "";
  const rawTrade = searchParams.get("trade") || "all";
  const trade = ["all", "import", "export", "both"].includes(rawTrade)
    ? rawTrade
    : "all";
  const deferredSearch = useDeferredValue(search);
  const filtered = filterProducts(products, category, trade, deferredSearch);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const rawPage = Number(searchParams.get("page") || 1);
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1),
  );
  const displayed = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const update = (key: string, value: string, push = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    if (key !== "page") params.delete("page");
    const url = `/products${params.size ? `?${params}` : ""}`;
    if (push) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };
  const reset = () => window.history.pushState(null, "", "/products");
  return (
    <section
      aria-label="Product catalog"
      className="bg-offwhite px-5 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <ProductFilter
          categories={categories}
          category={category}
          search={search}
          trade={trade}
          onChange={(key, value) => update(key, value, key !== "q")}
          onReset={reset}
        />
        <p role="status" className="my-6 text-sm text-gray-600">
          Showing <strong className="text-navy-900">{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "product" : "products"}
        </p>
        <div aria-busy={search !== deferredSearch}>
          {displayed.length ? (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </StaggerContainer>
          ) : (
            <div className="py-16 text-center">
              <PackageOpen
                className="mx-auto mb-5 size-12 text-gray-400"
                aria-hidden="true"
              />
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                {products.length
                  ? "No Products Found"
                  : "Catalog Updates Coming Soon"}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600">
                {products.length
                  ? "Try a different category, trade type, or search term."
                  : "Contact our team to discuss product requirements and availability."}
              </p>
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-md bg-gold-500 px-5 py-3 font-semibold text-navy-950"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
        {pageCount > 1 && (
          <nav
            aria-label="Catalog pagination"
            className="mt-10 flex items-center justify-center gap-5"
          >
            <button
              type="button"
              title="Previous page"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => update("page", String(currentPage - 1), true)}
              className="flex size-11 items-center justify-center rounded-md border border-gray-300 disabled:opacity-40"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm">
              Page {currentPage} of {pageCount}
            </span>
            <button
              type="button"
              title="Next page"
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={() => update("page", String(currentPage + 1), true)}
              className="flex size-11 items-center justify-center rounded-md border border-gray-300 disabled:opacity-40"
            >
              <ArrowRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
