"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export type ExplorerService = {
  slug: string;
  number: string;
  name: string;
  summary: string;
  capabilities: string[];
  technologies: string[];
};

export function ServiceExplorer({ services }: { services: ExplorerService[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: services.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + services.length) % services.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="ag-explorer">
      <div className="ag-explorer-tabs" role="tablist" aria-label="Our services" aria-orientation="vertical">
        {services.map((service, index) => (
          <button
            key={service.slug}
            ref={(element) => { tabs.current[index] = element; }}
            type="button"
            role="tab"
            id={`service-tab-${service.slug}`}
            aria-selected={active === index}
            aria-controls={`service-panel-${service.slug}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="ag-explorer-num">{service.number}</span>
            <span className="ag-explorer-name">{service.name}</span>
          </button>
        ))}
      </div>
      {services.map((service, index) => (
        <div
          key={service.slug}
          role="tabpanel"
          id={`service-panel-${service.slug}`}
          aria-labelledby={`service-tab-${service.slug}`}
          hidden={active !== index}
          className="ag-explorer-panel"
        >
          <div className="ag-explorer-panel-top">
            <span className="ag-explorer-big" aria-hidden="true">{service.number}</span>
            <h3>{service.name}</h3>
            <p>{service.summary}</p>
          </div>
          <ul className="ag-explorer-caps">
            {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <div className="ag-explorer-foot">
            <p className="ag-explorer-tech"><span>Typical stack</span> {service.technologies.join(" · ")}</p>
            <Link href={`/services/${service.slug}`} className="ag-btn ag-btn-primary">Explore {service.name} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      ))}
    </div>
  );
}
