"use client";

import { useSearchParams } from "next/navigation";
import { COMPANY } from "@/lib/constants";

export default function InquiryContext() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("product")?.slice(0, 200);
  const countryName = searchParams.get("country")?.slice(0, 100);
  const name = productName || countryName;
  if (!name) return null;
  const params = new URLSearchParams({
    subject: `${productName ? "Product" : "Market"} inquiry: ${name}`,
    body: productName
      ? `Hello ${COMPANY.name},\n\nI am interested in ${name}. Please share details, pricing, and availability.`
      : `Hello ${COMPANY.name},\n\nI would like to discuss trade opportunities involving ${name}. Please share the relevant product and documentation requirements.`,
  });
  return (
    <section
      aria-label={
        productName ? "Selected product inquiry" : "Selected market inquiry"
      }
      className="mx-auto max-w-4xl px-5 pt-10 sm:px-8"
    >
      <div className="rounded-lg border border-gold-300 bg-gold-50 p-5">
        <p className="text-sm text-gray-600">
          {productName ? "Product of Interest" : "Market of Interest"}
        </p>
        <h2 className="mt-2 break-words font-heading text-2xl text-navy-900">
          {name}
        </h2>
        <a
          href={`mailto:${COMPANY.email}?${params}`}
          className="mt-4 inline-block text-sm font-semibold text-gold-800 underline underline-offset-4"
        >
          {productName
            ? "Email This Product Inquiry"
            : "Email This Market Inquiry"}
        </a>
      </div>
    </section>
  );
}
