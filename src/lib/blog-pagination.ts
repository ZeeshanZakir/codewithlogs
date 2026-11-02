export const POSTS_PER_PAGE = 9;

export function parseArchivePage(value?: string | string[]): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return raw && /^\d+$/.test(raw) && Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function archivePagePath(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}
