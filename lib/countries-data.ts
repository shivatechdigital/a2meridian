export type MapTradeType = "import" | "export" | "both";
export interface TradeCountry {
  name: string;
  code: string;
  numericCode: string;
  flag: string;
  region: string;
  continent: string;
  tradeType: MapTradeType;
  products: string[];
  coordinates: [number, number];
  volume?: string;
}

export const tradeCountries: TradeCountry[] = [
  {
    name: "United States",
    code: "USA",
    numericCode: "840",
    flag: "🇺🇸",
    region: "Americas",
    continent: "North America",
    tradeType: "export",
    products: ["Spices", "Textiles", "Basmati Rice", "Chemicals"],
    coordinates: [-95.7, 37.1],
    volume: "15%",
  },
  {
    name: "United Kingdom",
    code: "GBR",
    numericCode: "826",
    flag: "🇬🇧",
    region: "Europe",
    continent: "Europe",
    tradeType: "export",
    products: ["Basmati Rice", "Tea", "Textiles", "Spices"],
    coordinates: [-3.4, 55.4],
    volume: "10%",
  },
  {
    name: "Germany",
    code: "DEU",
    numericCode: "276",
    flag: "🇩🇪",
    region: "Europe",
    continent: "Europe",
    tradeType: "export",
    products: ["Textiles", "Chemicals", "Machinery Parts"],
    coordinates: [10.4, 51.2],
    volume: "8%",
  },
  {
    name: "Netherlands",
    code: "NLD",
    numericCode: "528",
    flag: "🇳🇱",
    region: "Europe",
    continent: "Europe",
    tradeType: "export",
    products: ["Spices", "Agricultural Products", "Textiles"],
    coordinates: [5.3, 52.1],
    volume: "5%",
  },
  {
    name: "Australia",
    code: "AUS",
    numericCode: "036",
    flag: "🇦🇺",
    region: "Oceania",
    continent: "Oceania",
    tradeType: "export",
    products: ["Spices", "Rice", "Textiles"],
    coordinates: [133.8, -25.3],
    volume: "4%",
  },
  {
    name: "China",
    code: "CHN",
    numericCode: "156",
    flag: "🇨🇳",
    region: "East Asia",
    continent: "Asia",
    tradeType: "import",
    products: ["Electronics", "Machinery", "Chemicals", "Raw Materials"],
    coordinates: [104.2, 35.9],
    volume: "20%",
  },
  {
    name: "Thailand",
    code: "THA",
    numericCode: "764",
    flag: "🇹🇭",
    region: "Southeast Asia",
    continent: "Asia",
    tradeType: "import",
    products: ["Rice", "Rubber", "Food Products"],
    coordinates: [100.9, 15.9],
    volume: "5%",
  },
  {
    name: "Brazil",
    code: "BRA",
    numericCode: "076",
    flag: "🇧🇷",
    region: "Americas",
    continent: "South America",
    tradeType: "import",
    products: ["Sugar", "Coffee", "Soybean"],
    coordinates: [-51.9, -14.2],
    volume: "4%",
  },
  {
    name: "South Korea",
    code: "KOR",
    numericCode: "410",
    flag: "🇰🇷",
    region: "East Asia",
    continent: "Asia",
    tradeType: "import",
    products: ["Electronics", "Auto Parts", "Chemicals"],
    coordinates: [127.8, 35.9],
    volume: "3%",
  },
  {
    name: "United Arab Emirates",
    code: "ARE",
    numericCode: "784",
    flag: "🇦🇪",
    region: "Middle East",
    continent: "Asia",
    tradeType: "both",
    products: ["Rice", "Spices", "Textiles", "Petroleum Products", "Dates"],
    coordinates: [53.8, 23.4],
    volume: "18%",
  },
  {
    name: "Saudi Arabia",
    code: "SAU",
    numericCode: "682",
    flag: "🇸🇦",
    region: "Middle East",
    continent: "Asia",
    tradeType: "both",
    products: ["Basmati Rice", "Garments", "Petrochemicals"],
    coordinates: [45.1, 23.9],
    volume: "10%",
  },
  {
    name: "Singapore",
    code: "SGP",
    numericCode: "702",
    flag: "🇸🇬",
    region: "Southeast Asia",
    continent: "Asia",
    tradeType: "both",
    products: ["Spices", "Chemicals", "Electronics", "Machinery"],
    coordinates: [103.8, 1.4],
    volume: "6%",
  },
  {
    name: "Qatar",
    code: "QAT",
    numericCode: "634",
    flag: "🇶🇦",
    region: "Middle East",
    continent: "Asia",
    tradeType: "both",
    products: ["Rice", "Food Products", "LNG"],
    coordinates: [51.2, 25.3],
    volume: "3%",
  },
  {
    name: "Oman",
    code: "OMN",
    numericCode: "512",
    flag: "🇴🇲",
    region: "Middle East",
    continent: "Asia",
    tradeType: "both",
    products: ["Agricultural Products", "Minerals", "Textiles"],
    coordinates: [55.9, 21.5],
    volume: "2%",
  },
  {
    name: "South Africa",
    code: "ZAF",
    numericCode: "710",
    flag: "🇿🇦",
    region: "Africa",
    continent: "Africa",
    tradeType: "both",
    products: ["Spices", "Textiles", "Minerals", "Chemicals"],
    coordinates: [22.9, -30.6],
    volume: "3%",
  },
  {
    name: "Kenya",
    code: "KEN",
    numericCode: "404",
    flag: "🇰🇪",
    region: "Africa",
    continent: "Africa",
    tradeType: "both",
    products: ["Tea", "Coffee", "Textiles", "Agricultural Products"],
    coordinates: [37.9, -0.02],
    volume: "2%",
  },
  {
    name: "Malaysia",
    code: "MYS",
    numericCode: "458",
    flag: "🇲🇾",
    region: "Southeast Asia",
    continent: "Asia",
    tradeType: "both",
    products: ["Palm Oil", "Electronics", "Textiles", "Spices"],
    coordinates: [101.9, 4.2],
    volume: "4%",
  },
  {
    name: "Vietnam",
    code: "VNM",
    numericCode: "704",
    flag: "🇻🇳",
    region: "Southeast Asia",
    continent: "Asia",
    tradeType: "both",
    products: ["Rice", "Coffee", "Textiles", "Electronics"],
    coordinates: [108.3, 14.1],
    volume: "3%",
  },
];

export const INDIA_COORDINATES: [number, number] = [78.9, 20.6];
export const tradeTypeMapColors: Record<MapTradeType, string> = {
  export: "#34d399",
  import: "#60a5fa",
  both: "#e4bc66",
};
export const tradeTypeLabels: Record<MapTradeType, string> = {
  export: "Export Destination",
  import: "Import Source",
  both: "Import & Export",
};
export function countryForGeography(id: string | number | undefined) {
  return tradeCountries.find(
    (country) => country.numericCode === String(id).padStart(3, "0"),
  );
}
export function filterTradeCountries(
  type: MapTradeType | "all",
  region = "all",
) {
  return tradeCountries.filter(
    (country) =>
      (type === "all" ||
        country.tradeType === type ||
        (type !== "both" && country.tradeType === "both")) &&
      (region === "all" || country.region === region),
  );
}
export function tooltipPosition(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  return {
    left: Math.max(8, Math.min(x + 16, width - 272)),
    top: Math.max(8, Math.min(y + 16, height - 210)),
  };
}

const regionalGroups = [
  { name: "Middle East & Gulf", regions: ["Middle East"], color: "#e4bc66" },
  { name: "Europe", regions: ["Europe"], color: "#60a5fa" },
  {
    name: "Southeast & East Asia",
    regions: ["Southeast Asia", "East Asia"],
    color: "#34d399",
  },
  {
    name: "Americas & Africa",
    regions: ["Americas", "Africa"],
    color: "#fb7185",
  },
  { name: "Oceania", regions: ["Oceania"], color: "#cbd5e1" },
];
export const regionStats = regionalGroups.map((group) => {
  const countries = tradeCountries.filter((country) =>
    group.regions.includes(country.region),
  );
  return {
    ...group,
    countries: countries.length,
    percentage:
      Math.round((countries.length / tradeCountries.length) * 1000) / 10,
    description: countries.map((country) => country.name).join(", "),
  };
});
export const continentCount = new Set(
  tradeCountries.map((country) => country.continent),
).size;
