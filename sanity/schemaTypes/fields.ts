import { defineField, defineArrayMember } from "sanity";

export function contentImage(name: string, title: string) {
  return defineField({ name, title, type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative Text", type: "string", validation: rule => rule.required() }), defineField({ name: "caption", type: "string" }), defineField({ name: "isIllustrative", title: "Illustrative / Stock Image", type: "boolean", initialValue: false })] });
}
export function callToAction(name: string, title: string) {
  return defineField({ name, title, type: "object", fields: [defineField({ name: "label", type: "string", validation: rule => rule.required() }), defineField({ name: "link", type: "url", validation: rule => rule.required().uri({ allowRelative: true, scheme: ["https", "http", "mailto", "tel"] }).custom(value => value?.startsWith("//") ? "Use an explicit scheme or a local path" : true) })] });
}
export function textItems(name: string, title: string) {
  return defineField({ name, title, type: "array", of: [defineArrayMember({ type: "object", name: "textItem", fields: [defineField({ name: "icon", title: "Icon Emoji", type: "string" }), defineField({ name: "title", type: "string", validation: rule => rule.required() }), defineField({ name: "description", type: "text", rows: 3 })] })] });
}