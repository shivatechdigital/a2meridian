"use client";

import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

export default function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.07,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down";
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={
            typeof child === "object" && child !== null && "key" in child
              ? child.key
              : index
          }
          className="min-w-0"
          initial={
            reduced ? false : { opacity: 0, y: direction === "up" ? 18 : -18 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            delay: reduced ? 0 : Math.min(index * staggerDelay, 0.4),
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
