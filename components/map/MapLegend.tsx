import {
  tradeTypeLabels,
  tradeTypeMapColors,
  type MapTradeType,
} from "@/lib/countries-data";

export default function MapLegend() {
  return (
    <ul
      aria-label="Map legend"
      className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-300"
    >
      {(["export", "import", "both"] as MapTradeType[]).map((type) => (
        <li key={type} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-full"
            style={{ backgroundColor: tradeTypeMapColors[type] }}
          />
          {tradeTypeLabels[type]}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-3 rounded-full border-2 border-white bg-gold-500"
        />
        India (HQ)
      </li>
    </ul>
  );
}
