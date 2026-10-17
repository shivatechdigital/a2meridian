import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons/Heart";

export default defineType({
  name: "valueItem",
  title: "Core Value",
  type: "object",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "title",
      title: "Value Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "icon", title: "Icon Emoji", type: "string" }),
  ],
  preview: { select: { title: "title" } },
});
