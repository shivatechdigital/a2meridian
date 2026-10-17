import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { Suspense } from "react";
import InquiryContext from "@/components/products/InquiryContext";
import ContactFormFromQuery from "@/components/contact/ContactFormFromQuery";
import ContactInfo from "@/components/contact/ContactInfo";
import MapEmbed from "@/components/contact/MapEmbed";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = pageMetadata.contact;

export default function ContactPage() {
  const whatsappAvailable = /^[1-9]\d{7,14}$/.test(COMPANY.whatsapp);
  const directUrl = whatsappAvailable
    ? `https://wa.me/${COMPANY.whatsapp}?${new URLSearchParams({ text: "Hello A2 Meridian Associates, I have a trade inquiry." })}`
    : `mailto:${COMPANY.email}`;
  return (
    <div className="overflow-x-clip">
      <section
        aria-labelledby="contact-title"
        className="relative isolate flex min-h-[calc(55svh-5rem)] items-center overflow-hidden bg-navy-950 px-5 py-16 sm:px-8"
      >
        <Image
          src="/contact/communication.jpg"
          alt="Illustrative business communication and a telephone"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-navy-950/75" />
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase text-gold-300">
              A2 Meridian Associates · Reach Out
            </p>
            <h1
              id="contact-title"
              className="font-heading text-4xl font-bold text-white sm:text-5xl"
            >
              Contact Us
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200">
              Have a trade inquiry? Let&apos;s connect. Share your sourcing,
              import, or export requirements with our team.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <Suspense fallback={null}>
        <InquiryContext />
      </Suspense>
      <section
        aria-label="Contact and inquiry"
        className="bg-offwhite px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="min-w-0 lg:col-span-2">
            <ContactInfo />
          </div>
          <div className="min-w-0 lg:col-span-3">
            <Suspense
              fallback={
                <div
                  role="status"
                  className="min-h-[700px] rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-600"
                >
                  Loading Inquiry Form...
                </div>
              }
            >
              <ContactFormFromQuery />
            </Suspense>
          </div>
        </div>
      </section>
      <section
        aria-label="Office location"
        className="bg-white px-5 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            subtitle="Find Us"
            title="Our Office Location"
            description={COMPANY.address}
          />
          <MapEmbed />
        </div>
      </section>
      <section className="bg-navy-900 px-5 py-16 text-center sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-white">
            Prefer a Direct Conversation?
          </h2>
          <p className="mt-5 text-sm leading-7 text-gray-300">
            Send your requirements directly to our team, including the product,
            destination, quantities, and timeline.
          </p>
          <a
            href={directUrl}
            target={whatsappAvailable ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-400"
          >
            {whatsappAvailable ? (
              <MessageCircle size={19} aria-hidden="true" />
            ) : (
              <Mail size={19} aria-hidden="true" />
            )}
            {whatsappAvailable ? "Chat on WhatsApp" : "Email Our Team"}
          </a>
        </div>
      </section>
    </div>
  );
}
