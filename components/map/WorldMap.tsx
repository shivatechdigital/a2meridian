"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  countryForGeography,
  filterTradeCountries,
  INDIA_COORDINATES,
  tooltipPosition,
  tradeCountries,
  tradeTypeLabels,
  tradeTypeMapColors,
  type MapTradeType,
  type TradeCountry,
} from "@/lib/countries-data";
import MapLegend from "./MapLegend";

const initialCenter: [number, number] = [15, 15];
const regionNames = [
  ...new Set(tradeCountries.map((country) => country.region)),
].sort();

export default function WorldMap() {
  const [geography, setGeography] = useState<FeatureCollection | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [trade, setTrade] = useState<MapTradeType | "all">("all");
  const [region, setRegion] = useState("all");
  const [selectedCode, setSelectedCode] = useState("ARE");
  const [position, setPosition] = useState({
    coordinates: initialCenter,
    zoom: 1,
  });
  const [tooltip, setTooltip] = useState<{
    country: TradeCountry;
    left: number;
    top: number;
  } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const visibleCountries = filterTradeCountries(trade, region);
  const visibleCodes = new Set(visibleCountries.map((country) => country.code));
  const selected =
    visibleCountries.find((country) => country.code === selectedCode) ||
    visibleCountries[0];

  useEffect(() => {
    const controller = new AbortController();
    fetch("/home/world-countries.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Map unavailable");
        const topology: Topology<{ countries: GeometryCollection }> =
          await response.json();
        if (topology.type !== "Topology" || !topology.objects?.countries)
          throw new Error("Invalid geography");
        return feature(topology, topology.objects.countries);
      })
      .then(setGeography)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);

  const clearTooltip = () => setTooltip(null);
  const showTooltip = (
    country: TradeCountry,
    event: MouseEvent<SVGElement> | FocusEvent<SVGElement>,
  ) => {
    const frame = frameRef.current?.getBoundingClientRect();
    if (!frame) return;
    const target = event.currentTarget.getBoundingClientRect();
    const x =
      "clientX" in event
        ? event.clientX - frame.left
        : target.left + target.width / 2 - frame.left;
    const y =
      "clientY" in event ? event.clientY - frame.top : target.top - frame.top;
    setTooltip({
      country,
      ...tooltipPosition(x, y, frame.width, frame.height),
    });
  };
  const zoom = (factor: number) => {
    clearTooltip();
    setPosition((current) => ({
      ...current,
      zoom: Math.max(1, Math.min(5, current.zoom * factor)),
    }));
  };
  const pan = (longitude: number, latitude: number) => {
    clearTooltip();
    setPosition((current) => ({
      ...current,
      coordinates: [
        Math.max(
          -180,
          Math.min(180, current.coordinates[0] + longitude / current.zoom),
        ),
        Math.max(
          -65,
          Math.min(65, current.coordinates[1] + latitude / current.zoom),
        ),
      ],
    }));
  };
  const resetView = () => {
    setPosition({ coordinates: initialCenter, zoom: 1 });
    clearTooltip();
  };
  const selectCountry = (country: TradeCountry) => {
    setSelectedCode(country.code);
    clearTooltip();
  };
  const controlClass =
    "flex size-10 shrink-0 items-center justify-center rounded-md border border-navy-600 bg-navy-950 text-white hover:bg-navy-700 disabled:opacity-40";

  return (
    <div>
      <div className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-white">
            Trade Direction
          </legend>
          <div className="flex flex-wrap gap-1 rounded-md border border-navy-700 p-1">
            {[
              { value: "all", label: "All" },
              { value: "export", label: "Export" },
              { value: "import", label: "Import" },
              { value: "both", label: "Both" },
            ].map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded px-3 py-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-gold-400 ${trade === option.value ? "bg-gold-500 font-semibold text-navy-950" : "text-gray-200 hover:bg-navy-800"}`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="map-trade"
                  value={option.value}
                  checked={trade === option.value}
                  onChange={() => {
                    setTrade(option.value as MapTradeType | "all");
                    resetView();
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="map-region"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Region
            </label>
            <select
              id="map-region"
              value={region}
              onChange={(event) => {
                setRegion(event.target.value);
                resetView();
              }}
              className="h-11 w-full rounded-md border border-navy-600 bg-navy-950 px-3 text-sm text-white"
            >
              <option value="all">All Regions</option>
              {regionNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="map-country"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Country
            </label>
            <select
              id="map-country"
              value={selected?.code || ""}
              onChange={(event) => {
                const country = visibleCountries.find(
                  (item) => item.code === event.target.value,
                );
                if (country) {
                  selectCountry(country);
                  setPosition({ coordinates: country.coordinates, zoom: 2.5 });
                }
              }}
              className="h-11 w-full rounded-md border border-navy-600 bg-navy-950 px-3 text-sm text-white"
            >
              {!selected && <option value="">No matching countries</option>}
              {visibleCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p role="status" className="text-sm text-gray-300">
          {visibleCountries.length} of {tradeCountries.length} mapped countries
        </p>
        <div
          role="toolbar"
          aria-label="Map view controls"
          className="flex flex-wrap gap-1.5"
        >
          <button
            type="button"
            aria-label="Zoom in"
            title="Zoom in"
            onClick={() => zoom(1.4)}
            disabled={position.zoom >= 5}
            className={controlClass}
          >
            <ZoomIn size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            title="Zoom out"
            onClick={() => zoom(1 / 1.4)}
            disabled={position.zoom <= 1}
            className={controlClass}
          >
            <ZoomOut size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Pan west"
            title="Pan west"
            onClick={() => pan(-25, 0)}
            className={controlClass}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Pan east"
            title="Pan east"
            onClick={() => pan(25, 0)}
            className={controlClass}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Pan north"
            title="Pan north"
            onClick={() => pan(0, 15)}
            className={controlClass}
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Pan south"
            title="Pan south"
            onClick={() => pan(0, -15)}
            className={controlClass}
          >
            <ArrowDown size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Focus selected country"
            title="Focus selected country"
            disabled={!selected}
            onClick={() => {
              if (selected)
                setPosition({ coordinates: selected.coordinates, zoom: 2.5 });
              clearTooltip();
            }}
            className={controlClass}
          >
            <Crosshair size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Reset map view"
            title="Reset map view"
            onClick={resetView}
            className={controlClass}
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div
          ref={frameRef}
          className="relative min-w-0 overflow-hidden bg-navy-950/50"
          onMouseLeave={clearTooltip}
        >
          {!geography ? (
            <div
              role="status"
              className="flex aspect-[4/3] items-center justify-center px-5 text-center sm:aspect-[2/1]"
            >
              {failed ? (
                <div>
                  <p className="text-sm text-gray-300">
                    World map could not be loaded.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFailed(false);
                      setAttempt((current) => current + 1);
                    }}
                    className="mt-4 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950"
                  >
                    Retry Map
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-300">Loading World Map...</p>
              )}
            </div>
          ) : (
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 155 }}
              width={900}
              height={460}
              role="group"
              aria-label="Interactive world trade map"
              className="block aspect-[4/3] w-full sm:aspect-[2/1]"
              onKeyDown={(event) => {
                if (event.key === "Escape") clearTooltip();
              }}
            >
              <ZoomableGroup
                center={position.coordinates}
                zoom={position.zoom}
                minZoom={1}
                maxZoom={5}
                translateExtent={[
                  [-450, -230],
                  [1350, 690],
                ]}
                filterZoomEvent={(event) =>
                  event.type !== "wheel" || (event as WheelEvent).ctrlKey
                }
                onMoveStart={clearTooltip}
                onMoveEnd={(next) =>
                  setPosition((current) => ({
                    coordinates: next.coordinates || current.coordinates,
                    zoom: next.zoom || current.zoom,
                  }))
                }
              >
                <Geographies geography={geography}>
                  {({ geographies }) =>
                    geographies
                      .filter(
                        (shape) => String(shape.id).padStart(3, "0") !== "010",
                      )
                      .map((shape) => {
                        const country = countryForGeography(shape.id);
                        const active =
                          country && visibleCodes.has(country.code);
                        const isIndia =
                          String(shape.id).padStart(3, "0") === "356";
                        return (
                          <Geography
                            key={shape.rsmKey}
                            geography={shape}
                            data-country-code={country?.code}
                            data-trade-type={
                              active ? country.tradeType : undefined
                            }
                            fill={
                              isIndia
                                ? "#bd8d38"
                                : active
                                  ? tradeTypeMapColors[country.tradeType]
                                  : "#24394c"
                            }
                            fillOpacity={active ? 0.7 : 1}
                            stroke={
                              selected?.code === country?.code && active
                                ? "#ffffff"
                                : "#0a1628"
                            }
                            strokeWidth={
                              selected?.code === country?.code && active
                                ? 1.5
                                : 0.5
                            }
                            vectorEffect="non-scaling-stroke"
                            onMouseEnter={(event) => {
                              if (active) showTooltip(country, event);
                            }}
                            onMouseLeave={clearTooltip}
                            onClick={() => {
                              if (active) selectCountry(country);
                            }}
                            className={active ? "cursor-pointer" : ""}
                          />
                        );
                      })
                  }
                </Geographies>
                <g aria-hidden="true" pointerEvents="none">
                  {visibleCountries.map((country) => (
                    <Line
                      key={country.code}
                      from={INDIA_COORDINATES}
                      to={country.coordinates}
                      stroke={tradeTypeMapColors[country.tradeType]}
                      strokeWidth={selected?.code === country.code ? 2 : 0.8}
                      opacity={selected?.code === country.code ? 0.95 : 0.35}
                      strokeDasharray="4 4"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
                <Marker coordinates={INDIA_COORDINATES}>
                  <g aria-label="India headquarters">
                    <circle
                      className="map-hq-pulse"
                      r={12 / position.zoom}
                      fill="#e4bc66"
                      opacity={0.25}
                    />
                    <circle
                      r={5 / position.zoom}
                      fill="#e4bc66"
                      stroke="white"
                      strokeWidth={1.5 / position.zoom}
                    />
                    <text
                      y={-13 / position.zoom}
                      textAnchor="middle"
                      fill="white"
                      fontSize={12 / position.zoom}
                    >
                      India
                    </text>
                  </g>
                </Marker>
                {visibleCountries.map((country) => (
                  <Marker
                    key={country.code}
                    coordinates={country.coordinates}
                    role="button"
                    tabIndex={0}
                    aria-label={`Explore ${country.name}`}
                    aria-pressed={selected?.code === country.code}
                    aria-describedby={
                      tooltip?.country.code === country.code
                        ? tooltipId
                        : undefined
                    }
                    onMouseEnter={(event) => showTooltip(country, event)}
                    onMouseLeave={clearTooltip}
                    onFocus={(event) => showTooltip(country, event)}
                    onBlur={clearTooltip}
                    onClick={() => selectCountry(country)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectCountry(country);
                      } else if (event.key === "Escape") clearTooltip();
                    }}
                    className="map-country-marker cursor-pointer"
                  >
                    <circle r={11 / position.zoom} fill="transparent" />
                    <circle
                      r={
                        (selected?.code === country.code ? 5 : 3.5) /
                        position.zoom
                      }
                      fill={tradeTypeMapColors[country.tradeType]}
                      stroke={
                        selected?.code === country.code ? "white" : "#0a1628"
                      }
                      strokeWidth={1.5 / position.zoom}
                    />
                    <title>
                      {country.name} · {tradeTypeLabels[country.tradeType]}
                    </title>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          )}
          {tooltip && (
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute z-10 max-h-52 w-[264px] max-w-[calc(100%-16px)] overflow-hidden rounded-md border border-navy-600 bg-navy-950/95 p-4 text-xs shadow-xl"
              style={{ left: tooltip.left, top: tooltip.top }}
            >
              <p className="font-semibold text-white">
                {tooltip.country.flag} {tooltip.country.name}
              </p>
              <p
                className="mt-1"
                style={{ color: tradeTypeMapColors[tooltip.country.tradeType] }}
              >
                {tradeTypeLabels[tooltip.country.tradeType]}
              </p>
              <p className="mt-3 leading-6 text-gray-300">
                {tooltip.country.products.join(", ")}
              </p>
            </div>
          )}
        </div>
        <aside
          aria-label="Selected country details"
          aria-live="polite"
          className="min-h-64 min-w-0 border-t border-navy-600 pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0"
        >
          {selected ? (
            <>
              <p className="text-xs uppercase text-gray-400">
                {selected.region}
              </p>
              <h3 className="mt-3 break-words font-heading text-2xl font-bold text-white">
                <span aria-hidden="true">{selected.flag} </span>
                {selected.name}
              </h3>
              <p
                className="mt-3 text-sm font-semibold"
                style={{ color: tradeTypeMapColors[selected.tradeType] }}
              >
                {tradeTypeLabels[selected.tradeType]}
              </p>
              <h4 className="mb-3 mt-6 text-xs font-semibold uppercase text-gray-400">
                Key Products
              </h4>
              <ul className="flex flex-wrap gap-2">
                {selected.products.map((product) => (
                  <li
                    key={product}
                    className="rounded border border-navy-600 px-2 py-1.5 text-xs text-gray-200"
                  >
                    {product}
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?${new URLSearchParams({ country: selected.name })}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-white"
              >
                Discuss This Market <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <h3 className="font-heading text-xl text-white">
                No matching countries
              </h3>
              <button
                type="button"
                onClick={() => {
                  setTrade("all");
                  setRegion("all");
                  resetView();
                }}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300"
              >
                <X size={16} aria-hidden="true" />
                Clear Filters
              </button>
            </>
          )}
        </aside>
      </div>
      <MapLegend />
    </div>
  );
}
