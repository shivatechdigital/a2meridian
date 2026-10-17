import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import { contentImage } from "../fields";

export default defineType({
  name: "certification", title: "Certification", type: "document", icon: DocumentIcon,
  description: "Only upload public-approved certificates. File assets are not private merely because the form is in Studio.",
  fields: [
    defineField({ name: "name", title: "Certification Name", type: "string", validation: rule => rule.required() }),
    defineField({ name: "issuer", title: "Issuing Authority", type: "string", description: "ISO itself does not issue company certificates; name the certification body.", validation: rule => rule.required() }),
    defineField({ name: "certificateNumber", type: "string" }), defineField({ name: "issueDate", type: "date", validation: rule => rule.required() }),
    defineField({ name: "expiryDate", type: "date", validation: rule => rule.custom((value, context) => { const issued = (context.document as { issueDate?: string } | undefined)?.issueDate; return !value || !issued || value >= issued ? true : "Expiry date cannot precede issue date"; }) }),
    defineField({ name: "description", type: "text", rows: 3 }), contentImage("badge", "Badge / Logo"),
    defineField({ name: "document", title: "Public Certificate PDF", type: "file", options: { accept: "application/pdf" }, description: "Upload only a redacted, public-approved PDF. This is not confidential document storage." }),
    defineField({ name: "category", type: "string", options: { list: ["quality", "food-safety", "export-license", "environmental", "industry-specific", "other"] } }),
    defineField({ name: "isActive", title: "Approved for Display", type: "boolean", initialValue: false, description: "An editorial flag, not proof of current validity. Frontend must also check dates and evidence." }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 0, validation: rule => rule.integer().min(0) }),
  ], preview: { select: { title: "name", subtitle: "issuer", media: "badge", active: "isActive" }, prepare({ title, subtitle, media, active }) { return { title, subtitle: `${active ? "Display approved" : "Review required"} - ${subtitle || "Issuer pending"}`, media }; } },
});