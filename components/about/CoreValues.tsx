import { Heart, Scale, Lightbulb, Handshake } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Honesty, clear expectations, and transparency in our relationships.",
    color: "text-rose-700 bg-rose-50",
  },
  {
    icon: Scale,
    title: "Quality",
    description:
      "Careful specifications and a considered approach to sourcing and shipment checks.",
    color: "text-sky-700 bg-sky-50",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Adapting our approach as markets, technology, and logistics evolve.",
    color: "text-amber-700 bg-amber-50",
  },
  {
    icon: Handshake,
    title: "Reliability",
    description:
      "Consistent communication and accountability throughout the trade process.",
    color: "text-emerald-700 bg-emerald-50",
  },
];

export default function CoreValues() {
  return (
    <section
      aria-label="Core values"
      className="bg-offwhite px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Our Values"
          title="What Drives Us Forward"
          description="The principles behind our decisions and the relationships we build."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description, color }, index) => (
            <ScrollReveal
              key={title}
              delay={index * 0.08}
              className="text-center"
            >
              <span
                className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full ${color}`}
              >
                <Icon size={28} aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl font-bold text-navy-900">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
