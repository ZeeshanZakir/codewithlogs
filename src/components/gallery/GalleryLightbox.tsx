"use client";

import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

import type { GalleryPinItem } from "@/lib/gallery-types";
import { cn } from "@/lib/utils";

type GalleryLightboxProps = {
  pin: GalleryPinItem;
  initialIndex?: number;
  onClose(): void;
};

export function GalleryLightbox({
  pin,
  initialIndex = 0,
  onClose,
}: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: pin.images.length > 1,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.scrollTo(initialIndex, true);
    setSelectedIndex(initialIndex);

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, initialIndex]);

  const currentImage = useMemo(() => {
    return pin.images[selectedIndex] ?? pin.images[0];
  }, [pin.images, selectedIndex]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 px-3 py-3 backdrop-blur-[2px] sm:px-4 sm:py-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[94vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#05080f] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative min-h-0 bg-black">
            <div className="h-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {pin.images.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="min-w-0 shrink-0 grow-0 basis-full">
                    <div className="flex h-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
                      <img
                        src={imageUrl}
                        alt={`${pin.title} image ${index + 1}`}
                        className="max-h-[78vh] w-auto max-w-full rounded-[22px] object-contain shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {pin.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white transition-colors hover:bg-black/75 sm:left-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white transition-colors hover:bg-black/75 sm:right-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <aside className="relative flex min-h-0 flex-col border-t border-white/10 bg-[#081428] lg:border-l lg:border-t-0">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white transition-colors hover:bg-black/35"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-5 p-6 pr-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  Gallery Pin
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
                  {pin.title}
                </h2>
              </div>

              {pin.description ? (
                <p className="text-sm leading-7 text-white/70">{pin.description}</p>
              ) : (
                <p className="text-sm leading-7 text-white/45">
                  No description was added for this gallery pin.
                </p>
              )}

              <a
                href={currentImage}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,110,86,0.25)] transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download
              </a>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/45">
                {selectedIndex + 1} / {pin.images.length} Images
              </div>
            </div>

            {pin.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-3 border-t border-white/10 p-4">
                {pin.images.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-thumb-${index}`}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-[#0d1d36] transition-all",
                      selectedIndex === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-white/10 hover:border-white/30",
                    )}
                  >
                    <img
                      src={imageUrl}
                      alt={`${pin.title} thumbnail ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </aside>
        </div>

        {pin.images.length > 1 ? (
          <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-[#06101f] px-6 py-4">
            {pin.images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  selectedIndex === index ? "bg-primary" : "bg-white/20 hover:bg-white/35",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
