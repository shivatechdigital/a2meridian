import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { COMPANY } from "@/lib/constants";

export default function CTABanner() {
  const phoneAvailable = /^\+?[\d\s-]{8,20}$/.test(COMPANY.phone);
  return (
    <section
      aria-label="Start trading"
      className="relative isolate overflow-hidden border-y-2 border-gold-500 bg-navy-950 px-5 py-20 sm:px-8"
    >
      <Image
        src="/home/cargo-ship.jpg"
        alt="Cargo vessel and international freight operations"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-navy-950/80" />
      <ScrollReveal className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase text-gold-300">
          Start Trading Today
        </p>
        <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
          Ready to Expand Your Global Trade?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-200">
          Import quality products or bring Indian goods to international
          markets. Let us discuss your requirements.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 hover:bg-gold-400"
          >
            Get a Free Quote <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a
            href={
              phoneAvailable
                ? `tel:${COMPANY.phone}`
                : `mailto:${COMPANY.email}`
            }
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/50 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
          >
            {phoneAvailable ? (
              <Phone size={18} aria-hidden="true" />
            ) : (
              <Mail size={18} aria-hidden="true" />
            )}
            {phoneAvailable ? "Call Us Now" : "Email Our Team"}
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
