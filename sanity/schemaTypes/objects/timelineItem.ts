import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons/Calendar";

export default defineType({
  name: "timelineItem",
  title: "Timeline Entry",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "year",
      type: "string",
      description: "For example: 2018 or Q1 2023",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "icon", title: "Icon Emoji", type: "string" }),
    defineField({
      name: "isVerified",
      title: "Supporting Evidence Verified",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
    prepare({ title, subtitle }) {
      return {
        title: `${subtitle || "Year pending"} - ${title || "Milestone"}`,
      };
    },
  },
});
