import type { Metadata, Viewport } from "next";
import { defaultMetadata } from "@/lib/seo";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Preloader from "@/components/shared/Preloader";
import CustomCursor from "@/components/shared/DesktopCursor";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = {
  themeColor: "#0a1628",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SchemaMarkup />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-32 rounded-md bg-white px-4 py-3 text-navy-900 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Preloader />
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="min-h-screen flex-1 pt-20"
          >
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
