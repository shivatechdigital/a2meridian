import Image from "next/image";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative isolate flex min-h-[calc(70svh-5rem)] items-center overflow-hidden bg-navy-950 px-5 py-16 sm:px-8"
    >
      <Image
        src="/about/warehouse.jpg"
        alt="Warehouse aisles and international logistics operations"
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-950/70" />
      <div className="mx-auto w-full max-w-7xl">
        <ScrollReveal className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase text-gold-300">
            Our Story
          </p>
          <h1
            id="about-title"
            className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            About A2 Meridian Associates
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
            Rooted in Greater Noida. Connected to the world. We bring people,
            products, and possibilities together through international trade.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
