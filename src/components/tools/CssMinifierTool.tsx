"use client";

import { useEffect, useMemo, useState } from "react";
import { Clipboard, Eraser, FileCode2, Minimize2, WandSparkles } from "lucide-react";

import { CodeLineView } from "@/components/tools/CodeLineView";
import { CssMinifierSeoContent } from "@/components/tools/CssMinifierSeoContent";
import {
  beautifyCss,
  formatCssSize,
  getSavingsPercentage,
  minifyCss,
  sampleCss,
  validateCss,
} from "@/lib/css-minifier";

type CssToolMode = "idle" | "minified" | "beautified";

function StatChip({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm">
      <span className="text-text/55">{label}</span>{" "}
      <span className={accent ? "font-semibold text-primary" : "font-semibold text-text"}>{value}</span>
    </div>
  );
}

export function CssMinifierTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<CssToolMode>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const minifiedPreview = useMemo(() => {
    if (!input.trim()) {
      return "";
    }

    const validation = validateCss(input);

    if (!validation.isValid) {
      return "";
    }

    try {
      return minifyCss(input);
    } catch {
      return "";
    }
  }, [input]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function runProcessor(processor: (value: string) => string, nextMode: CssToolMode) {
    const validation = validateCss(input);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      setOutput("");
      setMode("idle");
      return;
    }

    try {
      setOutput(processor(input));
      setMode(nextMode);
      setErrorMessage("");
    } catch (error) {
      setOutput("");
      setMode("idle");
      setErrorMessage(error instanceof Error ? error.message : "Unable to process the CSS input.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setMode("idle");
    setErrorMessage("");
    setCopied(false);
  }

  async function handleCopyOutput() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  function handleLoadSample() {
    setInput(sampleCss);
    setOutput(beautifyCss(sampleCss));
    setMode("beautified");
    setErrorMessage("");
  }

  const originalSize = formatCssSize(input);
  const minifiedSize = formatCssSize(minifiedPreview);
  const savings = getSavingsPercentage(input, minifiedPreview);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based CSS utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            CSS Minifier — Free Online CSS Compression Tool
          </h1>
          <p className="text-base leading-8 text-text/70">
            Minify and beautify CSS instantly in your browser. Remove comments, whitespace, and
            unnecessary characters without uploading your styles anywhere.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeLineView
              label="Input CSS"
              helper="Paste raw CSS here"
              value={input}
              onChange={(nextValue) => {
                setInput(nextValue);
                setOutput("");
                setMode("idle");
                setErrorMessage("");
                setCopied(false);
              }}
              placeholder="Paste your CSS here..."
            />

            <CodeLineView
              label="Processed Output"
              helper={
                mode === "minified"
                  ? "Minified CSS"
                  : mode === "beautified"
                    ? "Beautified CSS"
                    : "Ready for processing"
              }
              value={output}
              readOnly
            />
          </div>

          <div className="mt-6 space-y-5 rounded-[24px] border border-black/6 bg-surface/70 p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => runProcessor(minifyCss, "minified")}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                <Minimize2 className="h-4 w-4" />
                Minify CSS
              </button>
              <button
                type="button"
                onClick={() => runProcessor(beautifyCss, "beautified")}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                <WandSparkles className="h-4 w-4" />
                Beautify CSS
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text/65 transition-colors hover:bg-white hover:text-text"
              >
                <Eraser className="h-4 w-4" />
                Clear
              </button>
              <button
                type="button"
                onClick={handleCopyOutput}
                disabled={!output}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Clipboard className="h-4 w-4" />
                {copied ? "Copied" : "Copy Output"}
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <FileCode2 className="h-4 w-4" />
                Sample CSS
              </button>
            </div>

            {errorMessage ? (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                Error: {errorMessage}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-primary/12 bg-primary/5 px-4 py-4 text-sm">
            <StatChip label="Original size" value={originalSize} />
            <StatChip label="Minified size" value={minifiedSize} />
            <StatChip label="Savings" value={`Saved ${savings}%`} accent />
          </div>
        </div>
      </section>

      <CssMinifierSeoContent />
    </div>
  );
}
