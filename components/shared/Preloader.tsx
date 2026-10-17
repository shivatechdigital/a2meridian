"use client";

import { useEffect, useRef } from "react";
import { Globe2 } from "lucide-react";

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    try {
      if (sessionStorage.getItem("a2-intro-seen")) return;
      sessionStorage.setItem("a2-intro-seen", "1");
    } catch {
      return;
    }
    element.hidden = false;
    const dismiss = () => {
      element.hidden = true;
    };
    const timer = window.setTimeout(dismiss, 1000);
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      element.hidden = true;
    };
  }, []);
  return (
    <div
      ref={ref}
      hidden
      aria-hidden="true"
      className="brand-preloader pointer-events-none fixed inset-0 z-[90] bg-navy-950 text-center"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="intro-logo mb-6 flex size-16 items-center justify-center rounded-lg border border-gold-500 text-gold-400">
          <Globe2 size={36} />
        </span>
        <p className="font-heading text-2xl text-white">A2 Meridian</p>
        <p className="mt-2 text-xs text-gold-400">ASSOCIATES</p>
        <span className="intro-loading mt-7 h-0.5 w-36 origin-left bg-gold-500" />
      </div>
    </div>
  );
}
