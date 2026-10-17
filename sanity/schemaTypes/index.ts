import { type SchemaTypeDefinition } from "sanity";
import category from "./category";
import product from "./product";
import seo from "./objects/seo";
import blockContent from "./objects/blockContent";
import teamMember from "./objects/teamMember";
import timelineItem from "./objects/timelineItem";
import countryEntry from "./objects/countryEntry";
import officeLocation from "./objects/officeLocation";
import statItem from "./objects/statItem";
import valueItem from "./objects/valueItem";
import siteSettings from "./documents/siteSettings";
import homepage from "./documents/homepage";
import aboutPage from "./documents/aboutPage";
import globalReachPage from "./documents/globalReachPage";
import certification from "./documents/certification";
import contactPage from "./documents/contactPage";
import inquiry from "./documents/inquiry";

export const schemaTypes: SchemaTypeDefinition[] = [seo, blockContent, teamMember, timelineItem, countryEntry, officeLocation, statItem, valueItem, siteSettings, homepage, aboutPage, globalReachPage, certification, contactPage, inquiry, category, product];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
