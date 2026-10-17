import assert from "node:assert/strict";
import { test } from "node:test";
import {
  absoluteUrl,
  createPageMetadata,
  INDEXABLE_PATHS,
  normalizeSiteUrl,
  pageMetadata,
} from "../lib/seo";
import {
  breadcrumbData,
  organizationGraph,
  productData,
  serializeJsonLd,
} from "../lib/structured-data";
import type { CatalogProduct } from "../lib/catalog-types";

test("site URL validation and local canonical resolution", () => {
  assert.equal(normalizeSiteUrl("https://example.com/"), "https://example.com");
  for (const value of [
    "javascript:alert(1)",
    "https://user:secret@example.com",
    "https://example.com/path",
  ])
    assert.throws(() => normalizeSiteUrl(value));
  assert.throws(() => absoluteUrl("//other.example"));
  for (const path of INDEXABLE_PATHS)
    assert.ok(absoluteUrl(path).endsWith(path));
});
test("all public pages have unique descriptions, social metadata, and canonical paths", () => {
  const metadata = Object.values(pageMetadata);
  assert.equal(new Set(metadata.map((item) => item.description)).size, 6);
  assert.equal(
    new Set(metadata.map((item) => item.alternates?.canonical)).size,
    6,
  );
  const sample = createPageMetadata(
    "Sample",
    "Sample product",
    "/products/sample",
    { noindex: true },
  );
  assert.equal((sample.robots as { index: boolean }).index, false);
  assert.equal(
    (sample.robots as { googleBot: { index: boolean } }).googleBot.index,
    false,
  );
});
test("JSON-LD is script-safe and organization data excludes unsupported claims", () => {
  const encoded = serializeJsonLd({
    name: '</script><script>alert("x")</script>',
  });
  assert.ok(!encoded.includes("<"));
  assert.ok(JSON.parse(encoded).name.includes("</script>"));
  const graph = JSON.stringify(organizationGraph());
  assert.ok(graph.includes("products?q={search_term_string}"));
  for (const unsupported of [
    "XXXXXXXX",
    "numberOfEmployees",
    "sameAs",
    "GeoCoordinates",
    '"ImportExport"',
  ])
    assert.ok(!graph.includes(unsupported));
  assert.equal(
    breadcrumbData([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
    ]).itemListElement[1].position,
    2,
  );
});
test("sample products have no Product markup and inquiry-only products have no invented offer", () => {
  const product: CatalogProduct = {
    _id: "test",
    name: "Test Product",
    slug: "test",
    categoryName: "Test",
    categorySlug: "test",
    hsCode: "1234",
    tradeType: "export",
    shortDescription: null,
    description: "Test listing",
    images: [],
    originCountry: null,
    originFlag: null,
    specifications: [],
    certifications: [],
    moq: null,
    packaging: null,
    isFeatured: false,
    isSample: true,
  };
  assert.equal(productData(product), null);
  const schema = productData({ ...product, isSample: false });
  assert.ok(schema);
  assert.ok(!("offers" in schema));
  assert.ok(!("sku" in schema));
  assert.ok(!("countryOfOrigin" in schema));
});
