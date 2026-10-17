"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
export default function DesktopCursor() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const activate = (event: PointerEvent) => {
      if (
        event.pointerType === "mouse" &&
        window.matchMedia(
          "(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
        ).matches
      ) {
        setReady(true);
        window.removeEventListener("pointermove", activate);
      }
    };
    window.addEventListener("pointermove", activate, { passive: true });
    return () => window.removeEventListener("pointermove", activate);
  }, []);
  return ready ? <CustomCursor /> : null;
}
