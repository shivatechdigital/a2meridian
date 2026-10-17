"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { regionStats, tradeCountries } from "@/lib/countries-data";
import usePrefersReducedMotion from "@/components/shared/usePrefersReducedMotion";
import SectionTitle from "@/components/ui/SectionTitle";

export default function RegionStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reducedMotion = usePrefersReducedMotion();
  return (
    <section
      ref={sectionRef}
      aria-label="Regional network statistics"
      className="bg-navy-950 px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Regional Coverage"
          title="Our Network by Region"
          description="Share of the 18 countries in this illustrative network, not a trade-volume distribution."
          light
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regionStats.map((region) => (
            <article
              key={region.name}
              className="border-t border-navy-600 pt-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p
                  className="font-heading text-3xl font-bold"
                  style={{ color: region.color }}
                >
                  {region.percentage}%
                </p>
                <p className="text-xs text-gray-400">
                  {region.countries} of {tradeCountries.length} countries
                </p>
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-white">
                {region.name}
              </h3>
              <p className="mt-3 min-h-16 text-sm leading-7 text-gray-400">
                {region.description}
              </p>
              <div
                role="meter"
                aria-label={`${region.name} share of mapped countries`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={region.percentage}
                className="mt-5 h-2 overflow-hidden rounded-full bg-navy-700"
              >
                <div
                  data-region-bar={region.name}
                  className="h-full rounded-full transition-[width] duration-1000 motion-reduce:transition-none"
                  style={{
                    backgroundColor: region.color,
                    width:
                      inView || reducedMotion ? `${region.percentage}%` : "0%",
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
