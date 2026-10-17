"use client";

import { useEffect, useRef } from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
}
export default function TextReveal({
  text,
  className = "",
  delay = 0,
  as: Tag = "h2",
  id,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);
  const words = text.split(/\s+/);
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="text-reveal-words">
        {words.map((word, index) => (
          <span
            key={`${index}-${word}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <span
              className="inline-block"
              style={{
                animationDelay: `${Math.min(delay + index * 0.04, 0.5)}s`,
              }}
            >
              {word}
              {index < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
