"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { ArrowUpDown, Clipboard, Download, Eraser, FileImage, FileUp, ImageIcon, LockKeyhole } from "lucide-react";

import {
  applyUrlSafeMode,
  decodeBase64ToText,
  downloadTextFile,
  encodeTextToBase64,
  fileToBase64,
  formatByteCount,
  formatByteRatio,
  formatSize,
  getByteCount,
  getImagePreviewFromBase64,
  isSupportedFile,
  looksLikeBase64,
  type Base64Preview,
} from "@/lib/base64";
import { Base64SeoContent } from "@/components/tools/Base64SeoContent";

type Base64Tab = "text" | "file";
type TextMode = "idle" | "encoded" | "decoded";

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof FileImage;
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

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm">
      <span className="text-text/55">{label}</span> <span className="font-semibold text-text">{value}</span>
    </div>
  );
}

export function Base64Tool() {
  const [activeTab, setActiveTab] = useState<Base64Tab>("text");
  const [textInput, setTextInput] = useState("");
  const [storedTextOutput, setTextOutput] = useState("");
  const [textMode, setTextMode] = useState<TextMode>("idle");
  const [fileBase64, setFileBase64] = useState("");
  const [fileInputBytes, setFileInputBytes] = useState(0);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<Base64Preview>(null);
  const [urlSafe, setUrlSafe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const textOutput = textMode === "encoded" ? encodeTextToBase64(textInput, urlSafe) : storedTextOutput;

  const displayedFileBase64 = useMemo(() => applyUrlSafeMode(fileBase64, urlSafe), [fileBase64, urlSafe]);
  const base64Hint = activeTab === "text" && looksLikeBase64(textInput);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const stats = useMemo(() => {
    if (activeTab === "text") {
      return {
        inputSize: formatSize(textInput),
        outputSize: formatSize(textOutput),
        ratio: formatByteRatio(getByteCount(textInput), getByteCount(textOutput)),
      };
    }

    return {
      inputSize: formatByteCount(fileInputBytes),
      outputSize: formatSize(displayedFileBase64),
      ratio: formatByteRatio(fileInputBytes, getByteCount(displayedFileBase64)),
    };
  }, [activeTab, displayedFileBase64, fileInputBytes, textInput, textOutput]);

  function resetMessages() {
    setErrorMessage("");
    setCopied(false);
  }

  function handleEncode() {
    resetMessages();
    setTextOutput(encodeTextToBase64(textInput, urlSafe));
    setTextMode("encoded");
  }

  function handleDecode() {
    resetMessages();

    try {
      setTextOutput(decodeBase64ToText(textInput));
      setTextMode("decoded");
    } catch (error) {
      setTextOutput("");
      setTextMode("idle");
      setErrorMessage(error instanceof Error ? error.message : "Unable to decode the Base64 value.");
    }
  }

  function handleSwap() {
    resetMessages();
    setTextInput(textOutput);
    setTextOutput(textInput);
    setTextMode("idle");
  }

  function handleClear() {
    resetMessages();
    setTextInput("");
    setTextOutput("");
    setTextMode("idle");
    setFileBase64("");
    setFileInputBytes(0);
    setFileName("");
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleCopyOutput() {
    const valueToCopy = activeTab === "text" ? textOutput : displayedFileBase64;

    if (!valueToCopy) {
      return;
    }

    await navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
  }

  async function handleFileSelect(file: File) {
    resetMessages();

    try {
      const result = await fileToBase64(file);
      setFileName(file.name);
      setFileInputBytes(file.size);
      setFileBase64(result.base64);
      setPreview(result.mimeType.startsWith("image/") ? { mimeType: result.mimeType, dataUrl: result.dataUrl } : null);
    } catch (error) {
      setFileBase64("");
      setFileInputBytes(0);
      setPreview(null);
      setErrorMessage(error instanceof Error ? error.message : "Unable to process the selected file.");
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    void handleFileSelect(file);
  }

  function handleFileBase64Change(nextValue: string) {
    resetMessages();
    setFileBase64(nextValue);
    setFileInputBytes(getByteCount(nextValue));
    setFileName("");

    try {
      setPreview(getImagePreviewFromBase64(nextValue));
    } catch {
      setPreview(null);
    }
  }


  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browser-based Base64 utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Base64 Encoder &amp; Decoder — Free Online Tool
          </h1>
          <p className="text-base leading-8 text-text/70">
            Encode and decode Base64 text, files, and images instantly in your browser. No uploads,
            no API calls, and no data leaves your device.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-sm sm:p-6">
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-black/6 bg-surface/80 p-2">
            <TabButton active={activeTab === "text"} icon={LockKeyhole} label="Text" onClick={() => setActiveTab("text")} />
            <TabButton active={activeTab === "file"} icon={FileImage} label="Image/File" onClick={() => setActiveTab("file")} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-black/6 bg-surface/70 px-4 py-4 text-sm">
            <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-text">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(event) => setUrlSafe(event.target.checked)}
                className="h-4 w-4 rounded border-black/15 accent-primary"
              />
              URL-safe encoding (+/ → -_)
            </label>
          </div>

          {activeTab === "text" ? (
            <div className="mt-6 space-y-4">
              <textarea
                value={textInput}
                onChange={(event) => {
                  resetMessages();
                  setTextInput(event.target.value);

                  if (textMode !== "encoded") {
                    setTextOutput("");
                  }

                  if (textMode === "decoded") {
                    setTextMode("idle");
                  }
                }}
                spellCheck={false}
                placeholder="Enter text or Base64 to convert"
                className="min-h-[220px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              />

              {base64Hint ? (
                <div className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  This looks like Base64. Click Decode to convert.
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleEncode} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                  Encode to Base64
                </button>
                <button type="button" onClick={handleDecode} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary">
                  Decode from Base64
                </button>
                <button type="button" onClick={handleCopyOutput} disabled={!textOutput} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                  <Clipboard className="h-4 w-4" />
                  {copied ? "Copied" : "Copy Output"}
                </button>
                <button type="button" onClick={handleSwap} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary">
                  <ArrowUpDown className="h-4 w-4" />
                  Swap Input/Output
                </button>
                <button type="button" onClick={handleClear} className="inline-flex items-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text/65 transition-colors hover:bg-surface hover:text-text">
                  <Eraser className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <textarea
                value={textOutput}
                readOnly
                spellCheck={false}
                placeholder="Converted output will appear here"
                className="min-h-[220px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none"
              />
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-black/12 bg-[#fbfcfd] px-6 py-8 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <FileUp className="h-6 w-6" />
                </span>
                <p className="mt-4 text-base font-semibold text-text">Drop an image or file here</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-text/60">
                  Supports JPG, PNG, GIF, WEBP, SVG, TXT, and JSON. Click to browse or drag and drop.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                  Browse file
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.txt,.json,image/jpeg,image/png,image/gif,image/webp,image/svg+xml,text/plain,application/json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    if (!isSupportedFile(file)) {
                      setErrorMessage("Unsupported file type. Use an image, text file, or JSON file.");
                      return;
                    }

                    void handleFileSelect(file);
                  }}
                />
              </label>

              {preview ? (
                <div className="rounded-[24px] border border-black/6 bg-surface/60 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Image preview
                  </div>
                  <img src={preview.dataUrl} alt="Base64 preview" className="max-h-[280px] rounded-[18px] border border-black/8 bg-white object-contain" />
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text">Base64 Output</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-text/45">
                      {fileName ? fileName : "You can also paste image Base64 below to preview it"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={handleCopyOutput} disabled={!displayedFileBase64} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                      <Clipboard className="h-4 w-4" />
                      {copied ? "Copied" : "Copy Base64"}
                    </button>
                    <button type="button" onClick={() => downloadTextFile(displayedFileBase64, `${fileName || "base64-output"}.txt`)} disabled={!displayedFileBase64} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                      <Download className="h-4 w-4" />
                      Download as .txt
                    </button>
                    <button type="button" onClick={handleClear} className="inline-flex items-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-text/65 transition-colors hover:bg-surface hover:text-text">
                      <Eraser className="h-4 w-4" />
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={displayedFileBase64}
                  onChange={(event) => handleFileBase64Change(event.target.value)}
                  spellCheck={false}
                  placeholder="Upload a supported file or paste image Base64 here..."
                  className="min-h-[240px] w-full rounded-[24px] border border-black/8 bg-[#fbfcfd] px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
          )}

          {errorMessage ? (
            <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Error: {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-primary/12 bg-primary/5 px-4 py-4 text-sm">
            <StatChip label="Input size" value={stats.inputSize} />
            <StatChip label="Output size" value={stats.outputSize} />
            <StatChip label="Ratio" value={stats.ratio} />
          </div>
        </div>
      </section>

      <Base64SeoContent />
    </div>
  );
}
