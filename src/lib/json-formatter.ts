import { visit, printParseErrorCode, format, applyEdits, createScanner } from "jsonc-parser";

export type IndentMode = 2 | 4 | "\t";

export type JsonValidationResult =
  | {
      isValid: true;
      errorMessage: "";
      keyCount: number;
    }
  | {
      isValid: false;
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
  if (!input.trim()) return { isValid: false, errorMessage: "", keyCount: 0 };
  let keyCount = 0;
  let issue = "";
  const objects: Set<string>[] = [];
  try {
    visit(input, {
      onObjectBegin: () => { objects.push(new Set()); },
      onObjectProperty: (name, offset) => {
        const keys = objects[objects.length - 1];
        if (keys.has(name) && !issue) issue = `Duplicate object key ${JSON.stringify(name)} at character ${offset + 1}. Rename or remove it before formatting.`;
        keys.add(name);
        keyCount++;
      },
      onObjectEnd: () => { objects.pop(); },
      onError: (code, offset) => { if (!issue) issue = `${printParseErrorCode(code)} at character ${offset + 1}.`; },
    }, { disallowComments: true, allowTrailingComma: false, allowEmptyContent: false });
  } catch {
    issue = "JSON nesting is too deep to process safely.";
  }
  return issue ? { isValid: false, errorMessage: issue, keyCount: 0 } : { isValid: true, errorMessage: "", keyCount };
}

function requireValidJson(input: string) {
  const result = validateJson(input);
  if (!result.isValid) throw new Error(result.errorMessage || "Enter JSON to process.");
}

export function formatJson(input: string, indentMode: IndentMode) {
  requireValidJson(input);
  // Whitespace edits never convert number tokens to JavaScript numbers.
  return applyEdits(input, format(input, undefined, {
    insertSpaces: indentMode !== "\t", tabSize: indentMode === "\t" ? 1 : indentMode,
    eol: "\n", keepLines: false,
  })).trim();
}

export function minifyJson(input: string) {
  requireValidJson(input);
  const scanner = createScanner(input, true);
  let output = "";
  while (true) {
    scanner.scan();
    if (scanner.getTokenLength() === 0) break;
    output += input.slice(scanner.getTokenOffset(), scanner.getTokenOffset() + scanner.getTokenLength());
  }
  return output;
}
