import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CertGrid from "@/components/certifications/CertGrid";
import ComplianceStatement from "@/components/certifications/ComplianceStatement";

export const metadata: Metadata = pageMetadata.certifications;

export default function CertificationsPage() {
  return (
    <div className="overflow-x-clip">
      <section
        aria-labelledby="certifications-title"
        className="relative isolate flex min-h-[calc(60svh-5rem)] items-center overflow-hidden bg-navy-950 px-5 py-16 sm:px-8"
      >
        <Image
          src="/about/documents.jpg"
          alt="Illustrative review of business documents"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/75" />
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase text-gold-300">
              Trust &amp; Transparency
            </p>
            <h1
              id="certifications-title"
              className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl"
            >
              Certifications &amp; Compliance
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200">
              Understand the documents behind international trade, and request
              the evidence relevant to your requirements.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <CertGrid />
      <ComplianceStatement />
    </div>
  );
}
