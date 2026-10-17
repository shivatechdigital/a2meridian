import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageOpen, MapPin } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import {
  TRADE_COLORS,
  TRADE_LABELS,
  type CatalogProduct,
} from "@/lib/catalog-types";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const image = product.images[0];
  return (
    <Link
      href={`/products/${encodeURIComponent(product.slug)}`}
      className="product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-gold-400 hover:shadow-md focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={urlFor(image)
              .width(720)
              .height(540)
              .fit("crop")
              .auto("format")
              .url()}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-gray-400">
            <PackageOpen size={44} aria-label="No product image" />
          </span>
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-semibold ${TRADE_COLORS[product.tradeType]}`}
        >
          {TRADE_LABELS[product.tradeType]}
        </span>
        {product.isSample && (
          <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-xs font-medium text-navy-900">
            Sample listing
          </span>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-md bg-gold-500 text-navy-950 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <ArrowRight size={18} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-gold-700">
          {product.categoryName}
        </p>
        <h2 className="mt-2 break-words font-heading text-xl font-bold text-navy-900">
          {product.name}
        </h2>
        {product.shortDescription && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-gray-200 pt-4 text-xs leading-5 text-gray-600">
            {product.hsCode && (
              <span className="break-all font-mono">HS: {product.hsCode}</span>
            )}
            {product.originCountry && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} aria-hidden="true" />
                {product.originFlag} {product.originCountry}
              </span>
            )}
            {product.moq && <span className="w-full">MOQ: {product.moq}</span>}
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
            View Details <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
