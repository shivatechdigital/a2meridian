import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import MapExplorer from "@/components/map/MapExplorer";
import RegionStats from "@/components/map/RegionStats";
import CountryList from "@/components/map/CountryList";
import TradeProcess from "@/components/map/TradeProcess";
import {
  continentCount,
  regionStats,
  tradeCountries,
} from "@/lib/countries-data";

export const metadata: Metadata = pageMetadata.globalReach;

export default function GlobalReachPage() {
  return (
    <div className="overflow-x-clip">
      <section
        aria-labelledby="global-reach-title"
        className="relative isolate flex min-h-[calc(65svh-5rem)] items-center overflow-hidden bg-navy-950 px-5 py-16 sm:px-8"
      >
        <Image
          src="/trade-port.jpg"
          alt="Containers and international cargo operations at a port"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/70" />
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase text-gold-300">
              A2 Meridian Associates · Worldwide Connections
            </p>
            <h1
              id="global-reach-title"
              className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl"
            >
              Our Global Reach
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200">
              From Greater Noida to international markets. A network of sourcing
              possibilities, product connections, and shared opportunity.
            </p>
            <a
              href="#trade-map"
              className="mt-7 inline-flex rounded-md border border-gold-400 px-5 py-3 text-sm font-semibold text-gold-300 hover:bg-gold-500 hover:text-navy-950"
            >
              Explore the Network
            </a>
          </ScrollReveal>
        </div>
      </section>
      <section
        id="trade-map"
        aria-label="Interactive trade network"
        className="scroll-mt-24 bg-navy-900 px-5 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            subtitle="International Connections"
            title="Where We Trade"
            description="An illustrative network of countries and product sectors, supplied for review. Trade relationships and volumes are not independently verified."
            light
          />
          <MapExplorer />
          <dl
            aria-label="Mapped network at a glance"
            className="mt-10 grid grid-cols-2 gap-6 border-t border-navy-600 pt-8 text-center sm:grid-cols-4"
          >
            {[
              { label: "Mapped Countries", value: tradeCountries.length },
              { label: "Continents", value: continentCount },
              { label: "Coverage Regions", value: regionStats.length },
              { label: "Trade Directions", value: 3 },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-gray-400">{stat.label}</dt>
                <dd className="mt-2 font-heading text-3xl font-bold text-gold-300">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-center text-xs leading-6 text-gray-400">
            Connections are illustrative, not actual shipping paths.
            Trade-volume and shipment totals are awaiting verified records.
          </p>
        </div>
      </section>
      <RegionStats />
      <CountryList />
      <TradeProcess />
    </div>
  );
}
