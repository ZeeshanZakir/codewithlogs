export type KeywordDensityRow = {
  word: string;
  count: number;
  density: number;
};

export type PlatformLimitStatus = "safe" | "warning" | "danger";

export type PlatformLimit = {
  label: string;
  limit: number;
  count: number;
  status: PlatformLimitStatus;
};

const stopWords = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "and",
  "or",
  "but",
  "if",
  "then",
  "than",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "as",
  "at",
  "by",
  "from",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "into",
  "your",
  "you",
  "we",
  "they",
  "he",
  "she",
  "them",
  "our",
  "their",
  "i",
  "me",
  "my",
  "mine",
  "so",
  "not",
  "can",
  "will",
  "just",
  "up",
  "out",
  "about",
  "over",
  "after",
  "before",
  "also",
]);

const socialLimits = [
  { label: "Twitter/X", limit: 280 },
  { label: "LinkedIn Post", limit: 3000 },
  { label: "Instagram Caption", limit: 2200 },
  { label: "Meta Description", limit: 160 },
  { label: "Title Tag", limit: 60 },
] as const;

export function normalizeWords(text: string) {
  return text
    .toLowerCase()
    .match(/\b[\p{L}\p{N}']+\b/gu)?.filter(Boolean) ?? [];
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

export function countCharactersWithSpaces(text: string) {
  return text.length;
}

export function countCharactersWithoutSpaces(text: string) {
  return text.replace(/\s/g, "").length;
}

export function countSentences(text: string) {
  return text.match(/[.!?]+/g)?.length ?? 0;
}

export function countParagraphs(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  return trimmedText.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0).length;
}

export function getReadingTime(wordCount: number) {
  if (!wordCount) {
    return "0 min";
  }

  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min`;
}

export function getKeywordDensity(text: string): KeywordDensityRow[] {
  const words = normalizeWords(text).filter((word) => !stopWords.has(word));

  if (!words.length) {
    return [];
  }

  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([word, count]) => ({
      word,
      count,
      density: Number(((count / words.length) * 100).toFixed(2)),
    }))
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word))
    .slice(0, 10);
}

function getLimitStatus(count: number, limit: number): PlatformLimitStatus {
  const ratio = count / limit;

  if (ratio > 1) {
    return "danger";
  }

  if (ratio >= 0.85) {
    return "warning";
  }

  return "safe";
}

export function getSocialLimits(characterCount: number): PlatformLimit[] {
  return socialLimits.map((platform) => ({
    label: platform.label,
    limit: platform.limit,
    count: characterCount,
    status: getLimitStatus(characterCount, platform.limit),
  }));
}

export function buildTextFileUrl(text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  return URL.createObjectURL(blob);
}
