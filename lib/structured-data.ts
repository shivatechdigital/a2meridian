import { COMPANY } from "./constants";
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo";
import type { CatalogProduct } from "./catalog-types";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
export function organizationGraph() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: "Palm Olympia, Gaur City 2",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "A2 Meridian",
        url: SITE_URL,
        logo: absoluteUrl("/logo.png"),
        image: absoluteUrl("/og-image.jpg"),
        description: DEFAULT_DESCRIPTION,
        email: COMPANY.email,
        address,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:00",
            closes: "19:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
export function breadcrumbData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
export function productData(product: CatalogProduct, images: string[] = []) {
  if (product.isSample) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${encodeURIComponent(product.slug)}#product`),
    name: product.name,
    description: product.description,
    url: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
    image: images,
    category: product.categoryName,
    ...(product.originCountry
      ? { countryOfOrigin: { "@type": "Country", name: product.originCountry } }
      : {}),
    ...(product.hsCode
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "HS Code",
              value: product.hsCode,
            },
          ],
        }
      : {}),
  };
}
