"use client";

import { useEffect, useMemo, useState } from "react";
import { Clipboard, Download, Eraser, Key, LockKeyhole, Unlock } from "lucide-react";

import {
  base64UrlDecode,
  downloadTextFile,
  formatTimestamp,
  isExpired,
  isValidJwtFormat,
  parseJwt,
} from "@/lib/jwt";
import { JwtDecoderSeoContent } from "@/components/tools/JwtDecoderSeoContent";

function StatChip({ label, value, variant = "default" }: { label: string; value: string; variant?: "default" | "success" | "danger" }) {
  const variantClasses = {
    default: "bg-white border-black/8",
    success: "bg-green-50 border-green-200 text-green-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`rounded-full border px-4 py-2 text-sm ${variantClasses[variant]}`}>
      <span className="opacity-70">{label}</span> <span className="font-semibold">{value}</span>
    </div>
  );
}

export function JwtDecoderTool() {
  const [jwtInput, setJwtInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"header" | "payload" | "signature">("payload");

  const decoded = useMemo(() => {
    if (!jwtInput.trim()) {
      return null;
    }
    try {
      setErrorMessage("");
      return parseJwt(jwtInput);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to decode JWT");
      return null;
    }
  }, [jwtInput]);

  const isExpiredStatus = useMemo(() => {
    if (!decoded?.payload) return null;
    return isExpired(decoded.payload);
  }, [decoded]);

  const isValidFormat = useMemo(() => isValidJwtFormat(jwtInput), [jwtInput]);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(null), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function handleClear() {
    setJwtInput("");
    setErrorMessage("");
    setCopied(null);
  }

  async function handleCopy(text: string, id: string) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(id);
  }

  function TabButton({
    active,
    icon: Icon,
    label,
    onClick,
  }: {
    active: boolean;
    icon: typeof Key;
    label: string;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          active ? "bg-primary text-white" : "bg-white text-text hover:text-primary"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  }

  function JsonViewer({ data, label }: { data: any; label: string }) {
    const jsonString = JSON.stringify(data, null, 2);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text">{label}</p>
          <button
            type="button"
            onClick={() => handleCopy(jsonString, label)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
          >
            <Clipboard className="h-3 w-3" />
            {copied === label ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="min-h-[180px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 overflow-auto">
          {jsonString}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based JWT utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            JWT Decoder — Free Online Tool
          </h1>
          <p className="text-base leading-8 text-text/70">
            Decode JSON Web Tokens instantly in your browser. Inspect headers, payloads, and
            signatures without sending any data to a server.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">JWT Token</p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-xs font-semibold text-text/65 transition-colors hover:bg-surface hover:text-text"
                >
                  <Eraser className="h-3 w-3" />
                  Clear
                </button>
              </div>
              <textarea
                value={jwtInput}
                onChange={(e) => {
                  setJwtInput(e.target.value);
                }}
                spellCheck={false}
                placeholder="Paste your JWT token here..."
                className="mt-3 min-h-[140px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {errorMessage && (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {decoded && (
              <div className="space-y-6 pt-4 border-t border-black/6">
                <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-black/6 bg-surface/70 px-4 py-4 text-sm">
                  <StatChip
                    label="Algorithm"
                    value={decoded.header.alg || "Unknown"}
                  />
                  {decoded.payload.iss && (
                    <StatChip label="Issuer" value={decoded.payload.iss} />
                  )}
                  {decoded.payload.sub && (
                    <StatChip label="Subject" value={decoded.payload.sub} />
                  )}
                  {decoded.payload.exp && (
                    <StatChip
                      label="Expires"
                      value={formatTimestamp(decoded.payload.exp)}
                      variant={isExpiredStatus ? "danger" : "success"}
                    />
                  )}
                  {decoded.payload.iat && (
                    <StatChip
                      label="Issued At"
                      value={formatTimestamp(decoded.payload.iat)}
                    />
                  )}
                </div>

                <div className="inline-flex flex-wrap gap-2 rounded-full border border-black/6 bg-surface/80 p-2">
                  <TabButton
                    active={activeTab === "header"}
                    icon={Key}
                    label="Header"
                    onClick={() => setActiveTab("header")}
                  />
                  <TabButton
                    active={activeTab === "payload"}
                    icon={LockKeyhole}
                    label="Payload"
                    onClick={() => setActiveTab("payload")}
                  />
                  <TabButton
                    active={activeTab === "signature"}
                    icon={Unlock}
                    label="Signature"
                    onClick={() => setActiveTab("signature")}
                  />
                </div>

                {activeTab === "header" && (
                  <JsonViewer data={decoded.header} label="Header" />
                )}

                {activeTab === "payload" && (
                  <JsonViewer data={decoded.payload} label="Payload" />
                )}

                {activeTab === "signature" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-text">Signature</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(decoded.signature, "signature")}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                        >
                          <Clipboard className="h-3 w-3" />
                          {copied === "signature" ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadTextFile(decoded.signature, "jwt-signature.txt")}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                    <pre className="min-h-[180px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 overflow-auto">
                      {decoded.signature}
                    </pre>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), "full-header")}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy Header
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), "full-payload")}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy Payload
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadTextFile(JSON.stringify(decoded, null, 2), "jwt-decoded.json")}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                    Download Full JSON
                  </button>
                </div>
              </div>
            )}

            {!decoded && jwtInput.trim() && !isValidFormat && (
              <div className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                This doesn't look like a valid JWT format. A JWT should have 3 parts separated by dots.
              </div>
            )}
          </div>
        </div>
      </section>

      <JwtDecoderSeoContent />
    </div>
  );
}
