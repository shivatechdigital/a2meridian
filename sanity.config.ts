"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { canCreateType, canUseDocumentAction } from "./sanity/singleton-policy";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "A2 Meridian Associates",
  basePath: "/",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    ...schema,
    templates: (previous) =>
      previous.filter((template) => canCreateType(template.schemaType)),
  },
  document: {
    newDocumentOptions: (previous) =>
      previous.filter((option) => canCreateType(option.templateId)),
    actions: (previous, context) =>
      previous.filter((action) =>
        canUseDocumentAction(context.schemaType, action.action),
      ),
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
  ],
});
