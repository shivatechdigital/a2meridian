import { defineField, defineType } from "sanity";
import { ChartUpwardIcon } from "@sanity/icons/ChartUpward";

export default defineType({
  name: "statItem", title: "Statistics Item", type: "object", icon: ChartUpwardIcon,
  fields: [defineField({ name: "value", title: "Number", type: "number", validation: rule => rule.required().min(0) }), defineField({ name: "suffix", type: "string" }), defineField({ name: "label", type: "string", validation: rule => rule.required() }), defineField({ name: "icon", title: "Icon Emoji", type: "string" }), defineField({ name: "reportingPeriod", title: "Reporting Period / Source", type: "string" }), defineField({ name: "isVerified", title: "Value Verified", type: "boolean", initialValue: false })],
  preview: { select: { title: "label", value: "value", suffix: "suffix" }, prepare({ title, value, suffix }) { return { title, subtitle: `Value: ${value ?? "Pending"}${suffix || ""}` }; } },
});