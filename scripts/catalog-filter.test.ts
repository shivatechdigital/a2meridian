import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ProductSpecs from "../components/products/ProductSpecs";
import { filterProducts } from "../lib/catalog-filter";
import type { CatalogProduct, TradeType } from "../lib/catalog-types";

function product(name: string, categorySlug: string, tradeType: TradeType, hsCode: string | null): CatalogProduct {
  return { _id: name, name, slug: name.toLowerCase(), categoryName: categorySlug, categorySlug, tradeType, hsCode, shortDescription: null, description: name, images: [], specifications: [], certifications: [], originCountry: null, originFlag: null, moq: null, packaging: null, isFeatured: false, isSample: true };
}
const products = [product("Basmati Rice", "agriculture", "export", "1006.30.20"), product("Water Pumps", "machinery", "import", "8413.70.00"), product("Industrial Dyes", "chemicals", "both", null)];

test("category and text search combine without mutating products", () => {
  assert.equal(filterProducts(products, "agriculture", "all", " RICE ")[0].name, "Basmati Rice");
  assert.equal(filterProducts(products, "machinery", "all", "rice").length, 0);
  assert.equal(products.length, 3);
});
test("import and export include dual-direction products", () => {
  assert.deepEqual(filterProducts(products, "all", "import", "").map(item => item.name), ["Water Pumps", "Industrial Dyes"]);
  assert.deepEqual(filterProducts(products, "all", "export", "").map(item => item.name), ["Basmati Rice", "Industrial Dyes"]);
  assert.deepEqual(filterProducts(products, "all", "both", "").map(item => item.name), ["Industrial Dyes"]);
});
test("HS search accepts dotted and undotted numbers", () => {
  for (const query of ["1006.30", "10063020", "1006 30 20"]) assert.equal(filterProducts(products, "all", "all", query)[0].name, "Basmati Rice");
});
test("empty, unknown category, no matches, and nullable HS code", () => {
  assert.equal(filterProducts(products, "all", "all", "").length, 3);
  assert.equal(filterProducts(products, "unknown", "all", "").length, 0);
  assert.equal(filterProducts(products, "all", "all", "not-in-catalog").length, 0);
  assert.equal(filterProducts(products, "all", "all", "chemicals")[0].name, "Industrial Dyes");
  assert.deepEqual(filterProducts([], "all", "all", "rice"), []);
});

test("certification-only specs render without MOQ, packaging, or parameters", () => {
  const markup = renderToStaticMarkup(createElement(ProductSpecs, { specifications: [], certifications: ["Organic"], moq: null, packaging: null }));
  assert.ok(markup.includes("Organic"));
  assert.ok(markup.includes("Product certifications"));
  assert.ok(!markup.includes("<table"));
});