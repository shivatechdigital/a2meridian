import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";

export default defineType({
  name: "officeLocation", title: "Office Location", type: "object", icon: PinIcon,
  fields: [
    defineField({ name: "name", title: "Office Name", type: "string", validation: rule => rule.required() }),
    defineField({ name: "isHeadquarters", title: "Headquarters", type: "boolean", initialValue: false }),
    defineField({ name: "address", title: "Full Address", type: "text", rows: 3, validation: rule => rule.required() }),
    defineField({ name: "city", type: "string", validation: rule => rule.required() }),
    defineField({ name: "country", type: "string", validation: rule => rule.required() }),
    defineField({ name: "phone", type: "string", validation: rule => rule.regex(/^\+?[0-9() .-]{7,25}$/, { name: "phone number" }) }),
    defineField({ name: "email", type: "string", validation: rule => rule.email() }),
    defineField({ name: "latitude", type: "number", validation: rule => rule.min(-90).max(90) }),
    defineField({ name: "longitude", type: "number", validation: rule => rule.min(-180).max(180) }),
  ], validation: rule => rule.custom(value => Boolean(value?.latitude !== undefined) === Boolean(value?.longitude !== undefined) ? true : "Provide both latitude and longitude, or leave both empty"),
  preview: { select: { title: "name", subtitle: "city" } },
});