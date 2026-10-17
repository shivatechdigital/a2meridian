import type { StructureResolver } from "sanity/structure";
import { HomeIcon } from "@sanity/icons/Home";
import { CogIcon } from "@sanity/icons/Cog";
import { PackageIcon } from "@sanity/icons/Package";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { SINGLETON_PAGES } from "./singleton-policy";
import InquiryPrivacyNotice from "./components/InquiryPrivacyNotice";

export const structure: StructureResolver = S => S.list().title("A2 Meridian Admin").items([
  S.listItem().id("pages").title("Pages").icon(HomeIcon).child(S.list().title("Pages").items(SINGLETON_PAGES.map(page => S.listItem().id(page.type).title(page.title).schemaType(page.type).child(S.document().schemaType(page.type).documentId(page.id).title(page.title)))) ,
  S.divider(),
  S.listItem().id("catalog").title("Products").icon(PackageIcon).child(S.list().title("Products").items([S.documentTypeListItem("product").title("All Products"), S.documentTypeListItem("category").title("Categories")])),
  S.divider(),
  S.documentTypeListItem("certification").title("Certifications").icon(DocumentTextIcon),
  S.divider(),
  S.listItem().id("inquiries").title("Inquiries - Setup Required").icon(EnvelopeIcon).child(S.component().id("inquiry-privacy").title("Inquiry Privacy").component(InquiryPrivacyNotice)),
  S.divider(),
  S.listItem().id("siteSettings").title("Site Settings").icon(CogIcon).schemaType("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")),
]);
