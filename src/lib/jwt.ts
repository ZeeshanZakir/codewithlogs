export function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

export function parseJwt(token: string): { header: any; payload: any; signature: string; rawHeader: string; rawPayload: string; rawSignature: string } {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format. A valid JWT must have 3 parts separated by dots.');
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return {
      header,
      payload,
      signature: parts[2],
      rawHeader: parts[0],
      rawPayload: parts[1],
      rawSignature: parts[2]
    };
  } catch (error) {
    throw new Error('Failed to parse JWT. The token appears to be malformed.');
  }
}

export function formatTimestamp(timestamp: number): string {
  try {
    return new Date(timestamp * 1000).toLocaleString();
  } catch {
    return 'Invalid timestamp';
  }
}

export function isExpired(payload: any): boolean | null {
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }
  return Date.now() > payload.exp * 1000;
}

export function isValidJwtFormat(token: string): boolean {
  const parts = token.trim();
  if (!parts) return false;
  const jwtParts = token.split('.');
  return jwtParts.length === 3;
}

export function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
