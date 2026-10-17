import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  tradeCountries,
  tradeTypeLabels,
  type TradeCountry,
} from "@/lib/countries-data";

const groupedCountries = tradeCountries.reduce<Record<string, TradeCountry[]>>(
  (groups, country) => {
    (groups[country.region] ||= []).push(country);
    return groups;
  },
  {},
);
const textColors = {
  export: "text-emerald-800",
  import: "text-sky-800",
  both: "text-gold-800",
};

export default function CountryList() {
  return (
    <section
      id="country-directory"
      aria-label="Country directory"
      className="scroll-mt-24 bg-offwhite px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Our Network"
          title="Countries & Product Connections"
          description="The complete country and product list supplied for this illustrative trade network. Current relationships and product availability require confirmation."
        />
        <div className="grid items-start gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groupedCountries).map(
            ([region, countries], index) => (
              <ScrollReveal key={region} delay={(index % 3) * 0.06}>
                <div className="mb-2 flex items-center justify-between gap-4 border-b-2 border-gold-500 pb-4">
                  <h3 className="font-heading text-xl font-bold text-navy-900">
                    {region}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {countries?.length}{" "}
                    {countries?.length === 1 ? "country" : "countries"}
                  </span>
                </div>
                {countries?.map((country) => (
                  <details
                    key={country.code}
                    className="group border-b border-gray-300 py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm [&::-webkit-details-marker]:hidden">
                      <span className="flex min-w-0 items-center gap-3">
                        <span aria-hidden="true" className="text-xl">
                          {country.flag}
                        </span>
                        <span>
                          <span className="block font-semibold text-navy-900">
                            {country.name}
                          </span>
                          <span
                            className={`mt-1 block text-xs ${textColors[country.tradeType]}`}
                          >
                            {tradeTypeLabels[country.tradeType]}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        size={17}
                        aria-hidden="true"
                        className="shrink-0 text-gray-500 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <ul
                      aria-label={`${country.name} products`}
                      className="mt-4 flex flex-wrap gap-2 pl-9"
                    >
                      {country.products.map((product) => (
                        <li
                          key={product}
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs leading-5 text-gray-700"
                        >
                          {product}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </ScrollReveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
