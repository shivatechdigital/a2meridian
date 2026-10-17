"use client";

import { useRef, type ReactNode } from "react";
import usePrefersReducedMotion from "@/components/shared/usePrefersReducedMotion";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.15,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const x = {
    set: (value: number) =>
      layerRef.current?.style.setProperty("--magnetic-x", `${value}px`),
  };
  const y = {
    set: (value: number) =>
      layerRef.current?.style.setProperty("--magnetic-y", `${value}px`),
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        if (
          reduced ||
          event.pointerType !== "mouse" ||
          !window.matchMedia(
            "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
          ).matches
        )
          return;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          x.set(
            Math.max(
              -7,
              Math.min(
                7,
                (event.clientX - rect.left - rect.width / 2) * strength,
              ),
            ),
          );
          y.set(
            Math.max(
              -5,
              Math.min(
                5,
                (event.clientY - rect.top - rect.height / 2) * strength,
              ),
            ),
          );
        }
      }}
      onPointerLeave={reset}
      onFocusCapture={reset}
    >
      <div ref={layerRef} className="magnetic-layer">
        {children}
      </div>
    </div>
  );
}
