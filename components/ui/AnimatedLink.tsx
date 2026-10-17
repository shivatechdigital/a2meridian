import Link from "next/link";
import type { ReactNode } from "react";

export default function AnimatedLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`animated-link relative inline-block ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-500 transition-transform duration-200"
      />
    </Link>
  );
}
