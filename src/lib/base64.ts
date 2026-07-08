const base64Pattern = /^[A-Za-z0-9+/_=-]+$/;
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"] as const;
const textMimeTypes = ["text/plain", "application/json"] as const;

export type SupportedMimeType = (typeof imageMimeTypes)[number] | (typeof textMimeTypes)[number];

export type Base64Preview = {
  mimeType: string;
  dataUrl: string;
} | null;

export function getByteCount(value: string) {
  return new TextEncoder().encode(value).length;
}

function bytesToBinary(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return binary;
}

function binaryToBytes(binary: string) {
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function encodeTextToBase64(input: string, urlSafe = false) {
  const bytes = new TextEncoder().encode(input);
  return applyUrlSafeMode(btoa(bytesToBinary(bytes)), urlSafe);
}

export function decodeBase64ToText(input: string) {
  try {
    const normalized = normalizeBase64(input);
    const binary = atob(normalized);
    return new TextDecoder().decode(binaryToBytes(binary));
  } catch {
    throw new Error("Invalid Base64 input. Please check the value and try again.");
  }
}

export function applyUrlSafeMode(value: string, enabled: boolean) {
  if (!enabled) {
    return value;
  }

  return value.replace(/\+/g, "-").replace(/\//g, "_");
}

export function normalizeBase64(input: string) {
  const cleaned = input.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  if (!cleaned) {
    return "";
  }

  const paddingLength = cleaned.length % 4;

  if (paddingLength === 1) {
    throw new Error("Invalid Base64 input. Please check the value and try again.");
  }

  if (paddingLength === 2) {
    return `${cleaned}==`;
  }

  if (paddingLength === 3) {
    return `${cleaned}=`;
  }

  return cleaned;
}

export function looksLikeBase64(input: string) {
  const cleaned = input.trim().replace(/\s+/g, "");

  if (!cleaned || cleaned.length < 8 || !base64Pattern.test(cleaned)) {
    return false;
  }

  try {
    const normalized = normalizeBase64(cleaned);
    const decoded = atob(normalized);
    const reencoded = btoa(decoded);
    const urlSafeReencoded = applyUrlSafeMode(reencoded, true);
    return cleaned === normalized || cleaned === reencoded || cleaned === urlSafeReencoded;
  } catch {
    return false;
  }
}

export function isSupportedFile(file: File) {
  return [...imageMimeTypes, ...textMimeTypes].includes(file.type as SupportedMimeType);
}

export async function fileToBase64(file: File) {
  if (!isSupportedFile(file)) {
    throw new Error("Unsupported file type. Use an image, text file, or JSON file.");
  }

  return new Promise<{ base64: string; dataUrl: string; mimeType: string }>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      if (!result.startsWith("data:") || !result.includes(",")) {
        reject(new Error("Unable to read the selected file."));
        return;
      }

      const [metadata, base64] = result.split(",", 2);
      const mimeType = metadata.slice(5, metadata.indexOf(";")) || file.type;

      resolve({
        base64,
        dataUrl: result,
        mimeType,
      });
    };

    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function inferImageMimeType(base64: string) {
  const normalized = normalizeBase64(base64);

  if (normalized.startsWith("iVBOR")) {
    return "image/png";
  }

  if (normalized.startsWith("/9j/")) {
    return "image/jpeg";
  }

  if (normalized.startsWith("R0lGOD")) {
    return "image/gif";
  }

  if (normalized.startsWith("UklGR")) {
    return "image/webp";
  }

  if (normalized.startsWith("PHN2Zy") || normalized.startsWith("PD94bWw")) {
    return "image/svg+xml";
  }

  return null;
}

export function getImagePreviewFromBase64(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("data:image/")) {
    const commaIndex = trimmed.indexOf(",");

    if (commaIndex === -1) {
      return null;
    }

    const mimeMatch = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);

    if (!mimeMatch) {
      return null;
    }

    return {
      mimeType: mimeMatch[1],
      dataUrl: trimmed,
    };
  }

  const mimeType = inferImageMimeType(trimmed);

  if (!mimeType) {
    return null;
  }

  return {
    mimeType,
    dataUrl: `data:${mimeType};base64,${normalizeBase64(trimmed)}`,
  };
}

export function formatSize(value: string) {
  const bytes = getByteCount(value);

  return formatByteCount(bytes);
}

export function formatByteCount(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
}

export function formatRatio(input: string, output: string) {
  const inputBytes = getByteCount(input);
  const outputBytes = getByteCount(output);

  return formatByteRatio(inputBytes, outputBytes);
}

export function formatByteRatio(inputBytes: number, outputBytes: number) {
  if (!inputBytes || !outputBytes) {
    return "0.00x";
  }

  return `${(outputBytes / inputBytes).toFixed(2)}x`;
}

export function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
