import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import {
  TRADE_COLORS,
  TRADE_LABELS,
  type CatalogProduct,
} from "@/lib/catalog-types";
import ProductGallery from "./ProductGallery";
import ProductSpecs from "./ProductSpecs";
import ProductCard from "./ProductCard";
import InquiryModal from "@/components/contact/InquiryModal";

export default function ProductDetails({
  product,
  related,
}: {
  product: CatalogProduct;
  related: CatalogProduct[];
}) {
  const categoryUrl = `/products?${new URLSearchParams({ category: product.categorySlug })}`;
  const inquiryUrl = `/contact?${new URLSearchParams({ product: product.name })}`;
  const emailUrl = `mailto:${COMPANY.email}?${new URLSearchParams({ subject: `Inquiry: ${product.name}`, body: `Hello ${COMPANY.name},\n\nI am interested in ${product.name} (HS: ${product.hsCode || "Not supplied"}). Please share pricing, documentation, and availability.` })}`;
  const whatsappAvailable = /^[1-9]\d{7,14}$/.test(COMPANY.whatsapp);
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?${new URLSearchParams({ text: `Hello ${COMPANY.name}, I am interested in ${product.name} (HS: ${product.hsCode || "Not supplied"}). Please share pricing and availability.` })}`;
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap gap-2 text-xs leading-6 text-gray-600"
      >
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        {product.categorySlug && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={categoryUrl}>{product.categoryName}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="break-words text-navy-900">
          {product.name}
        </span>
      </nav>
      <Link
        href="/products"
        className="mb-7 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gold-700"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Products
      </Link>
      {product.isSample && (
        <p className="mb-7 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Sample listing. Images are illustrative sector photographs;
          specifications, origin, HS classification, and commercial terms
          require confirmation before any inquiry is fulfilled.
        </p>
      )}
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <ProductGallery
          key={product._id}
          images={product.images}
          productName={product.name}
        />
        <div className="min-w-0">
          <span
            className={`inline-block rounded px-3 py-1.5 text-xs font-semibold ${TRADE_COLORS[product.tradeType]}`}
          >
            {TRADE_LABELS[product.tradeType]}
          </span>
          <h1 className="mt-4 break-words font-heading text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            {product.hsCode && (
              <span className="break-all font-mono">HS: {product.hsCode}</span>
            )}
            {product.originCountry && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} aria-hidden="true" />
                {product.originFlag} {product.originCountry}
              </span>
            )}
            <span>{product.categoryName}</span>
          </div>
          <section className="my-7">
            <h2 className="font-heading text-xl font-bold text-navy-900">
              Description
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          </section>
          <ProductSpecs
            specifications={product.specifications}
            certifications={product.certifications}
            moq={product.moq}
            packaging={product.packaging}
          />
          <section className="mt-8 border-t border-gray-200 pt-7">
            <h2 className="font-heading text-xl font-bold text-navy-900">
              Interested in This Product?
            </h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappAvailable ? whatsappUrl : emailUrl}
                target={whatsappAvailable ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                {whatsappAvailable ? (
                  <MessageCircle size={18} aria-hidden="true" />
                ) : (
                  <Mail size={18} aria-hidden="true" />
                )}
                {whatsappAvailable
                  ? "Inquire on WhatsApp"
                  : "Email Product Inquiry"}
              </a>
              <Link
                href={inquiryUrl}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-700"
              >
                <Mail size={18} aria-hidden="true" />
                Send Inquiry
              </Link>
              <InquiryModal
                key={product._id}
                productName={product.name}
                hsCode={product.hsCode}
              />
            </div>
          </section>
        </div>
      </div>
      {related.length > 0 && (
        <section
          aria-label="Related products"
          className="mt-16 border-t border-gray-200 pt-12"
        >
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold text-navy-900">
              Related Products
            </h2>
            <Link
              href={categoryUrl}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700"
            >
              View All {product.categoryName}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
