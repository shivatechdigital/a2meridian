import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

export default defineType({
  name: "inquiry", title: "Inquiry (Private Storage Required)", type: "document", icon: EnvelopeIcon,
  readOnly: true,
  description: "Disabled in the current public dataset. Schema readOnly and Studio filters are not access control. Configure separate private storage and server permissions before storing personal information or internal notes.",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: rule => rule.required(), readOnly: true }),
    defineField({ name: "email", title: "Email Address", type: "string", validation: rule => rule.required().email(), readOnly: true }),
    ...["phone", "company", "country", "subject"].map(name => defineField({ name, type: "string", readOnly: true })),
    defineField({ name: "message", type: "text", rows: 6, readOnly: true }),
    defineField({ name: "productInterest", title: "Product Reference", type: "reference", to: [{ type: "product" }], readOnly: true }),
    defineField({ name: "productInterestText", title: "Product / Category Text", type: "string", description: "Preserves free-text category interests when no product reference exists.", readOnly: true }),
    defineField({ name: "tradeType", type: "string", options: { list: ["import", "export", "both"] }, readOnly: true }),
    defineField({ name: "source", type: "string", options: { list: ["contact", "product", "homepage"] }, readOnly: true }),
    defineField({ name: "status", type: "string", options: { list: [{ title: "New", value: "new" }, { title: "In Progress", value: "in-progress" }, { title: "Resolved", value: "resolved" }, { title: "Spam", value: "spam" }], layout: "dropdown" }, initialValue: "new" }),
    defineField({ name: "notes", title: "Internal Notes", type: "text", rows: 4, description: "Private storage only. Never enter notes in the public content dataset." }),
    defineField({ name: "submittedAt", type: "datetime", readOnly: true }),
  ], preview: { select: { status: "status", submitted: "submittedAt" }, prepare({ status, submitted }) { return { title: "Inquiry - private storage required", subtitle: `${status || "new"}${submitted ? ` - ${submitted}` : ""}` }; } },
});