export const SINGLETON_PAGES = [
  { type: "homepage", title: "Homepage", id: "homepage" },
  { type: "aboutPage", title: "About Us", id: "aboutPage" },
  { type: "globalReachPage", title: "Global Reach", id: "globalReachPage" },
  { type: "contactPage", title: "Contact", id: "contactPage" },
] as const;
export const SINGLETON_TYPES = new Set<string>([
  "siteSettings",
  ...SINGLETON_PAGES.map((page) => page.type),
]);

export function canCreateType(type: string) {
  return !SINGLETON_TYPES.has(type) && type !== "inquiry";
}
export function canUseDocumentAction(type: string, action?: string) {
  if (type === "inquiry") return false;
  return (
    !SINGLETON_TYPES.has(type) ||
    !action ||
    !["delete", "duplicate", "unpublish"].includes(action)
  );
}
