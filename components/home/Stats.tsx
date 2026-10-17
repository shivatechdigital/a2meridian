"use client";

import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { Globe2, Package, Ship, CalendarDays } from "lucide-react";
import { COMPANY } from "@/lib/constants";

const stats = [
  {
    icon: Globe2,
    value: COMPANY.countries,
    label: "Countries",
    detail: "Global trade network",
  },
  {
    icon: Package,
    value: COMPANY.products,
    label: "Products",
    detail: "Across diverse industries",
  },
  {
    icon: Ship,
    value: 10000,
    label: "MT / Year",
    detail: "Annual trade volume",
  },
  {
    icon: CalendarDays,
    value: 2026 - COMPANY.founded,
    label: "Years",
    detail: `Established in ${COMPANY.founded}`,
  },
];

export default function Stats() {
  return (
    <section
      id="trade-overview"
      aria-label="Company at a glance"
      className="scroll-mt-24 bg-navy-900 px-5 py-12 text-white sm:px-8"
    >
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label, detail }) => (
          <div key={label} className="text-center">
            <Icon
              className="mx-auto mb-4 size-6 text-gold-400"
              aria-hidden="true"
            />
            <dt className="text-sm font-semibold">{label}</dt>
            <dd className="mt-2 min-h-12 font-heading text-3xl font-bold tabular-nums text-gold-300 sm:text-4xl">
              <AnimatedNumber value={value} suffix="+" />
            </dd>
            <dd className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm">
              {detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
