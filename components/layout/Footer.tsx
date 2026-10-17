import Link from "next/link";
import { Globe2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY, NAV_LINKS, CATEGORIES } from "@/lib/constants";
import AnimatedLink from "@/components/ui/AnimatedLink";

export default function Footer() {
  const phoneAvailable = /^\+?[\d\s-]{8,20}$/.test(COMPANY.phone);
  return (
    <footer className="bg-navy-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="mb-6 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
              <Globe2 aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-bold text-white">
                A2 Meridian
              </span>
              <span className="text-xs text-gold-400">ASSOCIATES</span>
            </span>
          </Link>
          <p className="text-sm leading-7 text-gray-400">
            Your trusted partner in global trade. Quality products, reliable
            supply chains, and lasting business relationships.
          </p>
        </div>
        <div>
          <h2 className="mb-6 font-heading text-lg text-white">Quick Links</h2>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <AnimatedLink
                  className="text-sm text-gray-400 transition-colors hover:text-gold-400"
                  href={link.href}
                >
                  {link.name}
                </AnimatedLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-6 font-heading text-lg text-white">Our Products</h2>
          <ul className="space-y-3">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  className="text-sm text-gray-400 transition-colors hover:text-gold-400"
                  href={`/products?category=${category.slug}`}
                >
                  <span aria-hidden="true" className="mr-2">
                    {category.icon}
                  </span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-6 font-heading text-lg text-white">Contact Us</h2>
          <ul className="space-y-4 text-sm leading-6 text-gray-400">
            <li className="flex gap-3">
              <MapPin
                className="mt-1 size-5 shrink-0 text-gold-500"
                aria-hidden="true"
              />
              <address className="not-italic">{COMPANY.address}</address>
            </li>
            <li className="flex gap-3">
              <Phone
                className="size-5 shrink-0 text-gold-500"
                aria-hidden="true"
              />
              {phoneAvailable ? (
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="hover:text-gold-400"
                >
                  {COMPANY.phone}
                </a>
              ) : (
                <span>Phone details pending</span>
              )}
            </li>
            <li className="flex min-w-0 gap-3">
              <Mail
                className="size-5 shrink-0 text-gold-500"
                aria-hidden="true"
              />
              <a
                href={`mailto:${COMPANY.email}`}
                className="break-all hover:text-gold-400"
              >
                {COMPANY.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock
                className="mt-1 size-5 shrink-0 text-gold-500"
                aria-hidden="true"
              />
              <span>Mon - Sat: 9:00 AM - 7:00 PM IST</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 text-xs text-gray-400 sm:flex-row sm:px-8">
          <p>&copy; 2026 A2 Meridian Associates. All rights reserved.</p>
          <span>Greater Noida, India</span>
        </div>
      </div>
    </footer>
  );
}
