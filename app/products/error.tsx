"use client";

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-heading text-3xl font-bold text-navy-900">
        Catalog Temporarily Unavailable
      </h1>
      <p className="mt-5 text-gray-600">
        We could not load the product information. Please try again or contact
        our team.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 rounded-md bg-gold-500 px-6 py-3 font-semibold text-navy-950"
      >
        Try Again
      </button>
    </section>
  );
}
