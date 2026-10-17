import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { MILESTONES } from "@/lib/about-content";

export default function Timeline() {
  return (
    <section
      aria-label="Company timeline"
      className="bg-white px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Our Journey"
          title="Milestones That Define Us"
          description="The company history supplied for this website, from 2018 to 2024."
        />
        <p className="mx-auto mb-10 max-w-2xl border-l-2 border-gold-500 pl-4 text-sm leading-6 text-gray-600">
          Draft timeline. Registration, certification, and growth milestones are
          awaiting company confirmation and supporting records.
        </p>
        <ol className="relative mx-auto max-w-4xl before:absolute before:bottom-0 before:left-3 before:top-0 before:w-px before:bg-gold-500/60 md:before:left-1/2">
          {MILESTONES.map((milestone, index) => (
            <li
              key={milestone.year}
              className="relative pb-10 pl-10 last:pb-0 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-3 top-2 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-gold-500 md:left-1/2"
              />
              <ScrollReveal
                direction={index % 2 === 0 ? "left" : "right"}
                className={
                  index % 2 === 0
                    ? "md:col-start-1 md:text-right"
                    : "md:col-start-2"
                }
              >
                <time
                  dateTime={milestone.year}
                  className="font-mono text-sm font-semibold text-gold-700"
                >
                  {milestone.year}
                </time>
                <h3 className="mt-2 font-heading text-xl font-bold text-navy-900">
                  {milestone.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {milestone.description}
                </p>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
