"use client";

import { useState, useMemo, JSX } from "react";
import {
  explainRegex,
  FLAGS,
  COMMON_PATTERNS,
  SAMPLE_PATTERN,
  SAMPLE_TEXT,
  type CommonPattern,
} from "@/lib/regex-tester";

export function RegexTesterTool() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const { regex, error, matches } = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags.join(""));
      // matchAll advances safely after zero-width matches, including Unicode.
      const matches = flags.includes("g")
        ? Array.from(testText.matchAll(regex))
        : (() => { const match = regex.exec(testText); return match ? [match] : []; })();
      return { regex, error: null, matches };
    } catch (cause) {
      return { regex: null, error: cause instanceof Error ? cause.message : "Invalid regex", matches: [] };
    }
  }, [pattern, flags, testText]);

  const explanations = useMemo(() => explainRegex(pattern), [pattern]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const loadPattern = (p: CommonPattern) => {
    setPattern(p.pattern);
    setFlags(p.flags ? p.flags.split("") : []);
  };

  const highlightText = () => {
    if (!regex || matches.length === 0) {
      return <span>{testText}</span>;
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.index! > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{testText.slice(lastIndex, match.index!)}</span>);
      }
      parts.push(
        <mark
          key={`match-${idx}`}
          className="bg-yellow-200 text-slate-900 rounded px-0.5"
          title={`Match #${idx + 1}`}
        >
          {match[0]}
        </mark>
      );
      lastIndex = match.index! + match[0].length;
    });

    if (lastIndex < testText.length) {
      parts.push(<span key="text-end">{testText.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based Regex Tester
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Regex Tester — Test, Debug, and Understand Regular Expressions
          </h1>
          <p className="text-base leading-8 text-text/70">
            Test regular expressions in real time with match highlighting, group capture, and plain-English explanations.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Pattern</p>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your regex pattern here"
              className={`w-full rounded-[24px] border px-4 py-3 text-sm font-mono outline-none transition-shadow focus:ring-4 focus:ring-primary/10 ${
                error ? "border-red-400 bg-red-50" : "border-black/8 bg-[#fbfcfd]"
              }`}
            />
            {error && (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {FLAGS.map((flag) => (
              <label
                key={flag.key}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm cursor-pointer hover:border-primary/20 hover:text-primary"
              >
                <input
                  type="checkbox"
                  checked={flags.includes(flag.key)}
                  onChange={() => toggleFlag(flag.key)}
                  className="h-4 w-4 rounded border-black/15 accent-primary"
                />
                {flag.label}
                <span className="text-xs text-text/60">({flag.description})</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-text">Test Text</p>
              <button
                onClick={() => setTestText(SAMPLE_TEXT)}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                Load Sample Text
              </button>
            </div>
            <div className="min-h-[180px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 text-sm leading-7 text-slate-800">
              {highlightText()}
            </div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Paste your text here to test"
              spellCheck={false}
              className="min-h-[140px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">Matches</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                {matches.length} match{matches.length !== 1 ? "es" : ""} found
              </span>
            </div>

            {matches.length > 0 && (
              <div className="space-y-3">
                {matches.map((match, matchIdx) => (
                  <div
                    key={matchIdx}
                    className="rounded-[20px] border border-black/6 bg-surface/70 p-4"
                  >
                    <p className="text-sm font-semibold text-text mb-2">Match #{matchIdx + 1}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-mono text-text/70">Full match: &quot;{match[0]}&quot;</p>
                      {match.slice(1).map((group, groupIdx) => {
                        const name = Object.keys(match.groups || {}).find(
                          (n) => match.groups?.[n] === group
                        );
                        return (
                          <p key={groupIdx} className="text-sm font-mono text-text/70">
                            {name ? `Group "${name}"` : `Group ${groupIdx + 1}`}: &quot;{group}&quot;
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 space-y-3">
            <p className="text-sm font-semibold text-text">Pattern Explanation</p>
            <ul className="space-y-1 list-disc list-inside text-sm text-text/70">
              {explanations.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Common Patterns</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_PATTERNS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => loadPattern(p)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
