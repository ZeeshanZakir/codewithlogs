import type { Metadata } from "next";

import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { getGalleryPins } from "@/lib/gallery";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore a responsive gallery of visuals, product inspiration, and creative web development ideas.",
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: {
    title: "Gallery | CodeWithLogs",
    description:
      "Explore a responsive gallery of visuals, product inspiration, and creative web development ideas.",
    url: `${siteUrl}/gallery`,
    type: "website",
  },
};

export default async function GalleryPage() {
  const initialData = await getGalleryPins({
    page: 1,
    limit: 15,
  });

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <GalleryPageClient initialData={initialData} />
      </div>
    </div>
  );
}
