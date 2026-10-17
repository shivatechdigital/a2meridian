import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="px-5 py-24 text-center">
      <h1 className="font-heading text-3xl font-bold text-navy-900">
        Product Not Found
      </h1>
      <p className="mt-4 text-gray-600">
        This listing is unavailable or has not been published.
      </p>
      <Link
        href="/products"
        className="mt-7 inline-block rounded-md bg-gold-500 px-6 py-3 font-semibold text-navy-950"
      >
        Browse All Products
      </Link>
    </section>
  );
}
