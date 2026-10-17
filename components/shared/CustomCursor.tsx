"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 35 });
  const springY = useSpring(y, { stiffness: 400, damping: 35 });
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const hide = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };
    const move = (event: PointerEvent) => {
      const element = ref.current;
      if (
        !element ||
        !media.matches ||
        event.pointerType !== "mouse" ||
        navigator.maxTouchPoints > 0
      ) {
        hide();
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          'input, textarea, select, dialog, #trade-map, iframe, [role="dialog"]',
        )
      ) {
        hide();
        return;
      }
      x.set(event.clientX - 15);
      y.set(event.clientY - 15);
      element.style.opacity = "1";
      element.dataset.interactive = String(
        Boolean(target?.closest('a, button, summary, [role="button"]')),
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", hide);
    document.addEventListener("pointerleave", hide);
    media.addEventListener("change", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", hide);
      document.removeEventListener("pointerleave", hide);
      media.removeEventListener("change", hide);
    };
  }, [x, y]);
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      data-custom-cursor
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden size-[30px] opacity-0 lg:block"
      style={{ x: springX, y: springY }}
    >
      <span className="cursor-ring block size-full rounded-full border border-gold-500/80 transition-transform duration-200" />
    </motion.div>
  );
}
