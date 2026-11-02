import { openGraphDefaults } from "@/lib/open-graph";
import type { Metadata } from "next";

import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { getGalleryPins } from "@/lib/gallery";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse uploaded website designs and hosting visuals. Search pins by title, open image galleries, and download images.",
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: { ...openGraphDefaults,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${siteUrl}/gallery#collection`, url: `${siteUrl}/gallery`, name: "Gallery", mainEntity: { "@type": "ItemList", numberOfItems: initialData.items.length, itemListElement: initialData.items.map((pin, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "ImageObject", "@id": `${siteUrl}/gallery#pin-${pin.id}`, url: `${siteUrl}/gallery#pin-${pin.id}`, name: pin.title, contentUrl: new URL(pin.images[0], siteUrl).href, ...(pin.description ? { description: pin.description } : {}) } })) } }).replace(/</g, "\\u003c") }} />
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <GalleryPageClient initialData={initialData} />
      </div>
    </div>
  );
}
