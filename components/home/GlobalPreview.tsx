"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { COMPANY } from "@/lib/constants";

const india: [number, number] = [78.96, 20.59];
const regions: {
  name: string;
  percentage: number;
  countries: string[];
  coordinates: [number, number];
  color: string;
}[] = [
  {
    name: "Middle East",
    percentage: 35,
    countries: ["UAE", "Saudi Arabia", "Qatar", "Oman"],
    coordinates: [52, 25],
    color: "#e4bc66",
  },
  {
    name: "Europe",
    percentage: 25,
    countries: ["UK", "Germany", "Netherlands", "France"],
    coordinates: [10, 50],
    color: "#38bdf8",
  },
  {
    name: "Southeast Asia",
    percentage: 20,
    countries: ["Singapore", "Malaysia", "Thailand", "Vietnam"],
    coordinates: [106, 5],
    color: "#34d399",
  },
  {
    name: "Americas & Africa",
    percentage: 20,
    countries: ["USA", "Brazil", "South Africa", "Kenya"],
    coordinates: [-75, 15],
    color: "#fb7185",
  },
];

export default function GlobalPreview() {
  const [selected, setSelected] = useState(0);
  return (
    <section
      aria-label="Global trade network"
      className="overflow-hidden bg-navy-900 px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Global Presence"
          title={`Trading Across ${COMPANY.countries}+ Countries`}
          description="From our base in India, connections across continents bring sourcing and delivery closer together."
          light
        />
        <figure className="mx-auto max-w-5xl">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 155, center: [10, 5] }}
            width={800}
            height={400}
            role="img"
            aria-label={`World map showing India and ${regions[selected].name}`}
            className="h-auto w-full"
          >
            <Geographies geography="/home/world-countries.json">
              {({ geographies }) =>
                geographies
                  .filter((geography) => geography.id !== "010")
                  .map((geography) => (
                    <Geography
                      key={geography.rsmKey}
                      geography={geography}
                      fill="#29445c"
                      stroke="#0a1628"
                      strokeWidth={0.5}
                    />
                  ))
              }
            </Geographies>
            {regions.map((region, index) => (
              <Line
                key={region.name}
                from={india}
                to={region.coordinates}
                stroke={region.color}
                strokeWidth={selected === index ? 2 : 0.8}
                strokeDasharray="4 4"
                opacity={selected === index ? 1 : 0.4}
              />
            ))}
            <Line
              from={india}
              to={[25, -15]}
              stroke="#fb7185"
              strokeWidth={selected === 3 ? 2 : 0.8}
              strokeDasharray="4 4"
              opacity={selected === 3 ? 1 : 0.4}
            />
            {regions.map((region, index) => (
              <Marker key={region.name} coordinates={region.coordinates}>
                <circle
                  r={selected === index ? 6 : 4}
                  fill={region.color}
                  stroke="#0a1628"
                  strokeWidth={2}
                />
              </Marker>
            ))}
            <Marker coordinates={[25, -15]}>
              <circle r={4} fill="#fb7185" />
            </Marker>
            <Marker coordinates={india}>
              <circle r={7} fill="#e4bc66" stroke="#ffffff" strokeWidth={2} />
              <text textAnchor="middle" y={-14} fill="#ffffff" fontSize={14}>
                India
              </text>
            </Marker>
          </ComposableMap>
          <figcaption
            aria-live="polite"
            className="min-h-14 text-center text-sm leading-6 text-gray-300"
          >
            <span className="font-semibold text-white">
              {regions[selected].name}
            </span>{" "}
            · {regions[selected].countries.join(", ")}
          </figcaption>
        </figure>
        <div
          aria-label="Trade regions"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {regions.map((region, index) => (
            <button
              type="button"
              key={region.name}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`rounded-lg border p-5 text-left transition-colors ${selected === index ? "border-gold-400 bg-navy-800" : "border-navy-700 hover:bg-navy-800/70"}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <span className="font-heading text-2xl text-white">
                  {region.percentage}%
                </span>
              </span>
              <span className="mt-3 block font-semibold text-white">
                {region.name}
              </span>
              <span className="mt-2 block text-xs leading-6 text-gray-400">
                {region.countries.join(", ")}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/global-reach"
            className="inline-flex items-center gap-2 rounded-md border border-gold-400 px-6 py-3.5 font-semibold text-gold-300 hover:bg-gold-500 hover:text-navy-950"
          >
            Explore Our Global Reach <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
