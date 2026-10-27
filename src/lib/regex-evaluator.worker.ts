export type RegexRequest = { pattern: string; flags: string; text: string };
export type RegexMatch = { values: (string | undefined)[]; index: number; groups?: Record<string, string | undefined> };
export type RegexResult = { matches: RegexMatch[]; error: string | null; truncated: boolean };

// This function must only run in a terminable worker, never on the UI thread.
export function evaluateRegex({ pattern, flags, text }: RegexRequest): RegexResult {
  if (pattern.length > 500 || text.length > 20000) {
    return { matches: [], error: "Limit: 500 pattern characters and 20,000 text characters.", truncated: false };
  }
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let outputSize = 0;
    const iterator = flags.includes("g") ? text.matchAll(regex) : [regex.exec(text)];
    for (const match of iterator) {
      if (!match) continue;
      outputSize += match.reduce((sum, value) => sum + (value?.length ?? 0), 0);
      if (matches.length >= 1000 || outputSize > 100000) return { matches, error: null, truncated: true };
      matches.push({ values: Array.from(match), index: match.index!, groups: match.groups });
    }
    return { matches, error: null, truncated: false };
  } catch (error) {
    return { matches: [], error: error instanceof Error ? error.message : "Invalid regex.", truncated: false };
  }
}

if (typeof self !== "undefined") {
  self.onmessage = (event: MessageEvent<RegexRequest>) => self.postMessage(evaluateRegex(event.data));
  self.postMessage({ ready: true });
}
