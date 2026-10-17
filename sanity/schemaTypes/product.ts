import { defineArrayMember, defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons/Package";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 100 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hsCode",
      title: "HS Code",
      type: "string",
      description:
        "Confirm classification for the product and destination. Example: 1006.30.20",
      validation: (rule) => rule.regex(/^[\d.\s-]+$/, { name: "HS code" }),
    }),
    defineField({
      name: "tradeType",
      type: "string",
      initialValue: "export",
      options: {
        list: [
          { title: "Export", value: "export" },
          { title: "Import", value: "import" },
          { title: "Import & Export", value: "both" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || ["export", "import", "both"].includes(value)
              ? true
              : "Choose import, export, or both",
          ),
    }),
    defineField({
      name: "shortDescription",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({ name: "originCountry", type: "string" }),
    defineField({
      name: "originFlag",
      title: "Origin Flag Emoji",
      type: "string",
    }),
    defineField({
      name: "specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "specification",
          fields: [
            defineField({
              name: "key",
              title: "Parameter",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "key", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "certifications",
      type: "array",
      description:
        "Only list product credentials supported by current documentation.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          "APEDA",
          "FSSAI",
          "ISO 9001",
          "ISO 22000",
          "HACCP",
          "Organic",
          "Halal",
          "Kosher",
          "Phytosanitary",
          "SGS",
        ],
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "moq",
      title: "Minimum Order Quantity",
      type: "string",
    }),
    defineField({
      name: "packaging",
      title: "Packaging Details",
      type: "string",
    }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({
      name: "isSample",
      title: "Sample / illustrative listing",
      type: "boolean",
      initialValue: false,
      description:
        "Keep enabled for demonstration content until all product details are verified.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "hsCode", media: "images.0" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `HS: ${subtitle}` : "No HS code",
        media,
      };
    },
  },
});
