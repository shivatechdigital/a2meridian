"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

interface Props {
  src: string;
  alt: string;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  rounded?: string;
  sizes?: string;
}
export default function ImageReveal({
  src,
  alt,
  className = "aspect-[5/4]",
  direction = "up",
  delay = 0,
  rounded = "rounded-lg",
  sizes = "(max-width: 1023px) 100vw, 50vw",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const clips = {
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  };
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { clipPath: clips[direction], scale: 1.04 }}
        whileInView={{ clipPath: "inset(0 0 0 0)", scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: reduced ? 0 : 0.65,
          delay: reduced ? 0 : delay,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
