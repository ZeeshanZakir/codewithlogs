"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Clipboard, Copy, RefreshCw, Sparkles } from "lucide-react";

import { PasswordStrengthMeter } from "@/components/tools/PasswordStrengthMeter";
import { PasswordToolSeoContent } from "@/components/tools/PasswordToolSeoContent";
import {
  generateMultiplePasswords,
  generatePassword,
  getPasswordStrength,
  getSelectedTypeCount,
  type PasswordOptions,
} from "@/lib/password-generator";

const defaultOptions: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

function PasswordList({
  title,
  values,
  onCopy,
}: {
  title: string;
  values: string[];
  onCopy: (value: string) => void;
}) {
  if (!values.length) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[24px] border border-black/6 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <div className="space-y-3">
        {values.map((value, index) => (
          <div
            key={`${title}-${index}-${value}`}
            className="flex flex-col gap-3 rounded-[20px] border border-black/6 bg-surface/70 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <code className="overflow-x-auto font-mono text-sm text-text">{value}</code>
            <button
              type="button"
              onClick={() => onCopy(value)}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions);
  const [password, setPassword] = useState("");
  const [generatedBatch, setGeneratedBatch] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const strength = useMemo(() => getPasswordStrength(password, options), [password, options]);
  const selectedTypes = getSelectedTypeCount(options);

  useEffect(() => {
    if (!password) {
      handleGenerate(defaultOptions, false);
    }
  }, [password]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function pushHistory(value: string) {
    setHistory((previous) => [value, ...previous.filter((item) => item !== value)].slice(0, 10));
  }

  function handleGenerate(nextOptions = options, clearBatch = true) {
    const nextPassword = generatePassword(nextOptions);
    setPassword(nextPassword);
    pushHistory(nextPassword);

    if (clearBatch) {
      setGeneratedBatch([]);
    }
  }

  function handleGenerateFive() {
    const batch = generateMultiplePasswords(options, 5);
    setGeneratedBatch(batch);
    if (batch[0]) {
      setPassword(batch[0]);
    }
    setHistory((previous) => [...batch, ...previous.filter((item) => !batch.includes(item))].slice(0, 10));
  }

  async function handleCopy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  function updateOption<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) {
    if (
      key !== "length" &&
      key !== "excludeAmbiguous" &&
      value === false &&
      selectedTypes === 1
    ) {
      return;
    }

    const nextOptions = { ...options, [key]: value };
    setOptions(nextOptions);
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based password utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Password Generator — Create Strong Passwords Instantly
          </h1>
          <p className="text-base leading-8 text-text/70">
            Generate strong, random passwords in your browser with adjustable length, character
            rules, and instant copy actions. No password is stored or sent anywhere.
          </p>
        </div>

        <div className="space-y-6 rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <section className="space-y-4 rounded-[24px] border border-black/6 bg-surface/70 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 overflow-hidden rounded-[20px] border border-black/8 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <code className="overflow-x-auto whitespace-nowrap font-mono text-[18px] text-text">
                    {password}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(password)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <PasswordStrengthMeter
              label={strength.label}
              progress={strength.progress}
              strength={strength.strength}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="space-y-5 rounded-[24px] border border-black/6 bg-[#fbfcfd] p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password-length" className="text-sm font-semibold text-text">
                    Password Length
                  </label>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary">
                    {options.length}
                  </span>
                </div>
                <input
                  id="password-length"
                  type="range"
                  min={4}
                  max={64}
                  value={options.length}
                  onChange={(event) => updateOption("length", Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: "includeUppercase", label: "Uppercase Letters (A-Z)" },
                  { key: "includeLowercase", label: "Lowercase Letters (a-z)" },
                  { key: "includeNumbers", label: "Numbers (0-9)" },
                  { key: "includeSymbols", label: "Symbols (!@#$...)" },
                ].map((field) => (
                  <label
                    key={field.key}
                    className="flex items-center gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-3 text-sm text-text"
                  >
                    <input
                      type="checkbox"
                      checked={options[field.key as keyof PasswordOptions] as boolean}
                      onChange={(event) =>
                        updateOption(
                          field.key as keyof PasswordOptions,
                          event.target.checked as PasswordOptions[keyof PasswordOptions],
                        )
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{field.label}</span>
                  </label>
                ))}
              </div>

              <label className="flex items-center justify-between gap-4 rounded-[18px] border border-black/8 bg-white px-4 py-4 text-sm text-text">
                <div>
                  <p className="font-semibold">Exclude ambiguous characters</p>
                  <p className="text-text/60">Remove 0, O, l, 1, and I from the generator.</p>
                </div>
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(event) => updateOption("excludeAmbiguous", event.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
              </label>
            </div>

            <div className="space-y-4 rounded-[24px] border border-black/6 bg-[#fbfcfd] p-5">
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Password
              </button>
              <button
                type="button"
                onClick={() => handleCopy(password)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                <Clipboard className="h-4 w-4" />
                Copy to Clipboard
              </button>
              <button
                type="button"
                onClick={handleGenerateFive}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4" />
                Generate 5 Passwords
              </button>
              <div className="rounded-[20px] border border-dashed border-black/8 bg-white p-4 text-sm leading-7 text-text/60">
                Passwords are generated entirely in your browser. No value is stored or sent to any server.
              </div>
            </div>
          </section>

          <PasswordList title="Multiple Passwords" values={generatedBatch} onCopy={handleCopy} />

          <section className="rounded-[24px] border border-black/6 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setIsHistoryOpen((previous) => !previous)}
                className="inline-flex items-center gap-2 text-left text-lg font-semibold text-text"
              >
                Password History
                {isHistoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="inline-flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                Clear History
              </button>
            </div>
            {isHistoryOpen ? (
              history.length ? (
                <div className="mt-5 space-y-3">
                  {history.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="flex flex-col gap-3 rounded-[20px] border border-black/6 bg-surface/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <code className="overflow-x-auto whitespace-nowrap font-mono text-sm text-text">
                        {value}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(value)}
                        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-text/60">
                  Your last 10 generated passwords appear here during this session.
                </p>
              )
            ) : null}
          </section>
        </div>
      </section>

      <PasswordToolSeoContent />

      {copied ? (
        <div className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <Check className="h-4 w-4" />
          Copied!
        </div>
      ) : null}
    </div>
  );
}
