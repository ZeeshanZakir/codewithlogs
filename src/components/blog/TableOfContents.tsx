"use client";

import { useEffect, useState } from "react";

import type { TocHeading } from "@/lib/mdx";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: TocHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          )[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="toc rounded-[12px] border border-black/6 bg-white p-5">
      <p className="toc-title">
        Table of Contents
      </p>
      <nav aria-label="Article table of contents" className="mt-5 space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`} aria-current={activeId === heading.id ? "location" : undefined}
            className={cn(
              "block rounded-[10px] px-3 py-2 text-sm transition-colors",
              heading.level === 3 ? "ml-4" : "",
              activeId === heading.id
                ? "bg-primary/8 font-semibold text-primary"
                : "text-text/65 hover:text-primary",
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
