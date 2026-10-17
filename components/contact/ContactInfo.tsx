import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { COMPANY } from "@/lib/constants";

export default function ContactInfo() {
  const phoneAvailable = /^\+?[\d\s-]{8,20}$/.test(COMPANY.phone);
  const whatsappAvailable = /^[1-9]\d{7,14}$/.test(COMPANY.whatsapp);
  const details = [
    {
      icon: MapPin,
      title: "Office Address",
      text: COMPANY.address,
      href: null,
      color: "text-sky-700",
    },
    {
      icon: Phone,
      title: "Phone Number",
      text: phoneAvailable
        ? COMPANY.phone
        : "Phone details awaiting confirmation",
      href: phoneAvailable ? `tel:${COMPANY.phone}` : null,
      color: "text-emerald-700",
    },
    {
      icon: Mail,
      title: "Email Address",
      text: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
      color: "text-gold-700",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      text: whatsappAvailable
        ? "Contact our trade team"
        : "WhatsApp number awaiting confirmation",
      href: whatsappAvailable ? `https://wa.me/${COMPANY.whatsapp}` : null,
      color: "text-green-700",
    },
  ];
  return (
    <div>
      <ScrollReveal>
        <p className="mb-4 text-sm font-semibold uppercase text-gold-700">
          Get In Touch
        </p>
        <h2 className="font-heading text-3xl font-bold leading-tight text-navy-900">
          Let&apos;s Discuss Your Trade Needs
        </h2>
        <p className="mb-8 mt-5 text-sm leading-7 text-gray-600">
          Tell us what you would like to source, where it needs to go, and when.
          Our team can discuss the relevant products, documentation, and next
          steps.
        </p>
      </ScrollReveal>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {details.map(({ icon: Icon, title, text, href, color }) => (
          <div
            key={title}
            className="flex min-w-0 items-start gap-4 rounded-lg border border-gray-200 bg-white p-5"
          >
            <Icon
              size={22}
              className={`mt-1 shrink-0 ${color}`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <dt className="text-sm font-semibold text-navy-900">{title}</dt>
              <dd className="mt-2 break-words text-sm leading-7 text-gray-600">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("https") ? "_blank" : undefined}
                    rel={
                      href.startsWith("https")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="break-all underline underline-offset-4 hover:text-gold-700"
                  >
                    {text}
                  </a>
                ) : (
                  text
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex gap-4 border-t border-gray-300 pt-5">
        <Clock
          size={21}
          className="mt-1 shrink-0 text-gold-700"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-sm font-semibold text-navy-900">
            Business Hours
          </h3>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            Monday - Saturday: 9:00 AM - 7:00 PM IST
            <br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  );
}
