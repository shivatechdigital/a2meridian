import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Globe2,
  PackageCheck,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import ParallaxSection from "@/components/shared/ParallaxSection";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(88svh-5rem)] items-center overflow-hidden bg-navy-950 px-5 py-14 sm:px-8 lg:py-20"
    >
      <ParallaxSection className="!absolute inset-0 z-0" speed={-0.18}>
        <Image
          src="/hero-port.webp"
          alt="Shipping containers arranged at an international cargo terminal"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      </ParallaxSection>
      <div className="absolute inset-0 z-[1] bg-navy-950/65" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase text-gold-300">
            Import &amp; Export · Established {COMPANY.founded}
          </p>
          <h1
            id="hero-title"
            className="max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-6xl"
          >
            A2 Meridian Associates
          </h1>
          <p className="mt-5 font-heading text-2xl text-gold-300 sm:text-3xl">
            Connecting <span className="text-gradient-animated">India</span> to
            the <span className="text-gradient-animated">World</span>
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
            Your import and export partner for quality products, dependable
            sourcing, and lasting relationships across borders.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton className="sm:inline-block [&_a]:w-full">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-gold-400"
              >
                Explore Products <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </MagneticButton>
            <Link
              href="/global-reach"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/50 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Our Global Reach <Globe2 size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul
            aria-label="Our trade approach"
            className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-200"
          >
            {[
              { icon: ShieldCheck, label: "Quality focused" },
              { icon: PackageCheck, label: "Reliable sourcing" },
              { icon: Globe2, label: "Global connections" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon size={18} className="text-gold-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <a
            href="#trade-overview"
            className="mt-9 inline-flex items-center gap-2 text-sm text-gray-200 hover:text-gold-300"
          >
            Discover A2 Meridian <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
