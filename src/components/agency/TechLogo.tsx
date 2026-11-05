import { Accessibility, Braces, Database, Layers, LayoutTemplate, Palette, type LucideIcon } from "lucide-react";
import { brandIcons } from "@/lib/brand-icons";

/** Generic (non-brand) items get a line icon instead of a logo. */
const conceptIcons: Record<string, LucideIcon> = {
  "Design systems": Layers,
  "Design tokens": Palette,
  "Headless CMS": Database,
  "Canva templates": LayoutTemplate,
  "WCAG 2.2": Accessibility,
  "Schema.org": Braces,
};

/** Short, readable monograms for brands whose logos are not in simple-icons. */
const monograms: Record<string, string> = {
  "Adobe Creative Cloud": "Cc",
  "Adobe Illustrator": "Ai",
  "Adobe Photoshop": "Ps",
  "Adobe InDesign": "Id",
  AWS: "aws",
  OpenAI: "AI",
  "OpenAI API": "AI",
};

function monogram(name: string) {
  if (monograms[name]) return monograms[name];
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).replace(/^./, (c) => c.toUpperCase());
}

export function TechMark({ name, size = 18 }: { name: string; size?: number }) {
  const brand = brandIcons[name];
  if (brand) {
    return (
      <svg className="tl-mark" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" style={{ "--brand": `#${brand.hex}` } as React.CSSProperties}>
        <path d={brand.path} fill="currentColor" />
      </svg>
    );
  }
  const Concept = conceptIcons[name];
  if (Concept) return <Concept className="tl-mark tl-mark-line" size={size} aria-hidden="true" />;
  return <span className="tl-mark tl-mono" aria-hidden="true">{monogram(name)}</span>;
}

/** A technology label with its logo, monogram or concept icon. */
export function TechLogo({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`tl ${className}`.trim()}><TechMark name={name} /><span className="tl-name">{name}</span></span>;
}
