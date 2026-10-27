"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clipboard, Eraser, FileJson2, Minimize2, WandSparkles, XCircle } from "lucide-react";

import { JsonSyntaxHighlighter } from "@/components/tools/JsonSyntaxHighlighter";
import { JsonToolSeoContent } from "@/components/tools/JsonToolSeoContent";
import {
  formatJson,
  getLineCount,
  minifyJson,
  sampleJson,
  type IndentMode,
  validateJson,
} from "@/lib/json-formatter";

type ToolMode = "idle" | "formatted" | "minified";

const indentOptions: Array<{ label: string; value: IndentMode }> = [
  { label: "2 spaces", value: 2 },
  { label: "4 spaces", value: 4 },
  { label: "Tab", value: "\t" },
];

function getMetrics(value: string, keyCount: number) {
  return {
    characterCount: value.length,
    lineCount: getLineCount(value),
    keyCount,
  };
}

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentMode, setIndentMode] = useState<IndentMode>(2);
  const [toolMode, setToolMode] = useState<ToolMode>("idle");
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => validateJson(input), [input]);
  const activeValue = output || input;
  const metrics = useMemo(
    () => getMetrics(activeValue, validation.isValid ? validation.keyCount : 0),
    [activeValue, validation],
  );

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function handleFormat() {
    if (!input.trim()) {
      return;
    }

    if (!validation.isValid) {
      setOutput("");
      setToolMode("idle");
      return;
    }

    setOutput(formatJson(input, indentMode));
    setToolMode("formatted");
  }

  function handleMinify() {
    if (!input.trim()) {
      return;
    }

    if (!validation.isValid) {
      setOutput("");
      setToolMode("idle");
      return;
    }

    setOutput(minifyJson(input));
    setToolMode("minified");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setCopied(false);
    setToolMode("idle");
  }

  function handleLoadSample() {
    const sampleText = JSON.stringify(sampleJson, null, indentMode === "\t" ? "\t" : indentMode);
    setInput(sampleText);
    setOutput(sampleText);
    setToolMode("formatted");
  }

  async function handleCopyOutput() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  function renderStatusLabel() {
    if (!input.trim()) {
      return <span className="text-text/60">Paste JSON or load the sample to get started.</span>;
    }

    if (validation.isValid) {
      return (
        <span className="inline-flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          ✓ Valid JSON
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 text-red-700">
        <XCircle className="h-4 w-4" />
        ✗ Error: {validation.errorMessage}
      </span>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based JSON utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            JSON Formatter &amp; Validator — Free Online Tool
          </h1>
          <p className="text-base leading-8 text-text/70">
            Format, validate, minify, and inspect JSON instantly in your browser. No API calls. No
            uploads. The formatting code processes your input locally; separate page analytics and advertising requests may still occur.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">Input JSON</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-text/45">
                    Paste raw JSON here
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  <FileJson2 className="h-4 w-4" />
                  Sample JSON
                </button>
              </div>

              <textarea
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setOutput("");
                  setToolMode("idle");
                  setCopied(false);
                }}
                spellCheck={false}
                placeholder="Paste your JSON here..."
                className="min-h-[300px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">Formatted Output</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-text/45">
                    {toolMode === "formatted"
                      ? "Beautified"
                      : toolMode === "minified"
                        ? "Minified"
                        : "Ready for validation"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  disabled={!output}
                  className="inline-flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Clipboard className="h-4 w-4" />
                  {copied ? "Copied" : "Copy Output"}
                </button>
              </div>

              {output ? (
                <JsonSyntaxHighlighter content={output} />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-[24px] border border-dashed border-black/8 bg-[#fbfcfd] p-8 text-center">
                  <div className="max-w-sm space-y-3">
                    <p className="text-base font-semibold text-text">
                      {validation.isValid && input.trim()
                        ? "Your JSON is valid. Click Format & Validate or Minify to generate output."
                        : "Formatted JSON will appear here with syntax highlighting and line numbers."}
                    </p>
                    <p className="text-sm leading-7 text-text/60">
                      The output stays local in your browser and never gets sent to any server.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="mt-6 space-y-5 rounded-[24px] border border-black/6 bg-surface/70 p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleFormat}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                <WandSparkles className="h-4 w-4" />
                Format &amp; Validate
              </button>
              <button
                type="button"
                onClick={handleMinify}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                <Minimize2 className="h-4 w-4" />
                Minify
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text/65 transition-colors hover:bg-white hover:text-text"
              >
                <Eraser className="h-4 w-4" />
                Clear
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-text">Indent size</span>
              {indentOptions.map((option) => (
                <label
                  key={String(option.value)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-text"
                >
                  <input
                    type="radio"
                    name="indent-size"
                    value={String(option.value)}
                    checked={indentMode === option.value}
                    onChange={() => {
                      setIndentMode(option.value);

                      if (toolMode === "formatted" && validation.isValid) {
                        setOutput(formatJson(input, option.value));
                      }
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-black/6 bg-[#fbfcfd] px-4 py-4 text-sm">
            <div className="font-medium">{renderStatusLabel()}</div>
            <div className="flex flex-wrap items-center gap-3 text-text/60">
              <span>{metrics.characterCount} chars</span>
              <span>{metrics.lineCount} lines</span>
              <span>{metrics.keyCount} keys</span>
            </div>
          </div>
        </div>
      </section>

      <JsonToolSeoContent />
    </div>
  );
}
