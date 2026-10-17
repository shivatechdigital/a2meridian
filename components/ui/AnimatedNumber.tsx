"use client";

import CountUp from "react-countup";
import usePrefersReducedMotion from "@/components/shared/usePrefersReducedMotion";

export default function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const final = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
  return (
    <span className={`tabular-nums ${className}`}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">
        {reduced ? (
          final
        ) : (
          <CountUp
            end={value}
            prefix={prefix}
            suffix={suffix}
            separator=","
            duration={Math.max(0.1, duration / 1000)}
            enableScrollSpy
            scrollSpyOnce
            preserveValue
          />
        )}
      </span>
    </span>
  );
}
