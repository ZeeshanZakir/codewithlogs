"use client";

import { useEffect, useMemo } from "react";



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
  "article-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP,
  "article-mid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MID,
  "article-end": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_END,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  "homepage-mid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE_MID,
  "gallery-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY_TOP,
  "gallery-grid": process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY_GRID,
  "json-tool-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_JSON_TOOL_TOP,
  "json-tool-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_JSON_TOOL_BOTTOM,
  "password-generator-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_PASSWORD_GENERATOR_TOP,
  "password-generator-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_PASSWORD_GENERATOR_BOTTOM,
  "word-counter-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_WORD_COUNTER_TOP,
  "word-counter-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_WORD_COUNTER_BOTTOM,
  "css-minifier-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_CSS_MINIFIER_TOP,
  "css-minifier-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_CSS_MINIFIER_BOTTOM,
  "base64-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BASE64_TOP,
  "base64-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BASE64_BOTTOM,
} as const;

const formatStyles = {
  auto: { minHeight: 180 },
  rectangle: { minHeight: 280 },
  horizontal: { minHeight: 120 },
} as const;

function resolveSlotId(slot: string) {
  if (slot in slotMap) {
    return slotMap[slot as keyof typeof slotMap];
  }

  return /^\d+$/.test(slot) ? slot : undefined;
}

export function AdUnit({ slot, format = "auto" }: AdUnitProps) {
  const slotId = useMemo(() => resolveSlotId(slot), [slot]);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction || !publisherId || !slotId || !/^\d+$/.test(slotId)) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore duplicate ad initialization during hydration retries.
    }
  }, [isProduction, publisherId, slotId]);

  if (!isProduction || !publisherId || !slotId || !/^\d+$/.test(slotId)) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle ad-placement block w-full overflow-hidden"
      style={formatStyles[format]}
      data-ad-client={publisherId.startsWith("ca-") ? publisherId : `ca-${publisherId}`}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
