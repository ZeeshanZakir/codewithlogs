export type IndentMode = 2 | 4 | "\t";

export type JsonValidationResult =
  | {
      isValid: true;
      parsed: unknown;
      errorMessage: "";
      keyCount: number;
    }
  | {
      isValid: false;
      parsed: null;
      errorMessage: string;
      keyCount: 0;
    };

export const sampleJson = {
  app: "CodeWithLogs",
  tool: "JSON Formatter & Validator",
  features: ["format", "validate", "minify", "copy"],
  owner: {
    name: "Zeeshan Zakir",
    role: "Full-Stack Developer",
    verified: true,
  },
  apiResponse: {
    status: "success",
    statusCode: 200,
    timestamp: "2026-06-12T10:30:00.000Z",
    data: {
      articles: 12,
      categories: ["Next.js", "React", "MongoDB", "SaaS"],
      metadata: {
        cached: false,
        responseTimeMs: 184,
        region: "fra1",
      },
    },
  },
  settings: {
    indent: 2,
    sendToServer: false,
    experimental: null,
  },
};

export function indentToWhitespace(indentMode: IndentMode) {
  return indentMode === "\t" ? "\t" : " ".repeat(indentMode);
}

export function getLineCount(value: string) {
  if (!value) {
    return 0;
  }

  return value.split(/\r\n|\r|\n/).length;
}

export function countJsonKeys(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce((count, item) => count + countJsonKeys(item), 0);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((count, [, nestedValue]) => {
      return count + 1 + countJsonKeys(nestedValue);
    }, 0);
  }

  return 0;
}

export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      parsed: null,
      errorMessage: "",
      keyCount: 0,
    };
  }

  try {
    const parsed = JSON.parse(input) as unknown;

    return {
      isValid: true,
      parsed,
      errorMessage: "",
      keyCount: countJsonKeys(parsed),
    };
  } catch (error) {
    return {
      isValid: false,
      parsed: null,
      errorMessage: error instanceof Error ? error.message : "Invalid JSON input.",
      keyCount: 0,
    };
  }
}

export function formatJson(input: string, indentMode: IndentMode) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indentToWhitespace(indentMode));
}

export function minifyJson(input: string) {
  return JSON.stringify(JSON.parse(input));
}
