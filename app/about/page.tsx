import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import MissionVision from "@/components/about/MissionVision";
import CoreValues from "@/components/about/CoreValues";
import Timeline from "@/components/about/Timeline";
import TeamSection from "@/components/about/TeamSection";
import Gallery from "@/components/about/Gallery";

export const metadata: Metadata = pageMetadata.about;

export default function AboutPage() {
  return (
    <div className="overflow-x-clip">
      <AboutHero />
      <CompanyStory />
      <MissionVision />
      <CoreValues />
      <Timeline />
      <TeamSection />
      <Gallery />
    </div>
  );
}
