import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { GalleryUploadForm } from "@/components/gallery/GalleryUploadForm";

export const dynamic = "force-dynamic";

export default async function UploadGalleryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return <GalleryUploadForm />;
}
