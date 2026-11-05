import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

const icons: Record<string, ReactNode> = {
  GitHub: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" /></svg>,
  LinkedIn: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56c0-1.07-.8-1.94-1.91-1.94-1.12 0-1.91.87-1.91 1.94 0 1.06.78 1.93 1.88 1.93h.02c1.14 0 1.92-.87 1.92-1.93ZM20 13.05c0-3.36-1.79-4.92-4.18-4.92-1.93 0-2.8 1.08-3.28 1.84V8.5H9.16c.05.98 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.68.88-1.39 1.9-1.39 1.34 0 1.88 1.05 1.88 2.58V20H20v-6.95Z" /></svg>,
  "X (Twitter)": <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.77 7.73L23.2 22h-6.25l-4.9-7.43L5.55 22H2.43l7.24-8.27L2 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.46 3.9H5.6L17.8 20Z" /></svg>,
  Website: <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></svg>,
};

export function SocialLinks({ owner }: { owner: string }) {
  return (
    <ul className="ag-social" aria-label={`${owner} online`}>
      {siteConfig.social.map((link) => (
        <li key={link.href} style={{ listStyle: "none" }}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${owner} on ${link.label}`}>{icons[link.label]}</a>
        </li>
      ))}
    </ul>
  );
}
