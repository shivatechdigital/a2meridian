import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { contentImage } from "../fields";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heroTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroSubtitle", type: "text", rows: 2 }),
    contentImage("heroImage", "Hero Background"),
    defineField({
      name: "story",
      title: "Our Story",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "label",
          type: "string",
          initialValue: "Our Story",
        }),
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "content", type: "blockContent" }),
        contentImage("image", "Side Image"),
      ],
    }),
    ...["mission", "vision"].map((name) =>
      defineField({
        name,
        type: "object",
        options: { collapsible: true },
        fields: [
          defineField({ name: "icon", title: "Icon Emoji", type: "string" }),
          defineField({
            name: "title",
            type: "string",
            initialValue: name === "mission" ? "Our Mission" : "Our Vision",
          }),
          defineField({ name: "content", type: "blockContent" }),
        ],
      }),
    ),
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [defineArrayMember({ type: "valueItem" })],
    }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
      of: [defineArrayMember({ type: "teamMember" })],
    }),
    defineField({
      name: "timeline",
      title: "Company Timeline",
      type: "array",
      of: [defineArrayMember({ type: "timelineItem" })],
    }),
    defineField({
      name: "gallery",
      title: "Office / Operations Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", type: "string" }),
            defineField({
              name: "isIllustrative",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "About Page", subtitle: "About Us" };
    },
  },
});
