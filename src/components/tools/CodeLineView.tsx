"use client";

import { useEffect, useMemo, useRef } from "react";

type CodeLineViewProps = {
  label: string;
  helper: string;
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export function CodeLineView({
  label,
  helper,
  value,
  placeholder,
  readOnly = false,
  onChange,
}: CodeLineViewProps) {
  const lineCount = useMemo(() => Math.max(1, value.split("\n").length), [value]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const outputRef = useRef<HTMLPreElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  function syncScroll(scrollTop: number, scrollLeft = 0) {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }

    if (outputRef.current && readOnly) {
      outputRef.current.scrollTop = scrollTop;
      outputRef.current.scrollLeft = scrollLeft;
    }
  }

  useEffect(() => {
    if (!readOnly && textareaRef.current) {
      syncScroll(textareaRef.current.scrollTop, textareaRef.current.scrollLeft);
    }
  }, [readOnly, value]);

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-text/45">{helper}</p>
      </div>

      <div className="grid min-h-[320px] grid-cols-[64px_minmax(0,1fr)] overflow-hidden rounded-[24px] border border-black/8 bg-[#fbfcfd] font-mono text-sm">
        <div
          ref={gutterRef}
          className="overflow-hidden border-r border-black/6 bg-white/60 px-3 py-4 text-right leading-7 text-slate-400"
        >
          {Array.from({ length: lineCount }).map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        {readOnly ? (
          <pre
            ref={outputRef}
            className="overflow-auto px-4 py-4 leading-7 text-slate-800"
          >
            {value || "Processed CSS will appear here."}
          </pre>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onScroll={(event) =>
              syncScroll(event.currentTarget.scrollTop, event.currentTarget.scrollLeft)
            }
            spellCheck={false}
            placeholder={placeholder}
            className="min-h-[320px] w-full resize-none overflow-auto bg-transparent px-4 py-4 leading-7 text-slate-800 outline-none"
          />
        )}
      </div>
    </section>
  );
}
