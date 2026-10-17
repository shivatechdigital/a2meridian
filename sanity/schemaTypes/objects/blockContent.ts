import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "blockContent", title: "Rich Text Content", type: "array",
  of: [
    defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Heading 2", value: "h2" }, { title: "Heading 3", value: "h3" }, { title: "Heading 4", value: "h4" }, { title: "Quote", value: "blockquote" }], lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }], marks: {
      decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }, { title: "Underline", value: "underline" }, { title: "Strike", value: "strike-through" }, { title: "Code", value: "code" }],
      annotations: [defineArrayMember({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "href", title: "URL", type: "url", validation: rule => rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }).custom(value => value?.startsWith("//") ? "Use a local path or an explicit HTTP(S) URL" : true) }), defineField({ name: "blank", title: "Open in new tab", type: "boolean", initialValue: false })] })],
    } }),
    defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative Text", type: "string", validation: rule => rule.required() }), defineField({ name: "caption", type: "string" })] }),
  ],
});