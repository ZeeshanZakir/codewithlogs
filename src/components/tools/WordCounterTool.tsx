"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, Download, Eraser } from "lucide-react";

import { WordCounterSeoContent } from "@/components/tools/WordCounterSeoContent";
import {
  buildTextFileUrl,
  countCharactersWithSpaces,
  countCharactersWithoutSpaces,
  countParagraphs,
  countSentences,
  countWords,
  getKeywordDensity,
  getReadingTime,
  getSocialLimits,
} from "@/lib/word-counter";

const socialStatusClasses = {
  safe: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
} as const;

const sampleText = `Word Counter helps you measure how long, readable, and optimized your text is in real time.

Paste any blog post, landing page draft, or article outline here to instantly see the number of words, characters, sentences, paragraphs, and estimated reading time.

You can also track keyword density, compare content against social media limits, and set a writing goal while you work.`;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-black/6 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm font-medium text-text/65">{label}</p>
    </div>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState(sampleText);
  const [wordGoal, setWordGoal] = useState<number | "">("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const stats = useMemo(() => {
    const words = countWords(text);
    const charactersWithSpaces = countCharactersWithSpaces(text);
    const charactersWithoutSpaces = countCharactersWithoutSpaces(text);
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const readingTime = getReadingTime(words);

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  const keywordDensity = useMemo(() => getKeywordDensity(text), [text]);
  const socialLimits = useMemo(
    () => getSocialLimits(stats.charactersWithSpaces),
    [stats.charactersWithSpaces],
  );

  const goalProgress = useMemo(() => {
    if (!wordGoal || wordGoal <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((stats.words / wordGoal) * 100));
  }, [stats.words, wordGoal]);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 250)}px`;
  }, [text]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  function handleClear() {
    setText("");
    setCopied(false);
  }

  function handleDownload() {
    const fileUrl = buildTextFileUrl(text);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "word-counter-text.txt";
    link.click();
    URL.revokeObjectURL(fileUrl);
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based writing utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Word Counter — Count Words and Characters Online Free
          </h1>
          <p className="text-base leading-8 text-text/70">
            Count words, characters, sentences, paragraphs, and reading time instantly while you
            write. Everything updates on every keystroke and stays local in your browser.
          </p>
        </div>

        <div className="space-y-6 rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-3">
            <label htmlFor="word-counter-textarea" className="text-sm font-semibold text-text">
              Your Text
            </label>
            <textarea
              id="word-counter-textarea"
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[250px] w-full resize-none rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 text-base leading-8 text-text outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <StatCard label="Words" value={stats.words} />
            <StatCard label="Characters (with spaces)" value={stats.charactersWithSpaces} />
            <StatCard label="Characters (no spaces)" value={stats.charactersWithoutSpaces} />
            <StatCard label="Sentences" value={stats.sentences} />
            <StatCard label="Paragraphs" value={stats.paragraphs} />
            <StatCard label="Reading Time" value={stats.readingTime} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <section className="rounded-[24px] border border-black/6 bg-[#fbfcfd] p-5">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text">Keyword Density</h2>
                <p className="text-sm leading-7 text-text/60">
                  Top 10 most frequent words excluding common stop words.
                </p>
              </div>

              {keywordDensity.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-text/55">
                      <tr>
                        <th className="px-3 py-3 font-semibold">Word</th>
                        <th className="px-3 py-3 font-semibold">Count</th>
                        <th className="px-3 py-3 font-semibold">Density %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordDensity.map((row) => (
                        <tr key={row.word} className="border-t border-black/6">
                          <td className="px-3 py-3 font-medium text-text">{row.word}</td>
                          <td className="px-3 py-3 text-text/70">{row.count}</td>
                          <td className="px-3 py-3 text-text/70">{row.density}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm leading-7 text-text/60">
                  Start typing to see your most frequent keywords here.
                </p>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-black/6 bg-[#fbfcfd] p-5">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text">Writing Goals</h2>
                    <p className="text-sm leading-7 text-text/60">
                      Set a target word count and track your progress live.
                    </p>
                  </div>

                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="Set word goal"
                    value={wordGoal}
                    onChange={(event) =>
                      setWordGoal(event.target.value ? Number(event.target.value) : "")
                    }
                    className="w-full rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
                  />

                  <div className="space-y-3">
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm text-text/65">
                      <span>{goalProgress}% complete</span>
                      <span>
                        {stats.words}/{wordGoal || 0} words
                      </span>
                    </div>
                    {wordGoal && stats.words >= wordGoal ? (
                      <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        Goal reached! 🎉
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-black/6 bg-[#fbfcfd] p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-text">Controls</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear Text
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy Text
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                    Download as .txt
                  </button>
                </div>
              </section>
            </div>
          </div>

          <section className="rounded-[24px] border border-black/6 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text">Social Media Limits</h2>
              <p className="text-sm leading-7 text-text/60">
                See how your current character count compares to common publishing limits.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {socialLimits.map((platform) => (
                <div
                  key={platform.label}
                  className={`rounded-[20px] border px-4 py-4 ${socialStatusClasses[platform.status]}`}
                >
                  <p className="text-sm font-semibold">{platform.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">
                    {platform.count}/{platform.limit}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <WordCounterSeoContent />

      {copied ? (
        <div className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <Check className="h-4 w-4" />
          Copied!
        </div>
      ) : null}
    </div>
  );
}
