"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const GlobalPreview = dynamic(() => import("./GlobalPreview"), { ssr: false });
export default function DeferredGlobalPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="min-h-[1000px] bg-navy-900">
      {ready ? (
        <GlobalPreview />
      ) : (
        <div className="mx-auto max-w-7xl px-5 py-20 text-center">
          <h2 className="font-heading text-3xl text-white">
            International Connections
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-300">
            Explore markets and regional connections with A2 Meridian
            Associates.
          </p>
          <a
            href="/global-reach"
            className="mt-7 inline-block font-semibold text-gold-300 underline underline-offset-4"
          >
            Explore Our Global Reach
          </a>
        </div>
      )}
    </div>
  );
}
