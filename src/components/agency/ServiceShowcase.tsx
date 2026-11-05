"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export type ShowcaseService = {
  slug: string;
  number: string;
  name: string;
  summary: string;
  capabilities: string[];
  icon: ReactNode;
};

/**
 * Interactive services showcase. Hover (fine pointers) or select a service to
 * swap the art-directed visual and details. Visuals are rendered on the server
 * and passed in, so this component only manages selection.
 */
export function ServiceShowcase({ services, visuals }: { services: ShowcaseService[]; visuals: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = services[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: services.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + services.length) % services.length;
    setActive(next);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  return (
    <div className="ss">
      <div className="ss-nav" role="tablist" aria-label="Our services" aria-orientation="vertical">
        {services.map((service, index) => (
          <button
            key={service.slug}
            ref={(element) => { tabs.current[index] = element; }}
            type="button"
            role="tab"
            id={`ss-tab-${service.slug}`}
            aria-selected={active === index}
            aria-controls="ss-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="ss-icon">{service.icon}</span>
            <span className="ss-name">{service.name}</span>
            <ArrowUpRight className="ss-arrow" size={22} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div id="ss-panel" role="tabpanel" aria-labelledby={`ss-tab-${current.slug}`} className="ss-panel">
        <div className="ss-visuals">
          {visuals.map((visual, index) => <div key={services[index].slug} className="ss-visual" data-active={active === index || undefined}>{visual}</div>)}
          <span className="ss-big-num" aria-hidden="true">{current.number}</span>
        </div>
        {services.map((service, index) => (
          <div key={service.slug} className="ss-info" hidden={active !== index}>
            <h3>{service.name}</h3>
            <p>{service.summary}</p>
            <ul>{service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
            <Link href={`/services/${service.slug}`} className="ag-btn ag-btn-light">Explore {service.name} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
