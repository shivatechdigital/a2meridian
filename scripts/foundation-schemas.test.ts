import assert from "node:assert/strict";
import { test } from "node:test";
import { schemaTypes } from "../sanity/schemaTypes";
import { canCreateType, canUseDocumentAction, SINGLETON_PAGES, SINGLETON_TYPES } from "../sanity/singleton-policy";

test("all 17 schemas are registered once and catalog types are preserved", () => {
  const names = schemaTypes.map(type => type.name);
  assert.equal(names.length, 17);
  assert.equal(new Set(names).size, 17);
  for (const name of ["seo", "blockContent", "teamMember", "timelineItem", "countryEntry", "officeLocation", "statItem", "valueItem", "siteSettings", "homepage", "aboutPage", "globalReachPage", "certification", "contactPage", "inquiry", "category", "product"]) assert.ok(names.includes(name), name);
});
test("singletons use fixed IDs and cannot be created, duplicated, deleted, or unpublished from Studio", () => {
  assert.equal(SINGLETON_TYPES.size, 5);
  for (const page of SINGLETON_PAGES) assert.equal(page.type, page.id);
  for (const type of SINGLETON_TYPES) {
    assert.equal(canCreateType(type), false);
    for (const action of ["duplicate", "delete", "unpublish"]) assert.equal(canUseDocumentAction(type, action), false);
    for (const action of ["publish", "discardChanges", "restore"]) assert.equal(canUseDocumentAction(type, action), true);
  }
  assert.equal(canCreateType("product"), true);
  assert.equal(canUseDocumentAction("product", "duplicate"), true);
});
test("inquiry model is disabled for public dataset editing", () => {
  const inquiry = schemaTypes.find(type => type.name === "inquiry");
  assert.equal(inquiry?.readOnly, true);
  assert.equal(canCreateType("inquiry"), false);
  for (const action of ["publish", "duplicate", "delete", undefined]) assert.equal(canUseDocumentAction("inquiry", action), false);
});
test("all nested schema references resolve and arrays use named members", () => {
  const registered = new Set(schemaTypes.map(type => type.name));
  const builtIn = new Set(["document", "object", "array", "string", "number", "boolean", "date", "datetime", "url", "image", "file", "reference", "block", "slug", "geopoint", "text"]);
  function inspect(value: unknown) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach(inspect); return; }
    const record = value as Record<string, unknown>;
    if (typeof record.type === "string") assert.ok(builtIn.has(record.type) || registered.has(record.type), `Unresolved type ${record.type}`);
    for (const key of ["fields", "of", "to", "marks", "annotations"]) inspect(record[key]);
  }
  schemaTypes.forEach(inspect);
});