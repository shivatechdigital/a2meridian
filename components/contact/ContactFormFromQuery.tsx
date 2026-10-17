"use client";

import { useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";

export default function ContactFormFromQuery() {
  const parameters = useSearchParams();
  const product = parameters.get("product")?.slice(0, 160) || "";
  const country = parameters.get("country")?.slice(0, 100) || "";
  return (
    <ContactForm
      key={`${product}:${country}`}
      prefillProduct={product}
      prefillCountry={country}
    />
  );
}
