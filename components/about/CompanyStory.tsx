import ImageReveal from "@/components/shared/ImageReveal";
import Link from "next/link";
import {
  ArrowUpRight,
  PackageCheck,
  Globe2,
  Files,
  Handshake,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { COMPANY } from "@/lib/constants";

const highlights = [
  { icon: PackageCheck, label: "Thoughtful sourcing" },
  { icon: Globe2, label: "International outlook" },
  { icon: Files, label: "Documentation support" },
  { icon: Handshake, label: "Lasting relationships" },
];

export default function CompanyStory() {
  return (
    <section aria-label="Company story" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <figure>
            <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-gray-100">
              <ImageReveal
                src="/about/company-office.jpg"
                alt="Illustrative contemporary office building"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="absolute inset-0"
              />
              <div className="absolute bottom-5 right-5 rounded-lg border border-navy-700 bg-navy-900 p-5 text-white shadow-lg">
                <span className="block font-heading text-4xl font-bold text-gold-300">
                  {2026 - COMPANY.founded}+
                </span>
                <span className="mt-1 block text-sm">
                  Years since {COMPANY.founded}
                </span>
              </div>
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-gray-500">
              Illustrative office photograph. Company facility images to be
              confirmed.
            </figcaption>
          </figure>
        </div>
        <ScrollReveal direction="right">
          <p className="mb-4 text-sm font-semibold uppercase text-gold-700">
            Who We Are
          </p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-navy-900">
            A foundation of trust in global trade
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-gray-600">
            <p>
              Founded in {COMPANY.founded},{" "}
              <strong className="font-semibold text-navy-900">
                {COMPANY.name}
              </strong>{" "}
              began with a vision to connect Indian manufacturers and
              international markets.
            </p>
            <p>
              Based at Palm Olympia, Gaur City 2, Greater Noida, our focus spans
              agricultural commodities, textiles, chemicals, machinery,
              minerals, and food products.
            </p>
            <p>
              From understanding a sourcing requirement to coordinating
              documentation and delivery, our approach centers on clear
              communication and long-term business relationships.
            </p>
          </div>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm font-medium text-navy-900"
              >
                <Icon
                  className="size-5 shrink-0 text-gold-700"
                  aria-hidden="true"
                />
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-700 hover:text-navy-900"
          >
            Start a Conversation <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
