"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

const carriers = [
  "Maersk",
  "MSC",
  "CMA CGM",
  "Hapag-Lloyd",
  "DHL",
  "Kuehne+Nagel",
  "DB Schenker",
  "FedEx Trade",
];

export default function PartnerLogos() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      aria-label="Logistics ecosystem"
      className="overflow-hidden border-y border-gray-200 bg-white py-12"
    >
      <div className="mx-auto mb-8 flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div>
          <h2 className="font-heading text-2xl text-navy-900">
            A Connected Logistics Ecosystem
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            International shipping and freight networks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play carrier marquee" : "Pause carrier marquee"}
          title={paused ? "Play carrier marquee" : "Pause carrier marquee"}
          aria-pressed={paused}
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-300 text-navy-900 hover:bg-gray-100"
        >
          {paused ? (
            <Play size={18} aria-hidden="true" />
          ) : (
            <Pause size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      <ul className="sr-only">
        {carriers.map((carrier) => (
          <li key={carrier}>{carrier}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="carrier-marquee flex w-max"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[0, 1].map((copy) => (
          <div className="flex shrink-0 items-center" key={copy}>
            {carriers.map((carrier) => (
              <span
                key={carrier}
                className="px-8 font-heading text-2xl font-bold text-gray-500 sm:px-12"
              >
                {carrier}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
