import { defineArrayMember, defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { contentImage } from "../fields";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heroTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroSubtitle", type: "text", rows: 2 }),
    contentImage("heroImage", "Hero Background"),
    defineField({
      name: "offices",
      title: "Office Locations",
      type: "array",
      of: [defineArrayMember({ type: "officeLocation" })],
      validation: (rule) =>
        rule.custom((value) =>
          (value || []).filter(
            (office) => (office as { isHeadquarters?: boolean }).isHeadquarters,
          ).length <= 1
            ? true
            : "Only one office can be headquarters",
        ),
    }),
    defineField({
      name: "formSettings",
      title: "Contact Form Settings",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "title",
          type: "string",
          initialValue: "Send Us an Inquiry",
        }),
        defineField({ name: "description", type: "text", rows: 2 }),
        defineField({
          name: "notificationEmail",
          title: "Notification Email (Informational)",
          type: "string",
          description:
            "Public configuration field only. Email delivery remains controlled by server INQUIRY_TO_EMAIL; this value cannot redirect submissions.",
          validation: (rule) => rule.email(),
        }),
        defineField({
          name: "successMessage",
          type: "text",
          rows: 2,
          initialValue:
            "Thank you. Your inquiry has been accepted for sending. Our team will review your requirements.",
        }),
      ],
    }),
    defineField({
      name: "mapSettings",
      title: "Map Settings",
      type: "object",
      options: { collapsible: true },
      fields: [
        defineField({
          name: "centerLat",
          title: "Verified Latitude",
          type: "number",
          validation: (rule) => rule.min(-90).max(90),
        }),
        defineField({
          name: "centerLng",
          title: "Verified Longitude",
          type: "number",
          validation: (rule) => rule.min(-180).max(180),
        }),
        defineField({
          name: "zoom",
          title: "Zoom Level",
          type: "number",
          initialValue: 12,
          validation: (rule) => rule.integer().min(1).max(21),
        }),
      ],
      validation: (rule) =>
        rule.custom((value) =>
          Boolean(value?.centerLat !== undefined) ===
          Boolean(value?.centerLng !== undefined)
            ? true
            : "Provide both map coordinates, or neither",
        ),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "heroTitle" },
    prepare({ title }) {
      return { title: title || "Contact Page", subtitle: "Contact" };
    },
  },
});
