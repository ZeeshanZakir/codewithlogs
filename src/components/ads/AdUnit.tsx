"use client";

import { useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";

type AdUnitProps = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const slotMap = {
  "homepage-mid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE_MID,
} as const;

const formatStyles = {
  auto: { minHeight: 180 },
  rectangle: { minHeight: 280 },
  horizontal: { minHeight: 120 },
} as const;

function resolveSlotId(slot: string) {
  return slotMap[slot as keyof typeof slotMap] ?? slot;
}

export function AdUnit({ slot, format = "auto" }: AdUnitProps) {
  const slotId = useMemo(() => resolveSlotId(slot), [slot]);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction || !publisherId || !slotId) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore duplicate ad initialization during hydration retries.
    }
  }, [isProduction, publisherId, slotId]);

  if (!isProduction) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-[12px] border border-dashed border-black/10 bg-surface px-4 text-sm text-text/50",
          format === "rectangle" ? "min-h-[280px]" : "min-h-[120px]",
        )}
      >
        Ad placeholder: {slot}
      </div>
    );
  }

  if (!publisherId || !slotId) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle block w-full overflow-hidden rounded-[12px]"
      style={formatStyles[format]}
      data-ad-client={`ca-${publisherId}`}
      data-ad-slot={slotId}
      data-ad-format={format === "auto" ? "auto" : "fluid"}
      data-full-width-responsive="true"
    />
  );
}
