import { siteUrl } from "@/lib/site-url";

const brandImage = {
  url: new URL("/images/codewithlogs-logo.png", siteUrl).href,
  width: 1067,
  height: 234,
  type: "image/png",
  alt: "CodeWithLogs — developer troubleshooting and tools",
};

// Page-level openGraph objects replace parent objects; spread these explicitly.
export const openGraphDefaults = {
  siteName: "CodeWithLogs",
  locale: "en_US",
  images: [brandImage],
};

// Dimensions and MIME types measured from the existing public cover files.
// Match the exact image URL so a replacement never inherits stale dimensions.
const verifiedArticleImages: Readonly<Record<string, {
  width: number; height: number; type: string;
}>> = {
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1781344772715-How-to-Deploy-a-Next.js-App-to-Vercel-%E2%80%94-Complete-Guide.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783524565337-code-with-logs-blog-cover.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783949910470-How-I-Built-an-Inventory-Management-System-Using-Next.js-and-Supabase.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783953592116-10-Supabase-Errors-I-Faced-in-Production-%28And-Their-Fixes%29.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783954686248-My-Complete-Next.js-Folder-Structure-for-Large-Projects.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783954918639-How-I-Built-Authentication-in-Next.js-Without-NextAuth.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783955830682-How-I-Debug-Production-Errors-in.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783956469186-Supabase-Row-Level-Security-Explained-with-Real-Examples.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783957027944-How-I-Reduced-My-Next.js-Website-Loading-Time.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1783957608367-Common-Vercel-Deployment-Errors-and-Their-Solutions.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1792684056512-573afc65-f2ec-4aef-b37e-bf167c15be0d.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1792684265165-a68b7615-0574-4101-b699-ae5272cd4a19.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1792684447263-bebd0898-e15c-449e-8b40-ed0c5ef8596e.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1792684757008-64127330-b531-47f0-9091-34cdf5be07b4.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1792685480267-edeaedbb-7a22-4a98-bf5c-46a916369849.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1793118997023-994867f4-355f-4c52-badb-af7aafded643.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1793119837700-c783be5e-9ecc-4cb9-aa63-0d75fcf79f15.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1793119896133-d0102f3d-583e-4059-a46d-05e96e173c99.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  },
  "https://1lmhxjcxcskpaaai.public.blob.vercel-storage.com/blog/1793120251698-1f89f3a4-694c-435d-85fd-52ff9ee2f2e3.webp": {
    "width": 1200,
    "height": 630,
    "type": "image/webp"
  }
};

export function articleOpenGraphImage(coverImage: string, title: string) {
  if (!coverImage) return brandImage;
  const url = new URL(coverImage, siteUrl);
  if (url.protocol !== "https:") return brandImage;
  return { url: url.href, alt: title, ...verifiedArticleImages[url.href] };
}
