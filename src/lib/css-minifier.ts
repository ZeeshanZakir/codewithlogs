export type CssValidationResult =
  | {
      isValid: true;
      errorMessage: "";
    }
  | {
      isValid: false;
      errorMessage: string;
    };

export const sampleCss = `/* Theme variables */
:root {
  --brand: #0f6e56;
  --surface: #f6faf8;
  --text: #0f172a;
}

body {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  color: var(--text);
  background: #ffffff;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.card-grid .card {
  padding: 24px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, var(--surface) 100%);
  box-shadow: 0 18px 45px rgba(15, 110, 86, 0.08);
}

.card-grid .card:hover {
  transform: translateY(-4px);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

@media (max-width: 960px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}`;

function readQuotedString(input: string, startIndex: number) {
  const quote = input[startIndex];
  let index = startIndex + 1;

  while (index < input.length) {
    const current = input[index];

    if (current === "\\") {
      index += 2;
      continue;
    }

    if (current === quote) {
      return {
        value: input.slice(startIndex, index + 1),
        endIndex: index,
      };
    }

    index += 1;
  }

  return null;
}

export function validateCss(input: string): CssValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      errorMessage: "Please paste CSS before running the tool.",
    };
  }

  let braceDepth = 0;
  let inComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    const next = input[index + 1];

    if (inComment) {
      if (current === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (current === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (current === '"' || current === "'") {
      const result = readQuotedString(input, index);

      if (!result) {
        return {
          isValid: false,
          errorMessage: "Unterminated string found in the CSS input.",
        };
      }

      index = result.endIndex;
      continue;
    }

    if (current === "{") {
      braceDepth += 1;
    }

    if (current === "}") {
      braceDepth -= 1;

      if (braceDepth < 0) {
        return {
          isValid: false,
          errorMessage: "Unexpected closing brace found in the CSS input.",
        };
      }
    }
  }

  if (inComment) {
    return {
      isValid: false,
      errorMessage: "Unterminated CSS comment found in the input.",
    };
  }

  if (braceDepth !== 0) {
    return {
      isValid: false,
      errorMessage: "CSS braces are unbalanced. Check your opening and closing braces.",
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  };
}

export function minifyCss(input: string) {
  let output = "";
  let inComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    const next = input[index + 1];

    if (inComment) {
      if (current === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (current === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (current === '"' || current === "'") {
      const result = readQuotedString(input, index);

      if (!result) {
        throw new Error("Unterminated string found in the CSS input.");
      }

      output += result.value;
      index = result.endIndex;
      continue;
    }

    if (/\s/.test(current)) {
      const previous = output.at(-1) ?? "";
      let nextNonWhitespaceIndex = index + 1;

      while (nextNonWhitespaceIndex < input.length && /\s/.test(input[nextNonWhitespaceIndex])) {
        nextNonWhitespaceIndex += 1;
      }

      const nextNonWhitespace = input[nextNonWhitespaceIndex] ?? "";
      const canDropWhitespace =
        !previous ||
        !nextNonWhitespace ||
        /[{}:;,>+~(),]/.test(previous) ||
        /[{}:;,>+~(),]/.test(nextNonWhitespace);

      if (!canDropWhitespace) {
        output += " ";
      }

      continue;
    }

    if (current === ";" && next === "}") {
      continue;
    }

    output += current;
  }

  return output.replace(/\s+/g, " ").replace(/ ?([{}:;,>+~(),]) ?/g, "$1").trim();
}

export function beautifyCss(input: string) {
  const minified = minifyCss(input);
  let output = "";
  let indentLevel = 0;

  for (let index = 0; index < minified.length; index += 1) {
    const current = minified[index];

    if (current === '"' || current === "'") {
      const result = readQuotedString(minified, index);

      if (!result) {
        throw new Error("Unterminated string found in the CSS input.");
      }

      output += result.value;
      index = result.endIndex;
      continue;
    }

    if (current === "{") {
      output += " {\n";
      indentLevel += 1;
      output += `${"  ".repeat(indentLevel)}`;
      continue;
    }

    if (current === ";") {
      output += ";\n";
      output += `${"  ".repeat(indentLevel)}`;
      continue;
    }

    if (current === "}") {
      output = output.replace(/[ \t]+$/g, "").replace(/\n{2,}$/g, "\n");

      if (!output.endsWith("\n")) {
        output += "\n";
      }

      indentLevel = Math.max(0, indentLevel - 1);
      output += `${"  ".repeat(indentLevel)}}`;

      if (index < minified.length - 1) {
        output += "\n";
        if (minified[index + 1] !== "}") {
          output += "\n";
          output += `${"  ".repeat(indentLevel)}`;
        }
      }

      continue;
    }

    output += current;
  }

  return output.replace(/\n{3,}/g, "\n\n").trim();
}

export function formatCssSize(value: string) {
  const bytes = new TextEncoder().encode(value).length;

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
}

export function getSavingsPercentage(original: string, minified: string) {
  const originalBytes = new TextEncoder().encode(original).length;

  if (!originalBytes) {
    return 0;
  }

  const minifiedBytes = new TextEncoder().encode(minified).length;
  return Math.max(0, Math.round(((originalBytes - minifiedBytes) / originalBytes) * 100));
}
