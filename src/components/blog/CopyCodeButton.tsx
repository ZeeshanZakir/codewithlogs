"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCodeButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 3500);
  }
  return <div className="copy-control"><button type="button" onClick={copy} aria-label="Copy code to clipboard">{status === "copied" ? <Check size={14} /> : <Copy size={14} />}{status === "copied" ? "Copied" : "Copy"}</button><span role="status" className={status === "failed" ? "copy-error" : "sr-only"}>{status === "failed" ? "Clipboard unavailable. Select the code and copy it manually." : status === "copied" ? "Code copied to clipboard." : ""}</span></div>;
}
