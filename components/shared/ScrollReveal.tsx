"use client";

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type CSSProperties,
} from "react";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      element.getBoundingClientRect().top < innerHeight
    )
      return;
    element.dataset.revealState = "waiting";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.revealState = "visible";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`css-scroll-reveal ${className}`}
      data-reveal-direction={direction}
      style={
        {
          ...style,
          "--reveal-delay": `${Math.min(delay, 0.4)}s`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
