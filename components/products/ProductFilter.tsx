"use client";

import { Search, RotateCcw } from "lucide-react";
import type { CatalogCategory } from "@/lib/catalog-types";

interface Props {
  categories: CatalogCategory[];
  category: string;
  search: string;
  trade: string;
  onChange: (key: "category" | "q" | "trade", value: string) => void;
  onReset: () => void;
}

export default function ProductFilter({
  categories,
  category,
  search,
  trade,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="space-y-5 border-b border-gray-300 pb-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="w-full lg:max-w-lg">
          <label
            htmlFor="catalog-search"
            className="mb-2 block text-sm font-semibold text-navy-900"
          >
            Search products or HS code
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-3.5 size-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="search"
              value={search}
              onChange={(event) => onChange("q", event.target.value)}
              placeholder="Product, category, or HS code"
              className="h-12 w-full rounded-md border border-gray-300 bg-white pl-11 pr-4 text-sm"
            />
          </div>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy-900">
            Trade
          </legend>
          <div className="flex flex-wrap gap-1 rounded-md border border-gray-300 bg-white p-1">
            {[
              { value: "all", label: "All" },
              { value: "export", label: "Export" },
              { value: "import", label: "Import" },
              { value: "both", label: "Import & Export" },
            ].map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded px-3 py-2 text-xs font-medium has-focus-visible:outline-2 has-focus-visible:outline-gold-600 ${trade === option.value ? "bg-navy-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <input
                  type="radio"
                  name="catalog-trade"
                  className="sr-only"
                  value={option.value}
                  checked={trade === option.value}
                  onChange={() => onChange("trade", option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={onReset}
          title="Clear all filters"
          className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-md border border-gray-300 px-4 text-sm font-medium text-navy-900 hover:bg-white lg:self-auto"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Clear Filters
        </button>
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy-900">
          Category
        </legend>
        <div className="flex flex-wrap gap-2">
          {[
            { _id: "all", name: "All Products", slug: "all", icon: null },
            ...categories,
          ].map((option) => (
            <button
              key={option._id}
              type="button"
              onClick={() => onChange("category", option.slug)}
              aria-pressed={category === option.slug}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${category === option.slug ? "border-gold-500 bg-gold-500 font-semibold text-navy-950" : "border-gray-300 bg-white text-gray-700 hover:border-gold-500"}`}
            >
              {option.icon && (
                <span aria-hidden="true" className="mr-1.5">
                  {option.icon}
                </span>
              )}
              {option.name}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
