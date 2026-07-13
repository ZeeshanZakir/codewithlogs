"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Clipboard, Copy, Clock } from "lucide-react";
import { validateCron, explainCron, getNextRuns, CRON_PRESETS } from "@/lib/cron";

type CronMode = "build" | "parse";

type FieldType = "every" | "specific" | "range" | "step";

type FieldConfig = {
  type: FieldType;
  value: string;
  start: string;
  end: string;
  step: string;
};

const FIELD_NAMES = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"] as const;
const FIELD_LABELS = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
const FIELD_RANGES = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 }
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function CronBuilderTool() {
  const [mode, setMode] = useState<CronMode>("build");
  const [cronExpr, setCronExpr] = useState("0 0 * * *");
  const [parseInput, setParseInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(true);

  const [fields, setFields] = useState<FieldConfig[]>([
    { type: "every", value: "0", start: "", end: "", step: "" },
    { type: "every", value: "0", start: "", end: "", step: "" },
    { type: "every", value: "", start: "", end: "", step: "" },
    { type: "every", value: "", start: "", end: "", step: "" },
    { type: "every", value: "", start: "", end: "", step: "" }
  ]);

  // Build cron from fields
  const builtCron = useMemo(() => {
    return fields.map((field, i) => {
      switch (field.type) {
        case "every": return "*";
        case "specific": return field.value;
        case "range": return `${field.start}-${field.end}`;
        case "step": return field.step ? `*/${field.step}` : "*";
        default: return "*";
      }
    }).join(" ");
  }, [fields]);

  useEffect(() => {
    if (mode === "build") {
      setCronExpr(builtCron);
    }
  }, [builtCron, mode]);

  const validation = useMemo(() => validateCron(cronExpr), [cronExpr]);
  const explanation = useMemo(() => validation.valid ? explainCron(cronExpr) : "", [cronExpr, validation]);
  const nextRuns = useMemo(() => validation.valid ? getNextRuns(cronExpr, 5) : [], [cronExpr, validation]);

  const handlePreset = (expr: string) => {
    setCronExpr(expr);
    setParseInput(expr);
    setMode("parse");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cronExpr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatRelative = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const updateField = (index: number, config: Partial<FieldConfig>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...config };
    setFields(newFields);
  };

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based Cron Tool
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Cron Expression Builder & Parser
          </h1>
          <p className="text-base leading-8 text-text/70">
            Build, parse, and understand cron expressions instantly in your browser. 
            Get human-readable explanations and see next run times.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6 space-y-6">
          {/* Tabs */}
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-black/6 bg-surface/80 p-2">
            <button
              onClick={() => setMode("build")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "build" ? "bg-primary text-white" : "bg-white text-text hover:text-primary"
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setMode("parse")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "parse" ? "bg-primary text-white" : "bg-white text-text hover:text-primary"
              }`}
            >
              Parse
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {CRON_PRESETS.map(preset => (
                <button
                  key={preset.expr}
                  onClick={() => handlePreset(preset.expr)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cron Expression Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Cron Expression</p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
              >
                {copied ? <Clipboard className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="font-mono text-lg p-4 rounded-[24px] border border-black/8 bg-[#fbfcfd]">
              {cronExpr}
            </div>
          </div>

          {mode === "build" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {fields.map((field, i) => (
                <div key={i} className="space-y-2 p-4 rounded-[20px] border border-black/6 bg-surface/70">
                  <p className="text-sm font-semibold text-text">{FIELD_LABELS[i]}</p>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(i, { type: e.target.value as FieldType })}
                    className="w-full rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm"
                  >
                    <option value="every">Every</option>
                    <option value="specific">Specific</option>
                    <option value="range">Range</option>
                    <option value="step">Every N</option>
                  </select>
                  {field.type === "specific" && (
                    <select
                      value={field.value}
                      onChange={(e) => updateField(i, { value: e.target.value })}
                      className="w-full rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm"
                    >
                      {Array.from({ length: FIELD_RANGES[i].max - FIELD_RANGES[i].min + 1 }, (_, idx) => {
                        const val = FIELD_RANGES[i].min + idx;
                        return (
                          <option key={val} value={val.toString()}>
                            {i === 3 ? MONTH_NAMES[val - 1] : i === 4 ? DAY_NAMES[val] : val}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {field.type === "range" && (
                    <div className="flex gap-2">
                      <select
                        value={field.start}
                        onChange={(e) => updateField(i, { start: e.target.value })}
                        className="w-1/2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm"
                      >
                        <option value="">Start</option>
                        {Array.from({ length: FIELD_RANGES[i].max - FIELD_RANGES[i].min + 1 }, (_, idx) => {
                          const val = FIELD_RANGES[i].min + idx;
                          return (
                            <option key={val} value={val.toString()}>
                              {i === 3 ? MONTH_NAMES[val - 1] : i === 4 ? DAY_NAMES[val] : val}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        value={field.end}
                        onChange={(e) => updateField(i, { end: e.target.value })}
                        className="w-1/2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm"
                      >
                        <option value="">End</option>
                        {Array.from({ length: FIELD_RANGES[i].max - FIELD_RANGES[i].min + 1 }, (_, idx) => {
                          const val = FIELD_RANGES[i].min + idx;
                          return (
                            <option key={val} value={val.toString()}>
                              {i === 3 ? MONTH_NAMES[val - 1] : i === 4 ? DAY_NAMES[val] : val}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                  {field.type === "step" && (
                    <input
                      type="number"
                      placeholder="N"
                      value={field.step}
                      onChange={(e) => updateField(i, { step: e.target.value })}
                      min={1}
                      max={FIELD_RANGES[i].max}
                      className="w-full rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-text mb-2">Paste Expression</p>
                <textarea
                  value={parseInput}
                  onChange={(e) => {
                    setParseInput(e.target.value);
                    setCronExpr(e.target.value);
                  }}
                  placeholder="* * * * *"
                  rows={2}
                  className="w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm"
                />
              </div>
              {!validation.valid && validation.error && (
                <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {validation.error}
                </div>
              )}
            </div>
          )}

          {validation.valid && (
            <>
              <div className="p-4 rounded-[20px] border border-black/6 bg-surface/70">
                <p className="text-sm font-semibold text-text mb-2">Explanation</p>
                <p className="text-base leading-8 text-text/70">{explanation}</p>
              </div>
              <div className="p-4 rounded-[20px] border border-black/6 bg-surface/70">
                <div className="flex items-center gap-2 text-sm font-semibold text-text mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  Next 5 Runs
                </div>
                <ul className="space-y-2">
                  {nextRuns.map((run, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="text-text/70">{formatRelative(run)}</span>
                      <span className="font-mono text-text">{run.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="border-t border-black/5 pt-4">
            <button
              onClick={() => setReferenceOpen(!referenceOpen)}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <span className="text-sm font-semibold text-text">Cron Syntax Reference</span>
              {referenceOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
            </button>
            {referenceOpen && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-2 px-2 text-text font-semibold">Field</th>
                      <th className="text-left py-2 px-2 text-text font-semibold">Allowed Values</th>
                      <th className="text-left py-2 px-2 text-text font-semibold">Special Characters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/5">
                      <td className="py-2 px-2 text-text/70">Minute</td>
                      <td className="py-2 px-2 text-text/70">0-59</td>
                      <td className="py-2 px-2 text-text/70">* , - /</td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="py-2 px-2 text-text/70">Hour</td>
                      <td className="py-2 px-2 text-text/70">0-23</td>
                      <td className="py-2 px-2 text-text/70">* , - /</td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="py-2 px-2 text-text/70">Day of Month</td>
                      <td className="py-2 px-2 text-text/70">1-31</td>
                      <td className="py-2 px-2 text-text/70">* , - /</td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="py-2 px-2 text-text/70">Month</td>
                      <td className="py-2 px-2 text-text/70">1-12</td>
                      <td className="py-2 px-2 text-text/70">* , - /</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-text/70">Day of Week</td>
                      <td className="py-2 px-2 text-text/70">0-6 (Sun-Sat)</td>
                      <td className="py-2 px-2 text-text/70">* , - /</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
