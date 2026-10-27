import postcss, { type Root, type Node } from "postcss";

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

function parseCss(input: string): Root {
  if (!input.trim()) throw new Error("Enter CSS to process.");
  const root = postcss.parse(input, { from: undefined });
  if (root.nodes.some(node => node.type === "decl")) {
    throw new Error("Declarations must be inside a rule or at-rule block.");
  }
  return root;
}

export function validateCss(input: string): CssValidationResult {
  if (!input.trim()) return { isValid: false, errorMessage: "" };
  try {
    parseCss(input);
    return { isValid: true, errorMessage: "" };
  } catch (error) {
    return { isValid: false, errorMessage: error instanceof Error ? error.message : "Unsupported CSS syntax." };
  }
}

// Only change structural whitespace. Values, selectors, comments, escape sequences,
// declaration order and custom-property token streams remain untouched.
export function minifyCss(input: string) {
  const root = parseCss(input);
  root.walk(node => {
    if (/^\s*$/.test(node.raws.before ?? "")) node.raws.before = "";
    if ("nodes" in node && /^\s*$/.test(node.raws.after ?? "")) node.raws.after = "";
    if (node.type === "rule" || node.type === "atrule") {
      if (/^\s*$/.test(node.raws.between ?? "")) node.raws.between = "";
    } else if (node.type === "decl" && !node.prop.startsWith("--")) {
      if (/^\s*:\s*$/.test(node.raws.between ?? "")) node.raws.between = ":";
    }
  });
  if (/^\s*$/.test(root.raws.after ?? "")) root.raws.after = "";
  return root.toString();
}

export function beautifyCss(input: string) {
  const root = parseCss(input);
  root.walk(node => {
    let depth = 0;
    for (let parent: Node | undefined = node.parent; parent && parent.type !== "root"; parent = parent.parent) depth++;
    if (/^\s*$/.test(node.raws.before ?? "")) {
      node.raws.before = (node === root.first ? "" : "\n") + "  ".repeat(depth);
    }
    if ("nodes" in node && /^\s*$/.test(node.raws.after ?? "")) node.raws.after = "\n" + "  ".repeat(depth);
    if ((node.type === "rule" || node.type === "atrule") && /^\s*$/.test(node.raws.between ?? "")) node.raws.between = " ";
    if (node.type === "decl" && !node.prop.startsWith("--") && /^\s*:\s*$/.test(node.raws.between ?? "")) node.raws.between = ": ";
  });
  root.raws.after = "";
  return root.toString();
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
