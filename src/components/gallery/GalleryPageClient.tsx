"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";

import { AdUnit } from "@/components/ads/AdUnit";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry";
import type { GalleryPinItem, GalleryPinsResult } from "@/lib/gallery-types";

type GalleryPageClientProps = {
  initialData: GalleryPinsResult;
};

function GallerySkeletonGrid() {
  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid overflow-hidden rounded-[24px] border border-black/6 bg-white p-3 shadow-sm"
        >
          <div
            className="animate-pulse rounded-[18px] bg-surface"
            style={{ height: `${180 + (index % 4) * 60}px` }}
          />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}

export function GalleryPageClient({ initialData }: GalleryPageClientProps) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [pins, setPins] = useState<GalleryPinItem[]>(initialData.items);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedPin, setSelectedPin] = useState<GalleryPinItem | null>(null);
  const initialLoadSkippedRef = useRef(false);

  const showTopAd = Boolean(
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID &&
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY_TOP,
  );
  const showInlineAds = Boolean(
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID &&
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_GALLERY_GRID,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(searchInput.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  async function fetchPins(nextPage: number, nextQuery: string, append: boolean) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: "15",
    });

    if (nextQuery) {
      params.set("search", nextQuery);
    }

    const response = await fetch(`/api/gallery/pins?${params.toString()}`, {
      cache: "no-store",
    });

    const payload = (await response.json()) as GalleryPinsResult & { error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load gallery pins.");
    }

    setPins((current) => (append ? [...current, ...payload.items] : payload.items));
    setPage(payload.page);
    setHasMore(payload.hasMore);
  }

  useEffect(() => {
    if (!initialLoadSkippedRef.current) {
      initialLoadSkippedRef.current = true;
      return;
    }

    let ignore = false;

    async function run() {
      try {
        setError("");
        setIsLoading(true);
        const params = new URLSearchParams({
          page: "1",
          limit: "15",
        });

        if (query) {
          params.set("search", query);
        }

        const response = await fetch(`/api/gallery/pins?${params.toString()}`, {
          cache: "no-store",
        });

        const payload = (await response.json()) as GalleryPinsResult & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load gallery pins.");
        }

        if (!ignore) {
          setPins(payload.items);
          setPage(payload.page);
          setHasMore(payload.hasMore);
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error instanceof Error ? error.message : "Unable to load gallery pins right now.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void run();

    return () => {
      ignore = true;
    };
  }, [query]);

  async function loadMore() {
    try {
      setIsLoadingMore(true);
      setError("");
      await fetchPins(page + 1, query, true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load more gallery pins.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  const resultLabel = useMemo(() => {
    if (query) {
      return `Showing results for "${query}"`;
    }

    return "Browse the latest gallery pins.";
  }, [query]);

  return (
    <>
      <div className="space-y-8">
        <section className="space-y-5">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Gallery
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
              A gallery of visuals, builds, and ideas.
            </h1>
            <p className="text-base leading-8 text-text/70">
              Search by title, explore the latest uploads, and open any pin to view the full
              gallery with download support.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text/40" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search gallery pins by title"
              className="h-14 w-full rounded-full border border-black/8 bg-white pl-12 pr-5 text-sm text-text outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <p className="text-sm text-text/60">{resultLabel}</p>
        </section>

        {showTopAd ? (
          <section className="rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
            <AdUnit slot="gallery-top" format="horizontal" />
          </section>
        ) : null}

        {error ? (
          <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading && !pins.length ? (
          <GallerySkeletonGrid />
        ) : pins.length ? (
          <GalleryMasonry pins={pins} onSelect={setSelectedPin} showInlineAds={showInlineAds} />
        ) : (
          <div className="rounded-[24px] border border-black/6 bg-white px-6 py-12 text-center text-sm text-text/60">
            No gallery pins found for this search yet.
          </div>
        )}

        {isLoading && pins.length ? <GallerySkeletonGrid /> : null}

        {hasMore ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        ) : null}
      </div>

      {selectedPin ? (
        <GalleryLightbox pin={selectedPin} onClose={() => setSelectedPin(null)} />
      ) : null}
    </>
  );
}
