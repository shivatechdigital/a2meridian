import type { ReactNode } from "react";
import PageTransition from "@/components/shared/PageTransition";

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
