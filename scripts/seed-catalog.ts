import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";
import { CATEGORIES } from "../lib/constants";

const client = getCliClient({ apiVersion: "2024-01-01" }).withConfig({
  useCdn: false,
  perspective: "published",
});
const products = [
  {
    name: "Basmati Rice 1121",
    slug: "basmati-rice-1121",
    category: "agriculture",
    hsCode: "1006.30.20",
    tradeType: "export",
    originCountry: "India",
    image: "home/food-beverages.jpg",
    imageAlt: "Illustrative rice and food ingredients",
    specifications: [
      { key: "Variety", value: "1121 Basmati (sample)" },
      { key: "Grain length", value: "8.3 mm+ (indicative)" },
      { key: "Moisture", value: "Below 12% (indicative)" },
    ],
    moq: "1 FCL / 25 MT (indicative)",
    packaging: "25 / 50 kg bags, subject to agreement",
  },
  {
    name: "Cumin Seeds",
    slug: "cumin-seeds",
    category: "agriculture",
    hsCode: "0909.31.00",
    tradeType: "export",
    originCountry: "India",
    image: "home/agriculture.jpg",
    imageAlt: "Illustrative agricultural field, not a product photograph",
    specifications: [
      { key: "Form", value: "Whole seeds" },
      { key: "Grade", value: "To buyer specification" },
      { key: "Quality checks", value: "Sample approval required" },
    ],
    moq: "1000 kg (indicative)",
    packaging: "Food-grade bags, subject to agreement",
  },
  {
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    category: "agriculture",
    hsCode: "0910.30.00",
    tradeType: "export",
    originCountry: "India",
    image: "home/agriculture.jpg",
    imageAlt: "Illustrative agricultural sourcing photograph, not turmeric",
    specifications: [
      { key: "Form", value: "Powder" },
      { key: "Curcumin content", value: "To be agreed after testing" },
      { key: "Quality checks", value: "Batch sample approval required" },
    ],
    moq: "1000 kg (indicative)",
    packaging: "Food-grade lined bags, subject to agreement",
  },
  {
    name: "Cotton Yarn 30s",
    slug: "cotton-yarn-30s",
    category: "textiles",
    hsCode: "5205.11.00",
    tradeType: "export",
    originCountry: "India",
    image: "home/textiles.jpg",
    imageAlt: "Illustrative woven textiles, not the offered yarn",
    specifications: [
      { key: "Material", value: "Cotton (sample)" },
      { key: "Count", value: "30s, subject to confirmation" },
      { key: "Application", value: "To buyer specification" },
    ],
    moq: "1000 kg (indicative)",
    packaging: "Cones and cartons, subject to agreement",
  },
  {
    name: "Industrial Dyes",
    slug: "industrial-dyes",
    category: "chemicals",
    hsCode: "3204.11.00",
    tradeType: "both",
    originCountry: "India",
    image: "home/chemicals.jpg",
    imageAlt: "Illustrative laboratory equipment, not the offered dye",
    specifications: [
      { key: "Product class", value: "To application specification" },
      { key: "Color", value: "To buyer requirement" },
      { key: "Documentation", value: "Request current safety data sheet" },
    ],
    moq: "1000 kg (indicative)",
    packaging: "Sealed industrial drums, subject to agreement",
  },
  {
    name: "Water Pumps",
    slug: "water-pumps",
    category: "machinery",
    hsCode: "8413.70.00",
    tradeType: "import",
    originCountry: "China",
    image: "home/industrial-machinery.jpg",
    imageAlt: "Illustrative industrial facility, not the offered pump",
    specifications: [
      { key: "Pump type", value: "To application requirement" },
      { key: "Capacity", value: "To be specified by buyer" },
      { key: "Motor rating", value: "Subject to selected model" },
    ],
    moq: "10 units (indicative)",
    packaging: "Export crates, subject to agreement",
  },
  {
    name: "Green Tea",
    slug: "green-tea",
    category: "food-beverages",
    hsCode: "0902.10.00",
    tradeType: "import",
    originCountry: "Thailand",
    image: "home/agriculture.jpg",
    imageAlt: "Illustrative agricultural sourcing photograph, not tea",
    specifications: [
      { key: "Type", value: "Green tea (sample)" },
      { key: "Grade", value: "Subject to sample approval" },
      { key: "Shelf life", value: "Confirm with supplier" },
    ],
    moq: "500 kg (indicative)",
    packaging: "Food-grade sealed packs, subject to agreement",
  },
  {
    name: "Granite Slabs",
    slug: "granite-slabs",
    category: "minerals",
    hsCode: "6802.23.00",
    tradeType: "export",
    originCountry: "India",
    image: "trade-port.jpg",
    imageAlt: "Illustrative port handling photograph, not granite slabs",
    specifications: [
      { key: "Material", value: "Natural granite (sample)" },
      { key: "Finish", value: "To buyer selection" },
      { key: "Thickness", value: "To buyer specification" },
    ],
    moq: "1 container (indicative)",
    packaging: "Export frames or crates, subject to agreement",
  },
];

async function seed() {
  const categoryIds = new Map<string, string>();
  for (const [index, category] of CATEGORIES.entries()) {
    let existing = await client.fetch<{ _id: string } | null>(
      '*[_type == "category" && slug.current == $slug][0]{_id}',
      { slug: category.slug },
    );
    if (!existing)
      existing = await client.create({
        _type: "category",
        name: category.name,
        slug: { _type: "slug", current: category.slug },
        icon: category.icon,
        order: index,
        description: `Products in the ${category.name} sector.`,
      });
    categoryIds.set(category.slug, existing._id);
    console.log(`Category ready: ${category.name}`);
  }
  const assets = new Map<string, string>();
  async function assetFor(file: string) {
    const cached = assets.get(file);
    if (cached) return cached;
    const asset = await client.assets.upload(
      "image",
      createReadStream(resolve("public", file)),
      { filename: file.split("/").pop() },
    );
    assets.set(file, asset._id);
    return asset._id;
  }
  for (const [index, product] of products.entries()) {
    const existing = await client.fetch<string | null>(
      '*[_type == "product" && slug.current == $slug][0]._id',
      { slug: product.slug },
    );
    if (existing) {
      console.log(`Skipped existing product: ${product.name}`);
      continue;
    }
    const mainAsset = await assetFor(product.image);
    const secondaryAsset = await assetFor("about/warehouse.jpg");
    await client.create({
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      category: { _type: "reference", _ref: categoryIds.get(product.category) },
      hsCode: product.hsCode,
      tradeType: product.tradeType,
      shortDescription: `Sample ${product.name.toLowerCase()} listing. Confirm specifications and availability with our team.`,
      description: `This is demonstration content for ${product.name}. Product origin, HS classification, specifications, quantities, and packaging are indicative and require verification. Images show illustrative sector and logistics scenes, not the actual product. No product certification is claimed.`,
      images: [
        {
          _type: "image",
          _key: randomUUID(),
          asset: { _type: "reference", _ref: mainAsset },
          alt: product.imageAlt,
        },
        {
          _type: "image",
          _key: randomUUID(),
          asset: { _type: "reference", _ref: secondaryAsset },
          alt: "Illustrative warehouse and storage operations, not a company facility",
        },
      ],
      specifications: product.specifications.map((spec) => ({
        _type: "specification",
        _key: randomUUID(),
        ...spec,
      })),
      certifications: [],
      moq: product.moq,
      packaging: product.packaging,
      originCountry: product.originCountry,
      originFlag:
        product.originCountry === "India"
          ? "🇮🇳"
          : product.originCountry === "China"
            ? "🇨🇳"
            : "🇹🇭",
      isFeatured: index < 3,
      isSample: true,
    });
    console.log(`Created sample product: ${product.name}`);
  }
  console.log(
    "Catalog seed complete. Existing documents were not overwritten.",
  );
}

seed().catch((error) => {
  console.error(error instanceof Error ? error.message : "Catalog seed failed");
  process.exitCode = 1;
});
