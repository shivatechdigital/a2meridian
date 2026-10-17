"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { GALLERY_IMAGES } from "@/lib/about-content";

export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const image = GALLERY_IMAGES[selected];
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  const move = (offset: number) =>
    setSelected(
      (current) =>
        (current + offset + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
    );
  const close = () => dialogRef.current?.close();

  return (
    <section
      aria-label="Trade photo gallery"
      className="bg-white px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          subtitle="Infrastructure & Operations"
          title="Trade in Focus"
          description="Illustrative office, storage, laboratory, and shipping photographs. These are not photographs of company-owned facilities."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((photo, index) => (
            <ScrollReveal key={photo.src} delay={(index % 3) * 0.07}>
              <button
                type="button"
                aria-label={`View ${photo.label}`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setSelected(index);
                  setIsOpen(true);
                  dialogRef.current?.showModal();
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-navy-900 text-left"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-transparent to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-sm font-semibold text-white">
                  {photo.label}
                  <Expand size={18} aria-hidden="true" />
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby="gallery-dialog-title"
        onClose={() => {
          setIsOpen(false);
          openerRef.current?.focus();
        }}
        onCancel={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
        className="m-auto w-[92vw] max-w-5xl rounded-lg border border-navy-700 bg-navy-950 p-4 text-white backdrop:bg-black/80 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="gallery-dialog-title" className="font-heading text-xl">
            {image.label}
          </h2>
          <button
            type="button"
            autoFocus
            aria-label="Close gallery"
            title="Close gallery"
            onClick={close}
            className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/10"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        {isOpen && (
          <div className="relative h-[min(60svh,650px)] w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Previous photograph"
            title="Previous photograph"
            onClick={() => move(-1)}
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-navy-700 hover:bg-navy-800"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <p
            aria-live="polite"
            className="text-center text-xs leading-5 text-gray-300"
          >
            {selected + 1} / {GALLERY_IMAGES.length} · Illustrative photograph
          </p>
          <button
            type="button"
            aria-label="Next photograph"
            title="Next photograph"
            onClick={() => move(1)}
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-navy-700 hover:bg-navy-800"
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </section>
  );
}
