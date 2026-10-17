import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { CATEGORIES } from "@/lib/constants";

const productCounts = [120, 85, 60, 45, 35, 90];
const imageNames = [
  "agriculture",
  "textiles",
  "chemicals",
  "industrial-machinery",
  "mineral-pyrite",
  "food-beverages",
];
const descriptions = [
  "Crops growing in an agricultural field",
  "Folded fabric and draped textiles",
  "Laboratory equipment for chemical research",
  "Industrial processing plant with towers and pipework",
  "Pyrite mineral specimen from the Huanzala Mine in Peru",
  "Rice and food ingredients",
];

export default function ProductPreview() {
  return (
    <section
      aria-label="Product portfolio"
      className="bg-white px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Our Products"
          title="Diverse Product Portfolio"
          description="Six sectors. A shared commitment to thoughtful sourcing and quality."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.slug} delay={(index % 3) * 0.08}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative isolate block aspect-[4/3] overflow-hidden rounded-lg bg-navy-900 focus-visible:outline-offset-4"
              >
                <Image
                  src={`/home/${imageNames[index]}.jpg`}
                  alt={descriptions[index]}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105"
                />
                <span className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950/95 via-navy-950/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <span>
                    <span className="block font-heading text-2xl font-bold text-white">
                      {category.name}
                    </span>
                    <span className="mt-2 block text-sm font-medium text-gold-300">
                      {productCounts[index]}+ Products
                    </span>
                  </span>
                  <ArrowRight
                    className="size-6 shrink-0 text-gold-300 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-gray-500">
          Mineral photo:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Pyrite-278315.jpg"
            className="underline underline-offset-2"
          >
            Rob Lavinsky, iRocks.com
          </a>
          ,{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            className="underline underline-offset-2"
          >
            CC BY-SA 3.0
          </a>
          . Cropped for display.
        </p>
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-6 py-3.5 font-semibold text-white hover:bg-navy-700"
          >
            View All Products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
