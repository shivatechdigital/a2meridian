import { Target, Eye } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

export default function MissionVision() {
  return (
    <section
      aria-label="Mission and vision"
      className="bg-navy-900 px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle subtitle="Our Purpose" title="Mission & Vision" light />
        <div className="grid gap-10 md:grid-cols-2">
          <ScrollReveal
            direction="left"
            className="border-t border-gold-500/60 pt-7"
          >
            <Target className="mb-5 size-8 text-gold-400" aria-hidden="true" />
            <h3 className="font-heading text-2xl font-bold text-white">
              Our Mission
            </h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-gray-300">
              To make international trade more accessible through quality
              sourcing, competitive pricing, and dependable supply-chain
              coordination, guided by integrity and attention to compliance.
            </p>
          </ScrollReveal>
          <ScrollReveal
            direction="right"
            className="border-t border-sky-400/60 pt-7"
          >
            <Eye className="mb-5 size-8 text-sky-300" aria-hidden="true" />
            <h3 className="font-heading text-2xl font-bold text-white">
              Our Vision
            </h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-gray-300">
              To build enduring global partnerships and work toward a network
              connecting 50+ countries by 2030, making geographical boundaries
              less of a barrier to quality commerce and shared growth.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
