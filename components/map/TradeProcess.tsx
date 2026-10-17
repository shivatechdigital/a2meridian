import {
  Search,
  FileCheck,
  Ship,
  Warehouse,
  Truck,
  Handshake,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

const steps = [
  {
    icon: Search,
    title: "Sourcing",
    description:
      "Understand product requirements and assess potential suppliers and buyers.",
  },
  {
    icon: FileCheck,
    title: "Documentation",
    description:
      "Review applicable registrations, customs documents, and destination requirements.",
  },
  {
    icon: Ship,
    title: "Shipping",
    description:
      "Coordinate the agreed freight mode, schedule, and shipment updates.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description:
      "Arrange suitable storage and agreed product checks where required.",
  },
  {
    icon: Truck,
    title: "Last Mile",
    description:
      "Plan onward delivery and clarify insurance and handover responsibilities.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "Maintain communication, review outcomes, and build the next opportunity together.",
  },
];

export default function TradeProcess() {
  return (
    <section aria-label="Trade process" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="How We Work"
          title="Our Trade Process"
          description="A considered path from the first conversation to the next partnership."
        />
        <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title}>
              <ScrollReveal
                delay={(index % 3) * 0.08}
                className="h-full border-t border-gray-300 pt-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-gold-700">
                    0{index + 1}
                  </span>
                  <Icon
                    size={24}
                    className="text-navy-600"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
