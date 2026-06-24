"use client";

import { AdUnit } from "@/components/ads/AdUnit";
import type { GalleryPinItem } from "@/lib/gallery-types";

type GalleryMasonryProps = {
  pins: GalleryPinItem[];
  onSelect(pin: GalleryPinItem): void;
  showInlineAds: boolean;
};

type GalleryRenderableItem =
  | { type: "pin"; pin: GalleryPinItem }
  | { type: "ad"; key: string };

function buildRenderableItems(
  pins: GalleryPinItem[],
  showInlineAds: boolean,
): GalleryRenderableItem[] {
  if (!showInlineAds) {
    return pins.map((pin) => ({ type: "pin", pin }));
  }

  const items: GalleryRenderableItem[] = [];

  pins.forEach((pin, index) => {
    items.push({ type: "pin", pin });

    if ((index + 1) % 9 === 0) {
      items.push({
        type: "ad",
        key: `gallery-grid-${index}`,
      });
    }
  });

  return items;
}

export function GalleryMasonry({
  pins,
  onSelect,
  showInlineAds,
}: GalleryMasonryProps) {
  const items = buildRenderableItems(pins, showInlineAds);

  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5">
      {items.map((item, index) =>
        item.type === "ad" ? (
          <div
            key={item.key}
            className="mb-4 break-inside-avoid overflow-hidden rounded-[24px] border border-black/6 bg-white p-3 shadow-sm"
          >
            <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-text/40">
              Sponsored
            </div>
            <AdUnit slot="gallery-grid" format="rectangle" />
          </div>
        ) : (
          <button
            key={item.pin.id}
            type="button"
            onClick={() => onSelect(item.pin)}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[24px] border border-black/6 bg-white text-left shadow-sm transition-transform hover:-translate-y-1"
          >
            <img
              src={item.pin.images[0]}
              alt={item.pin.title}
              loading={index < 10 ? "eager" : "lazy"}
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {item.pin.title}
              </h3>
            </div>
          </button>
        ),
      )}
    </div>
  );
}
