import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export default defineType({
  name: "seo", title: "SEO Settings", type: "object", icon: DocumentTextIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string", validation: rule => rule.max(60).warning("Recommended: at most 60 characters") }),
    defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3, validation: rule => rule.max(160).warning("Recommended: at most 160 characters") }),
    defineField({ name: "keywords", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" }, validation: rule => rule.unique() }),
    defineField({ name: "ogImage", title: "Open Graph Image", type: "image", description: "Recommended: 1200 x 630 pixels", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative Text", type: "string", validation: rule => rule.required() })] }),
    defineField({ name: "ogTitle", title: "OG Title Override", type: "string" }),
    defineField({ name: "ogDescription", title: "OG Description Override", type: "text", rows: 2 }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url", description: "Leave empty for the page URL. Use a verified HTTP(S) URL.", validation: rule => rule.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "noIndex", title: "Hide from Search Engines", type: "boolean", initialValue: false }),
  ],
});