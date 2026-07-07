import { Fragment } from "react";

type JsonSyntaxHighlighterProps = {
  content: string;
};

type JsonToken =
  | { type: "text"; value: string }
  | { type: "key"; value: string }
  | { type: "string"; value: string }
  | { type: "number"; value: string }
  | { type: "literal"; value: string };

const tokenPattern =
  /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:|"(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function classifyToken(value: string): JsonToken {
  if (value.endsWith(":")) {
    return {
      type: "key",
      value,
    };
  }

  if (value.startsWith('"')) {
    return {
      type: "string",
      value,
    };
  }

  if (value === "true" || value === "false" || value === "null") {
    return {
      type: "literal",
      value,
    };
  }

  return {
    type: "number",
    value,
  };
}

function tokenizeLine(line: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const [matchedValue] = match;
    const startIndex = match.index ?? 0;

    if (startIndex > lastIndex) {
      tokens.push({
        type: "text",
        value: line.slice(lastIndex, startIndex),
      });
    }

    tokens.push(classifyToken(matchedValue));
    lastIndex = startIndex + matchedValue.length;
  }

  if (lastIndex < line.length) {
    tokens.push({
      type: "text",
      value: line.slice(lastIndex),
    });
  }

  return tokens;
}

function tokenClassName(type: JsonToken["type"]) {
  switch (type) {
    case "key":
      return "text-[#185FA5]";
    case "string":
      return "text-[#3B6D11]";
    case "number":
      return "text-[#854F0B]";
    case "literal":
      return "text-[#3C3489]";
    default:
      return "text-slate-700";
  }
}

export function JsonSyntaxHighlighter({ content }: JsonSyntaxHighlighterProps) {
  const lines = content.split("\n");

  return (
    <div className="min-h-[300px] overflow-auto rounded-[24px] border border-black/8 bg-[#fbfcfd]">
      <div className="grid min-w-full grid-cols-[64px_minmax(0,1fr)] font-mono text-sm leading-7">
        {lines.map((line, index) => (
          <Fragment key={`${index}-${line}`}>
            <div className="select-none border-r border-black/6 px-4 py-1 text-right text-slate-400">
              {index + 1}
            </div>
            <pre className="overflow-x-auto px-4 py-1 text-slate-700">
              {line.length ? (
                tokenizeLine(line).map((token, tokenIndex) => (
                  <span
                    key={`${index}-${tokenIndex}-${token.value}`}
                    className={tokenClassName(token.type)}
                  >
                    {token.value}
                  </span>
                ))
              ) : (
                <span>&nbsp;</span>
              )}
            </pre>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
