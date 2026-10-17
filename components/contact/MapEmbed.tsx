"use client";

import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function MapEmbed() {
  const [enabled, setEnabled] = useState(false);
  const query = encodeURIComponent(COMPANY.address);
  return (
    <figure>
      <div className="h-[350px] overflow-hidden rounded-lg border border-gray-300 bg-gray-100 sm:h-[400px]">
        {enabled ? (
          <iframe
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            title="Google Maps search near Palm Olympia, Gaur City 2, Greater Noida"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <MapPin
              size={34}
              className="mb-5 text-gold-700"
              aria-hidden="true"
            />
            <h3 className="font-heading text-2xl text-navy-900">
              Palm Olympia, Greater Noida
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-gray-600">
              Loading the map shares connection information with Google. The
              location is an address search, not a verified office pin.
            </p>
            <button
              type="button"
              onClick={() => setEnabled(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-700"
            >
              <MapPin size={17} aria-hidden="true" />
              Load Google Map
            </button>
          </div>
        )}
      </div>
      <figcaption className="mt-4 flex flex-col justify-between gap-3 text-sm leading-6 text-gray-600 sm:flex-row">
        <span>{COMPANY.address}</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-gold-800 underline underline-offset-4"
        >
          Open Directions <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only"> in a new tab</span>
        </a>
      </figcaption>
    </figure>
  );
}
