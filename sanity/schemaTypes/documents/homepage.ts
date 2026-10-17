import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";
import { callToAction, contentImage, textItems } from "../fields";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      validation: (rule) => rule.required(),
      options: { collapsible: true },
      fields: [
        defineField({ name: "badge", type: "string" }),
        defineField({
          name: "title",
          title: "Main Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "highlight",
          title: "Highlighted Word",
          type: "string",
        }),
        defineField({ name: "subtitle", type: "text", rows: 3 }),
        contentImage("backgroundImage", "Background Image"),
        callToAction("ctaPrimary", "Primary Button"),
        callToAction("ctaSecondary", "Secondary Button"),
      ],
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [defineArrayMember({ type: "statItem" })],
    }),
    defineField({
      name: "aboutPreview",
      title: "About Preview",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({ name: "label", title: "Section Label", type: "string" }),
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 4 }),
        contentImage("image", "Image"),
        defineField({
          name: "features",
          type: "array",
          of: [
            defineArrayMember({
              name: "feature",
              type: "object",
              fields: [
                defineField({ name: "icon", type: "string" }),
                defineField({
                  name: "text",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
          ],
        }),
        callToAction("cta", "CTA Button"),
      ],
    }),
    textItems("services", "Trade Services"),
    textItems("reasons", "Why Choose Us"),
    defineField({
      name: "featuredProducts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (rule) => rule.unique().max(12),
    }),
    defineField({
      name: "productCategories",
      title: "Product Category Preview",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "globalPreview",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 3 }),
        callToAction("cta", "Global Reach Button"),
      ],
    }),
    defineField({
      name: "logisticsNames",
      title: "Logistics Ecosystem Names",
      description: "Do not imply a contracted partnership without evidence.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "ctaBanner",
      title: "Bottom CTA Banner",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 2 }),
        contentImage("backgroundImage", "Background Image"),
        callToAction("button", "Button"),
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "hero.title" },
    prepare({ title }) {
      return { title: title || "Homepage", subtitle: "Homepage Content" };
    },
  },
});
