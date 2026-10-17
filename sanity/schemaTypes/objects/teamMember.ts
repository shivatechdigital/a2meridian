import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Designation",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({ name: "bio", title: "Short Bio", type: "text", rows: 3 }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "isSample",
      title: "Illustrative Profile",
      type: "boolean",
      initialValue: false,
      description:
        "Do not present stock portraits or unverified identities as real personnel.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
