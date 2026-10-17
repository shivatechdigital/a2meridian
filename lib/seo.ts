import type { Metadata } from "next";

export const SITE_NAME = "A2 Meridian Associates";
export function normalizeSiteUrl(value = "https://a2meridian.com") {
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) site origin");
  if (url.pathname !== "/" || url.search || url.hash)
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must not contain a path, query, or fragment",
    );
  return url.origin;
}
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const DEFAULT_DESCRIPTION =
  "Import and export sourcing, product inquiries, and trade coordination from A2 Meridian Associates in Greater Noida, India.";
export function absoluteUrl(path: string) {
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Expected a local absolute path");
  return new URL(path, SITE_URL).href;
}

const socialImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} | Import & Export`,
};
export const defaultMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Import & Export`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    "import export company India",
    SITE_NAME,
    "Greater Noida trade",
    "international sourcing",
    "agriculture textiles machinery trade",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Import & Export`,
    description: DEFAULT_DESCRIPTION,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Import & Export`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  options: { noindex?: boolean; image?: string } = {},
): Metadata {
  const fullTitle =
    path === "/" ? `${SITE_NAME} | Import & Export` : `${title} | ${SITE_NAME}`;
  const images = options.image
    ? [{ url: options.image, alt: title }]
    : [socialImage];
  return {
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [options.image || "/og-image.jpg"],
    },
    ...(options.noindex
      ? {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
  };
}

export const pageMetadata = {
  home: createPageMetadata("Home", DEFAULT_DESCRIPTION, "/"),
  about: createPageMetadata(
    "About Us",
    "Explore the story, mission, values, and approach to international trade at A2 Meridian Associates in Greater Noida, India.",
    "/about",
  ),
  products: createPageMetadata(
    "Our Products",
    "Browse the A2 Meridian import and export catalog. Explore product categories, specifications, sourcing information, and inquiry options.",
    "/products",
  ),
  globalReach: createPageMetadata(
    "Global Reach",
    "Explore an illustrative international trade network, country connections, product sectors, and regional coverage with A2 Meridian Associates.",
    "/global-reach",
  ),
  certifications: createPageMetadata(
    "Certifications & Compliance",
    "Understand trade documentation requirements and request current certification and compliance records from A2 Meridian Associates.",
    "/certifications",
  ),
  contact: createPageMetadata(
    "Contact Us",
    "Contact A2 Meridian Associates at Palm Olympia, Gaur City 2, Greater Noida for sourcing, import, export, and product inquiries.",
    "/contact",
  ),
};
export const INDEXABLE_PATHS = [
  "/",
  "/about",
  "/products",
  "/global-reach",
  "/certifications",
  "/contact",
] as const;
