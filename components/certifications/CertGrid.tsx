import {
  Shield,
  Award,
  Leaf,
  FileCheck,
  Globe2,
  Sprout,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { CERTIFICATIONS } from "@/lib/certifications";
import { COMPANY } from "@/lib/constants";

const icons = [Shield, Award, Leaf, FileCheck, Globe2, Sprout];
const colors = [
  "bg-sky-50 text-sky-700",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-lime-50 text-lime-700",
  "bg-rose-50 text-rose-700",
  "bg-teal-50 text-teal-700",
];

export default function CertGrid() {
  return (
    <section
      aria-label="Certification document types"
      className="bg-offwhite px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Documentation"
          title="Credentials, Clearly Explained"
          description="Company credentials are awaiting documentary verification. Request current records before relying on any registration or certification."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATIONS.map((cert, index) => {
            const Icon = icons[index];
            return (
              <ScrollReveal key={cert.slug} delay={(index % 3) * 0.07}>
                <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
                  <span
                    className={`mb-5 flex size-12 items-center justify-center rounded-md ${colors[index]}`}
                  >
                    <Icon size={25} aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-navy-900">
                    {cert.name}
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-5 text-gold-700">
                    {cert.fullName}
                  </p>
                  <p className="mb-6 mt-4 text-sm leading-7 text-gray-600">
                    {cert.description}
                  </p>
                  <dl className="mt-auto space-y-4 border-t border-gray-200 pt-5 text-sm">
                    <div>
                      <dt className="text-xs text-gray-500">Issuing Body</dt>
                      <dd className="mt-1 leading-6 text-navy-900">
                        {cert.issuingBody}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Scope</dt>
                      <dd className="mt-1 leading-6 text-navy-900">
                        {cert.scope}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs text-gray-500">
                          Certificate No.
                        </dt>
                        <dd className="mt-1 text-gray-700">Not supplied</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Validity</dt>
                        <dd className="mt-1 text-gray-700">Not verified</dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">
                        Verification Status
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-amber-800">
                        Documentation pending
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-200 pt-5">
                    <a
                      href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Request for ${cert.name} documentation`)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-gold-700"
                    >
                      <Mail size={16} aria-hidden="true" />
                      Request Records
                    </a>
                    <a
                      href={cert.guidanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-600 underline underline-offset-4 hover:text-navy-900"
                    >
                      Official Guidance{" "}
                      <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">
                        {" "}
                        for {cert.name}, opens in a new tab
                      </span>
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
