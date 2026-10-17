import { Import, Send, Truck } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

const services = [
  {
    icon: Send,
    title: "Export",
    description:
      "Indian agriculture, textiles, chemicals, and machinery, sourced with care for international markets.",
    accent: "bg-gold-500",
  },
  {
    icon: Import,
    title: "Import",
    description:
      "International sourcing for raw materials, industrial equipment, and specialty products suited to your requirements.",
    accent: "bg-sky-700",
  },
  {
    icon: Truck,
    title: "Logistics Support",
    description:
      "Coordination across freight, customs documentation, warehousing, and delivery, from origin to destination.",
    accent: "bg-emerald-700",
  },
];

export default function WhatWeDo() {
  return (
    <section aria-label="What we do" className="bg-offwhite px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="What We Do"
          title="Comprehensive Trade Solutions"
          description="From sourcing to delivery, a considered approach to every stage of international trade."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map(({ icon: Icon, title, description, accent }, index) => (
            <ScrollReveal key={title} delay={index * 0.1}>
              <article className="group h-full rounded-lg border border-gray-200 bg-white p-7 transition-shadow hover:shadow-md">
                <span
                  className={`mb-6 flex size-12 items-center justify-center rounded-md text-white ${accent}`}
                >
                  <Icon aria-hidden="true" size={24} />
                </span>
                <h3 className="font-heading text-2xl font-bold text-navy-900">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
