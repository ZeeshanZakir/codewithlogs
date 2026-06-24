export type GalleryPinItem = {
  id: string;
  title: string;
  images: string[];
  description: string;
  createdAt: string;
};

export type GalleryPinsResult = {
  items: GalleryPinItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};
