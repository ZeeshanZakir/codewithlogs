"use client";

import { useState, useMemo } from "react";
import { countTokens, countWords, calculateCost, MODEL_CONFIGS, CONTEXT_WINDOWS, formatCost, type ModelType } from "@/lib/token-counter";

const SAMPLE_PROMPT = `Write a blog post about AI development best practices, including tips for testing, deployment, and monitoring. Target audience: intermediate developers.`;

export function TokenCounterTool() {
  const [text, setText] = useState(SAMPLE_PROMPT);
  const [model, setModel] = useState<ModelType>("gpt");
  const [pricePerMillion, setPricePerMillion] = useState(MODEL_CONFIGS[model].pricePerMillion);

  const { tokenCount, characterCount, wordCount, estimatedCost } = useMemo(() => {
    const tokens = countTokens(text, model);
    const chars = text.length;
    const words = countWords(text);
    const cost = calculateCost(tokens, pricePerMillion);
    return { tokenCount: tokens, characterCount: chars, wordCount: words, estimatedCost: cost };
  }, [text, model, pricePerMillion]);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based Token Counter
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Token Counter — Count Tokens for GPT, Claude, and Gemini Prompts
          </h1>
          <p className="text-base leading-8 text-text/70">
            Count tokens and estimate API costs for your AI prompts before sending them. 100% free, runs entirely in your browser.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6 space-y-6">
          <div className="flex gap-2 rounded-full border border-black/6 bg-surface/80 p-2 w-fit">
            {(Object.keys(MODEL_CONFIGS) as ModelType[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModel(m);
                  setPricePerMillion(MODEL_CONFIGS[m].pricePerMillion);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  model === m ? "bg-primary text-white" : "bg-white text-text hover:text-primary"
                }`}
              >
                {MODEL_CONFIGS[m].name}
                {MODEL_CONFIGS[m].note && " *"}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your prompt here..."
            spellCheck={false}
            className="min-h-[240px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 text-center">
              <p className="text-sm font-semibold text-text/70">Token Count</p>
              <p className="text-3xl font-bold text-primary mt-2">{tokenCount}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 text-center">
              <p className="text-sm font-semibold text-text/70">Characters</p>
              <p className="text-3xl font-bold text-text mt-2">{characterCount}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 text-center">
              <p className="text-sm font-semibold text-text/70">Words</p>
              <p className="text-3xl font-bold text-text mt-2">{wordCount}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 text-center">
              <p className="text-sm font-semibold text-text/70">Est. Cost</p>
              <p className="text-3xl font-bold text-text mt-2">{formatCost(estimatedCost)}</p>
            </div>
          </div>

          <div className="rounded-[20px] border border-black/6 bg-surface/70 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-text">
              Price per 1M tokens
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricePerMillion}
                onChange={(e) => setPricePerMillion(parseFloat(e.target.value) || 0)}
                className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-black/5">
            <p className="text-sm font-semibold text-text">Context Window Usage</p>
            <div className="space-y-3">
              {CONTEXT_WINDOWS.map((window) => {
                const percentage = Math.min((tokenCount / window.size) * 100, 100);
                return (
                  <div key={window.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-text/70">{window.name} window</span>
                      <span className="font-semibold text-text">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
