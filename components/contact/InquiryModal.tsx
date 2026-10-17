"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import ContactForm from "./ContactForm";

export default function InquiryModal({
  productName,
  hsCode,
}: {
  productName: string;
  hsCode?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  const close = () => dialogRef.current?.close();
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            setIsOpen(true);
          }
        }}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-gold-600 px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-50"
      >
        <Send size={17} aria-hidden="true" />
        Quick Inquiry
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={close}
        onClose={() => {
          setIsOpen(false);
          triggerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[90svh] w-[calc(100%-24px)] max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-5 text-navy-900 shadow-xl backdrop:bg-navy-950/80 sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-heading text-2xl font-bold">
              Quick Product Inquiry
            </h2>
            <p className="mt-2 break-words text-sm font-semibold text-gold-700">
              {productName}
              {hsCode ? ` · HS: ${hsCode}` : ""}
            </p>
          </div>
          <button
            type="button"
            autoFocus
            onClick={close}
            aria-label="Close inquiry"
            title="Close inquiry"
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <ContactForm prefillProduct={productName} hsCode={hsCode} compact />
      </dialog>
    </>
  );
}
