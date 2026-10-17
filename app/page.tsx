import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import WhatWeDo from "@/components/home/WhatWeDo";
import ProductPreview from "@/components/home/ProductPreview";
import GlobalPreview from "@/components/home/DeferredGlobalPreview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PartnerLogos from "@/components/home/PartnerLogos";
import CTABanner from "@/components/home/CTABanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <WhatWeDo />
      <ProductPreview />
      <GlobalPreview />
      <WhyChooseUs />
      <PartnerLogos />
      <CTABanner />
    </>
  );
}
