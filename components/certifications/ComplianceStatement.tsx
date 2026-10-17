import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { COMPLIANCE_AREAS } from "@/lib/certifications";

export default function ComplianceStatement() {
  return (
    <section
      aria-label="Compliance approach"
      className="bg-navy-900 px-5 py-20 sm:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <ScrollReveal direction="left">
          <p className="mb-4 text-sm font-semibold uppercase text-gold-300">
            Our Commitment
          </p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-white">
            Regulatory Compliance &amp; Trade Integrity
          </h2>
          <p className="mt-6 text-base leading-8 text-gray-300">
            Responsible trade starts with understanding the product, the parties
            involved, and the rules applying to each market. Our approach
            emphasizes clear documentation and early discussion of shipment
            requirements.
          </p>
          <p className="mt-5 text-sm leading-7 text-gray-400">
            The areas listed here are review topics, not an audit opinion or a
            statement that every requirement has been met. Applicability depends
            on the transaction and must be assessed with current records and
            appropriate professional advice.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-white"
          >
            Discuss Documentation <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <h3 className="mb-5 font-heading text-xl font-bold text-white">
            Compliance Areas to Review
          </h3>
          <ul className="divide-y divide-navy-700">
            {COMPLIANCE_AREAS.map((point) => (
              <li key={point} className="flex gap-3 py-4 first:pt-0">
                <ClipboardList
                  className="mt-1 size-5 shrink-0 text-gold-400"
                  aria-hidden="true"
                />
                <span className="text-sm leading-6 text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
