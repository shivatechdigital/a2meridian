"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let lenis: Lenis | undefined;
    let observer: MutationObserver | undefined;
    const destroy = () => {
      observer?.disconnect();
      lenis?.destroy();
      observer = undefined;
      lenis = undefined;
    };
    const configure = () => {
      destroy();
      if (!media.matches || navigator.maxTouchPoints > 0) return;
      lenis = new Lenis({
        autoRaf: true,
        duration: 0.9,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -96 },
        prevent: (node) =>
          Boolean(
            node.closest(
              "dialog, [data-lenis-prevent], #trade-map, iframe, textarea, select",
            ),
          ),
      });
      const syncLock = () => {
        if (
          document.querySelector("dialog[open]") ||
          document.body.style.overflow === "hidden"
        )
          lenis?.stop();
        else lenis?.start();
      };
      observer = new MutationObserver((records) => {
        if (
          records.some(
            (record) =>
              record.target === document.body ||
              record.target instanceof HTMLDialogElement,
          )
        )
          syncLock();
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["style", "open"],
        subtree: true,
      });
      syncLock();
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      media.removeEventListener("change", configure);
      destroy();
    };
  }, []);
  return children;
}
