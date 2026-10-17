import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";
import { contentImage } from "../fields";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  description:
    "Public website settings. Never store secrets or private staff contact details here.",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      initialValue: "A2 Meridian Associates",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      initialValue: "Global Import & Export",
    }),
    contentImage("logo", "Company Logo"),
    contentImage("logoDark", "Logo for Dark Backgrounds"),
    contentImage("favicon", "Favicon"),
    defineField({
      name: "address",
      title: "Head Office Address",
      type: "text",
      rows: 3,
      initialValue:
        "Palm Olympia, Gaur City 2, Greater Noida, Uttar Pradesh, India",
    }),
    defineField({
      name: "phone",
      title: "Public Phone Number",
      type: "string",
      validation: (rule) =>
        rule.regex(/^\+?[0-9() .-]{7,25}$/, { name: "phone number" }),
    }),
    defineField({
      name: "email",
      title: "Public Email Address",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      description:
        "Country code and digits, optional leading plus. Never use a placeholder.",
      validation: (rule) =>
        rule.regex(/^\+?[1-9]\d{7,14}$/, {
          name: "international WhatsApp number",
        }),
    }),
    defineField({
      name: "socialLinks",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: ["linkedin", "twitter", "facebook", "instagram", "youtube"].map(
        (name) =>
          defineField({
            name,
            type: "url",
            validation: (rule) => rule.uri({ scheme: ["https"] }),
          }),
      ),
    }),
    defineField({
      name: "operatingHours",
      title: "Operating Hours",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "weekdays",
          title: "Monday - Friday",
          type: "string",
          initialValue: "9:00 AM - 7:00 PM IST",
        }),
        defineField({
          name: "saturday",
          title: "Saturday",
          type: "string",
          initialValue: "9:00 AM - 7:00 PM IST",
        }),
        defineField({
          name: "sunday",
          title: "Sunday",
          type: "string",
          initialValue: "Closed",
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Copyright Template",
      type: "string",
      initialValue:
        "Copyright {year} A2 Meridian Associates. All rights reserved.",
      description:
        "The future website adapter will replace {year}; do not hardcode an outdated year.",
    }),
    defineField({ name: "footerDescription", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "companyName", media: "logo" } },
});
