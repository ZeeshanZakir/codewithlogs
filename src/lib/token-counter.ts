import { encode } from "gpt-tokenizer/encoding/o200k_base";

export type ModelType = "gpt" | "claude" | "gemini";

export interface TokenCountResult {
  tokenCount: number;
  characterCount: number;
  wordCount: number;
  estimatedCost: number;
}

export interface ModelConfig {
  name: string;
  pricePerMillion: number;
  note?: string;
}

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  gpt: {
    name: "GPT-4o",
    note: "Local o200k_base text count; excludes message framing and other request inputs",
    pricePerMillion: 2.5,
  },
  claude: {
    name: "Claude",
    pricePerMillion: 3.0,
    note: "Heuristic: UTF-16 text length divided by four, rounded up; not a provider tokenizer",
  },
  gemini: {
    name: "Gemini",
    pricePerMillion: 0.15,
    note: "Heuristic: UTF-16 text length divided by four, rounded up; not a provider tokenizer",
  },
};

export function countTokens(text: string, model: ModelType): number {
  if (!text) {
    return 0;
  }

  if (model === "gpt") {
    return encode(text).length;
  }

  // Claude and Gemini approximation
  return Math.ceil(text.length / 4);
}

export function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function calculateCost(
  tokenCount: number,
  pricePerMillion: number
): number {
  return (tokenCount / 1_000_000) * pricePerMillion;
}

export function getTokenCountResult(
  text: string,
  model: ModelType
): TokenCountResult {
  const tokenCount = countTokens(text, model);
  const config = MODEL_CONFIGS[model];

  return {
    tokenCount,
    characterCount: text.length,
    wordCount: countWords(text),
    estimatedCost: calculateCost(
      tokenCount,
      config.pricePerMillion
    ),
  };
}

export const CONTEXT_WINDOWS = [
  { name: "8K", size: 8_192 },
  { name: "32K", size: 32_768 },
  { name: "128K", size: 131_072 },
  { name: "200K", size: 204_800 },
] as const;

export function formatCost(cost: number): string {
  if (cost < 0.0001) {
    return "< $0.0001";
  }

  return `$${cost.toFixed(4)}`;
}