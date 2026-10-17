"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex min-h-[520px] items-center justify-center text-sm text-gray-300"
    >
      <span
        className="mr-3 size-5 animate-spin rounded-full border-2 border-gold-400 border-t-transparent"
        aria-hidden="true"
      />
      Loading World Map...
    </div>
  ),
});

export default function MapExplorer() {
  return <WorldMap />;
}
