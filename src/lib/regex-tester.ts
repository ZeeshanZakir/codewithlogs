export interface RegexFlag {
  key: string;
  label: string;
  description: string;
}

export const FLAGS: RegexFlag[] = [
  { key: "g", label: "g", description: "Global match" },
  { key: "i", label: "i", description: "Case-insensitive" },
  { key: "m", label: "m", description: "Multiline" },
  { key: "s", label: "s", description: "DotAll" },
];

export interface CommonPattern {
  name: string;
  pattern: string;
  flags: string;
}

export const COMMON_PATTERNS: CommonPattern[] = [
  { name: "Email", pattern: "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$", flags: "" },
  { name: "URL", pattern: "^https?:\\/\\/.+", flags: "i" },
  { name: "Phone Number (US)", pattern: "^\\d{3}-\\d{3}-\\d{4}$", flags: "" },
  { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-\\d{2}-\\d{2}$", flags: "" },
  { name: "IPv4 Address", pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", flags: "" },
  { name: "Hex Color", pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", flags: "i" },
];

export const SAMPLE_PATTERN = "\\b(\\w+)@(\\w+\\.\\w+)\\b";
export const SAMPLE_TEXT = "Contact us at support@example.com or sales@company.org for more info.";

// Rule-based regex explainer
export function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];
  let i = 0;
  const len = pattern.length;

  while (i < len) {
    const char = pattern[i];
    switch (char) {
      case "\\":
        i++;
        if (i < len) {
          const next = pattern[i];
          const escaped = {
            "d": "a digit (0-9)",
            "D": "a non-digit",
            "w": "a word character (a-z, A-Z, 0-9, _)",
            "W": "a non-word character",
            "s": "a whitespace character (space, tab, newline)",
            "S": "a non-whitespace character",
            "b": "a word boundary",
            "B": "a non-word boundary",
            "n": "a newline",
            "t": "a tab",
            ".": "a literal dot",
            "*": "a literal asterisk",
            "+": "a literal plus",
            "?": "a literal question mark",
            "^": "a literal caret",
            "$": "a literal dollar sign",
            "(": "a literal opening parenthesis",
            ")": "a literal closing parenthesis",
            "[": "a literal opening bracket",
            "]": "a literal closing bracket",
            "{": "a literal opening brace",
            "}": "a literal closing brace",
            "|": "a literal pipe",
            "\\": "a literal backslash",
          }[next];
          if (escaped) {
            explanations.push(`\\${next}: ${escaped}`);
          } else {
            explanations.push(`\\${next}: literal "${next}"`);
          }
          i++;
        }
        break;
      case "^":
        explanations.push("^: start of string (or line with m flag)");
        i++;
        break;
      case "$":
        explanations.push("$: end of string (or line with m flag)");
        i++;
        break;
      case ".":
        explanations.push(".: any character except newline");
        i++;
        break;
      case "*":
        explanations.push("*: zero or more times");
        i++;
        break;
      case "+":
        explanations.push("+: one or more times");
        i++;
        break;
      case "?":
        explanations.push("?: zero or one time (optional)");
        i++;
        break;
      case "{": {
        i++;
        let quantifier = "";
        while (i < len && pattern[i] !== "}") {
          quantifier += pattern[i];
          i++;
        }
        i++;
        if (quantifier.includes(",")) {
          const [min, max] = quantifier.split(",");
          if (!max) {
            explanations.push(`{${min},}: ${min} or more times`);
          } else if (min === max) {
            explanations.push(`{${min}}: exactly ${min} times`);
          } else {
            explanations.push(`{${min},${max}}: between ${min} and ${max} times`);
          }
        } else {
          explanations.push(`{${quantifier}}: exactly ${quantifier} times`);
        }
        break;
      }
      case "(":
        i++;
        if (i < len && pattern[i] === "?") {
          i++;
          if (i < len && pattern[i] === "<") {
            i++;
            let name = "";
            while (i < len && pattern[i] !== ">") {
              name += pattern[i];
              i++;
            }
            i++;
            explanations.push(`(?<${name}>): named capture group "${name}"`);
          } else if (i < len && pattern[i] === ":") {
            i++;
            explanations.push("(?:...): non-capturing group");
          } else {
            explanations.push("(...): capture group");
          }
        } else {
          explanations.push("(...): capture group");
        }
        break;
      case ")":
        i++;
        break;
      case "[":
        i++;
        let charClass = "";
        while (i < len && pattern[i] !== "]") {
          charClass += pattern[i];
          i++;
        }
        i++;
        if (charClass.startsWith("^")) {
          explanations.push(`[^${charClass.slice(1)}]: any character NOT in [${charClass.slice(1)}]`);
        } else {
          explanations.push(`[${charClass}]: any character in [${charClass}]`);
        }
        break;
      case "]":
        i++;
        break;
      case "|":
        explanations.push("|: OR");
        i++;
        break;
      default:
        explanations.push(`"${char}": literal character`);
        i++;
        break;
    }
  }
  return explanations;
}
