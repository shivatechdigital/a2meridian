import {
  ShieldCheck,
  Clock,
  BadgeDollarSign,
  FileCheck,
  Headphones,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "Quality requirements are considered from sourcing through shipment.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    description:
      "Direct sourcing and clear specifications help balance cost and quality.",
  },
  {
    icon: Clock,
    title: "Delivery Planning",
    description:
      "Coordinated schedules and shipment updates keep your business informed.",
  },
  {
    icon: FileCheck,
    title: "Compliance Support",
    description:
      "Attention to customs documentation and product-specific trade requirements.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "A point of contact for requirements, coordination, and questions along the way.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-label="Why choose A2 Meridian"
      className="bg-offwhite px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Why Choose Us"
          title="The A2 Meridian Advantage"
          description="More than a transaction. A partnership built around your business."
        />
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal
              key={title}
              delay={index * 0.06}
              className="flex gap-4 border-t border-gray-300 py-6"
            >
              <Icon
                aria-hidden="true"
                className="size-6 shrink-0 text-gold-700"
              />
              <div>
                <h3 className="font-heading text-xl font-bold text-navy-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
