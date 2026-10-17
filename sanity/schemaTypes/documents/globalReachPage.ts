import { defineArrayMember, defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { contentImage, textItems } from "../fields";

export default defineType({
  name: "globalReachPage",
  title: "Global Reach Page",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "heroTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroSubtitle", type: "text", rows: 2 }),
    contentImage("heroImage", "Hero Background"),
    defineField({
      name: "introText",
      title: "Introduction",
      type: "blockContent",
    }),
    defineField({
      name: "stats",
      title: "Trade Statistics",
      type: "array",
      of: [defineArrayMember({ type: "statItem" })],
    }),
    defineField({
      name: "countries",
      title: "Trade Countries",
      type: "array",
      of: [defineArrayMember({ type: "countryEntry" })],
      validation: (rule) =>
        rule.custom((value) => {
          const codes = (value || [])
            .map((item) => (item as { countryCode?: string }).countryCode)
            .filter(Boolean);
          return new Set(codes).size === codes.length
            ? true
            : "Each country code must appear only once";
        }),
    }),
    textItems("tradeProcess", "Trade Process Steps"),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "Global Reach", subtitle: "Global Reach Page" };
    },
  },
});
