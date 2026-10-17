"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const available = /^[1-9]\d{7,14}$/.test(COMPANY.whatsapp);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  const label = available
    ? "Chat on WhatsApp"
    : "WhatsApp number not yet available";
  return (
    <>
      {show && (
        <a
          href={
            available
              ? `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello A2 Meridian Associates, I am interested in your products. Please share more details.")}`
              : undefined
          }
          role="link"
          aria-disabled={!available}
          tabIndex={0}
          aria-label={label}
          title={label}
          target={available ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`group fixed bottom-6 right-5 z-30 flex size-14 items-center justify-center rounded-full text-white shadow-lg ${available ? "bg-green-700 hover:bg-green-800" : "cursor-not-allowed bg-green-800"}`}
        >
          <MessageCircle size={28} aria-hidden="true" />
          <span className="pointer-events-none absolute right-full mr-3 w-44 rounded-md bg-navy-900 px-3 py-2 text-center text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {label}
          </span>
        </a>
      )}
    </>
  );
}
