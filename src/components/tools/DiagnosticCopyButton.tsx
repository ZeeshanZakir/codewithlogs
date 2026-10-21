"use client";

import { useState } from "react";
import styles from "./DiagnosticTools.module.css";

export function DiagnosticCopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setStatus("Copied. Review commands before running them.");
    } catch {
      setStatus("Clipboard access was unavailable. Select the visible text and copy it manually.");
    }
  }
  return <div className={styles.copy}><button type="button" className={styles.button} onClick={copy}>{label}</button><span role="status" aria-live="polite">{status}</span></div>;
}
