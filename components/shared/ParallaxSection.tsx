"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ParallaxSection({
  children,
  className = "",
  speed = -0.15,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    let disposed = false;
    let cancel: (() => void) | undefined;
    const stop = () => {
      cancel?.();
      cancel = undefined;
      if (layerRef.current) layerRef.current.style.transform = "none";
    };
    const start = async () => {
      stop();
      if (!media.matches) return;
      const { scroll } = await import("framer-motion");
      if (disposed || !media.matches || !ref.current) return;
      cancel = scroll(
        (progress) => {
          if (layerRef.current)
            layerRef.current.style.transform = `translateY(${progress * Math.max(-0.25, Math.min(0.25, speed)) * 200}px)`;
        },
        { target: ref.current, offset: ["start end", "end start"] },
      );
    };
    const activate = () => {
      void start();
    };
    window.addEventListener("scroll", activate, { once: true, passive: true });
    media.addEventListener("change", start);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", activate);
      media.removeEventListener("change", start);
      stop();
    };
  }, [speed]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        ref={layerRef}
        className="parallax-layer absolute -inset-y-12 inset-x-0"
      >
        {children}
      </div>
    </div>
  );
}
