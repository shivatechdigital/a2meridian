import { defineArrayMember, defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";

export const COUNTRY_REGIONS = [
  "middle-east",
  "europe",
  "southeast-asia",
  "east-asia",
  "americas",
  "africa",
  "oceania",
  "south-asia",
];
export default defineType({
  name: "countryEntry",
  title: "Country Trade Entry",
  type: "object",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "countryName",
      title: "Country Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "countryCode",
      title: "ISO Alpha-2 Code",
      type: "string",
      validation: (rule) =>
        rule.required().regex(/^[A-Z]{2}$/, { name: "two uppercase letters" }),
    }),
    defineField({
      name: "alpha3Code",
      title: "ISO Alpha-3 Code",
      type: "string",
      description: "For the existing map adapter, e.g. ARE or USA.",
      validation: (rule) =>
        rule.regex(/^[A-Z]{3}$/, { name: "three uppercase letters" }),
    }),
    defineField({
      name: "numericCode",
      title: "ISO Numeric Code",
      type: "string",
      description:
        "World-atlas polygon ID, e.g. 784 or 036. Preserve leading zeroes.",
      validation: (rule) => rule.regex(/^\d{3}$/, { name: "three digits" }),
    }),
    defineField({ name: "flag", title: "Flag Emoji", type: "string" }),
    defineField({
      name: "region",
      type: "string",
      options: { list: COUNTRY_REGIONS, layout: "dropdown" },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || COUNTRY_REGIONS.includes(value)
              ? true
              : "Choose a listed region",
          ),
    }),
    defineField({
      name: "continent",
      type: "string",
      options: {
        list: [
          "Asia",
          "Europe",
          "Africa",
          "North America",
          "South America",
          "Oceania",
        ],
      },
    }),
    defineField({
      name: "tradeType",
      type: "string",
      options: { list: ["export", "import", "both"], layout: "radio" },
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
      name: "products",
      title: "Key Products",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "volume",
      title: "Trade Volume",
      type: "string",
      description:
        "Use verified values with units and reporting period; not an assumed percentage.",
    }),
    defineField({
      name: "since",
      title: "Trading Since",
      type: "number",
      validation: (rule) => rule.integer().min(1900).max(2200),
    }),
    defineField({
      name: "partners",
      title: "Number of Partners",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "longitude",
      type: "number",
      validation: (rule) => rule.min(-180).max(180),
    }),
    defineField({
      name: "latitude",
      type: "number",
      validation: (rule) => rule.min(-90).max(90),
    }),
    defineField({
      name: "isVerified",
      title: "Trade Relationship Verified",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "countryName", subtitle: "tradeType", flag: "flag" },
    prepare({ title, subtitle, flag }) {
      return {
        title: `${flag || ""} ${title || "Country"}`.trim(),
        subtitle:
          typeof subtitle === "string"
            ? subtitle.toUpperCase()
            : "Trade type pending",
      };
    },
  },
});
