import type { SanityImageObject } from "@sanity/image-url";

export type TradeType = "import" | "export" | "both";
export type ProductImage = SanityImageObject & { _key: string; alt?: string };
export interface CatalogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  productCount: number;
}
export interface CatalogProduct {
  _id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  hsCode: string | null;
  tradeType: TradeType;
  shortDescription: string | null;
  description: string;
  images: ProductImage[];
  originCountry: string | null;
  originFlag: string | null;
  specifications: { _key: string; key: string; value: string }[];
  certifications: string[];
  moq: string | null;
  packaging: string | null;
  isFeatured: boolean;
  isSample: boolean;
}
export const TRADE_LABELS: Record<TradeType, string> = {
  export: "Export",
  import: "Import",
  both: "Import & Export",
};
export const TRADE_COLORS: Record<TradeType, string> = {
  export: "bg-emerald-800 text-white",
  import: "bg-sky-800 text-white",
  both: "bg-gold-400 text-navy-950",
};
