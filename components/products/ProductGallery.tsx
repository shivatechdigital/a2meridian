"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  PackageOpen,
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ProductImage } from "@/lib/catalog-types";

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const zoomRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const active = images[activeIndex] || images[0];
  const move = (offset: number) =>
    setActiveIndex(
      (current) => (current + offset + images.length) % images.length,
    );
  const close = () => dialogRef.current?.close();
  useEffect(() => {
    if (!zoomed) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [zoomed]);
  if (!active)
    return (
      <div
        role="img"
        aria-label={`No image available for ${productName}`}
        className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-400"
      >
        <PackageOpen size={56} aria-hidden="true" />
      </div>
    );
  const controls = (
    <>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous product image"
            title="Previous product image"
            className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 bg-white/95 text-navy-900"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next product image"
            title="Next product image"
            className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 bg-white/95 text-navy-900"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      )}
    </>
  );
  return (
    <div className="min-w-0 space-y-4">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
        onTouchStart={(event) => {
          touchStart.current = event.changedTouches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current !== null && images.length > 1) {
            const delta = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
          }
          touchStart.current = null;
        }}
      >
        <Image
          src={urlFor(active)
            .width(1100)
            .height(825)
            .fit("max")
            .auto("format")
            .url()}
          alt={active.alt || `${productName}, image ${activeIndex + 1}`}
          fill
          preload
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="object-contain"
        />
        {controls}
        <button
          ref={zoomRef}
          type="button"
          aria-label="Zoom product image"
          title="Zoom product image"
          onClick={() => {
            setZoomed(true);
            dialogRef.current?.showModal();
          }}
          className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-md border border-gray-200 bg-white/95 text-navy-900"
        >
          <ZoomIn size={20} aria-hidden="true" />
        </button>
        <p
          role="status"
          className="absolute bottom-3 right-3 rounded bg-navy-950/85 px-3 py-1 text-xs text-white"
        >
          {activeIndex + 1} / {images.length}
        </p>
      </div>
      {images.length > 1 && (
        <div
          aria-label="Product image thumbnails"
          className="flex gap-3 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image._key}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative size-20 shrink-0 overflow-hidden rounded-md border-2 bg-gray-100 ${index === activeIndex ? "border-gold-600" : "border-gray-300"}`}
            >
              <Image
                src={urlFor(image)
                  .width(160)
                  .height(160)
                  .fit("crop")
                  .auto("format")
                  .url()}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialogRef}
        aria-label={`${productName} image viewer`}
        onClose={() => {
          setZoomed(false);
          zoomRef.current?.focus();
        }}
        onCancel={close}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
          } else if (
            images.length > 1 &&
            ["ArrowRight", "ArrowLeft"].includes(event.key)
          ) {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="m-auto w-[92vw] max-w-6xl rounded-lg border border-navy-700 bg-navy-950 p-4 text-white backdrop:bg-black/80"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="break-words font-heading text-xl">{productName}</h2>
          <button
            type="button"
            autoFocus
            title="Close image viewer"
            aria-label="Close image viewer"
            onClick={close}
            className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/10"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        {zoomed && (
          <div className="relative h-[65svh]">
            {" "}
            <Image
              src={urlFor(active).width(1800).fit("max").auto("format").url()}
              alt={active.alt || productName}
              fill
              sizes="90vw"
              className="object-contain"
            />
            {controls}
          </div>
        )}
        <p aria-live="polite" className="mt-3 text-center text-sm">
          Image {activeIndex + 1} of {images.length}
        </p>
      </dialog>
    </div>
  );
}
