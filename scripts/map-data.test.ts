import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  continentCount,
  countryForGeography,
  filterTradeCountries,
  regionStats,
  tooltipPosition,
  tradeCountries,
} from "../lib/countries-data";

const topology = JSON.parse(
  readFileSync(
    new URL("../public/home/world-countries.json", import.meta.url),
    "utf8",
  ),
) as {
  objects: {
    countries: { geometries: { id: string; properties: { name: string } }[] };
  };
};

test("18 unique country codes and valid coordinates", () => {
  assert.equal(tradeCountries.length, 18);
  assert.equal(new Set(tradeCountries.map((country) => country.code)).size, 18);
  assert.equal(
    new Set(tradeCountries.map((country) => country.numericCode)).size,
    18,
  );
  for (const country of tradeCountries) {
    assert.match(country.numericCode, /^\d{3}$/);
    assert.ok(
      Math.abs(country.coordinates[0]) <= 180 &&
        Math.abs(country.coordinates[1]) <= 90,
    );
    assert.ok(country.products.length > 0);
  }
});
test("numeric topology IDs match real countries, including padded IDs", () => {
  const countries = topology.objects.countries.geometries;
  for (const [id, code, name] of [
    ["840", "USA", "United States of America"],
    ["156", "CHN", "China"],
    ["036", "AUS", "Australia"],
    ["076", "BRA", "Brazil"],
  ]) {
    assert.equal(countryForGeography(id)?.code, code);
    assert.equal(
      countries.find((country) => String(country.id).padStart(3, "0") === id)
        ?.properties.name,
      name,
    );
  }
  assert.equal(countryForGeography(36)?.code, "AUS");
  assert.equal(countryForGeography(undefined), undefined);
  assert.ok(
    tradeCountries.filter((country) =>
      countries.some(
        (shape) => String(shape.id).padStart(3, "0") === country.numericCode,
      ),
    ).length >= 16,
  );
});
test("direction filters include dual-direction trade and combine with regions", () => {
  assert.equal(filterTradeCountries("all").length, 18);
  assert.equal(filterTradeCountries("export").length, 14);
  assert.equal(filterTradeCountries("import").length, 13);
  assert.equal(filterTradeCountries("both").length, 9);
  assert.equal(filterTradeCountries("import", "Europe").length, 0);
  assert.equal(filterTradeCountries("all", "Middle East").length, 4);
});
test("coverage counts include Oceania and reconcile with the country list", () => {
  assert.equal(continentCount, 6);
  assert.equal(regionStats.length, 5);
  assert.equal(
    regionStats.reduce((total, region) => total + region.countries, 0),
    18,
  );
  assert.ok(
    Math.abs(
      regionStats.reduce((total, region) => total + region.percentage, 0) - 100,
    ) < 0.2,
  );
  assert.equal(
    regionStats.find((region) => region.name === "Oceania")?.countries,
    1,
  );
  assert.equal(
    regionStats.find((region) => region.name === "Southeast & East Asia")
      ?.countries,
    6,
  );
});
test("tooltip position stays bounded at mobile and desktop edges", () => {
  for (const [width, height] of [
    [280, 240],
    [900, 460],
  ]) {
    for (const [x, y] of [
      [-50, -50],
      [0, 0],
      [width, height],
    ]) {
      const position = tooltipPosition(x, y, width, height);
      assert.ok(position.left >= 8 && position.top >= 8);
      assert.ok(position.left + 264 <= width - 8);
      assert.ok(position.top + 200 <= height);
    }
  }
});
