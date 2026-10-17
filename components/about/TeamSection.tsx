import Image from "next/image";
import { Mail } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { TEAM_PROFILES } from "@/lib/about-content";
import { COMPANY } from "@/lib/constants";

export default function TeamSection() {
  return (
    <section
      aria-label="Leadership profiles"
      className="bg-offwhite px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Leadership"
          title="Meet Our Team"
          description="The people and responsibilities behind a connected trade business."
        />
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-6 text-gray-600">
          Illustrative profiles: these names, roles, biographies, and stock
          portraits are placeholders, not verified company personnel.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_PROFILES.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 0.06}>
              <article className="group h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`Stock portrait for the illustrative ${member.role} profile`}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded bg-navy-950/85 px-2 py-1 text-xs text-white">
                    Sample profile
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-navy-900">
                    {member.name}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm font-medium text-gold-700">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    aria-label={`Contact the team about ${member.role}`}
                    title="Email the company"
                    className="mt-5 inline-flex size-10 items-center justify-center rounded-md border border-gray-300 text-navy-900 hover:border-gold-500 hover:bg-gold-50"
                  >
                    <Mail size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
