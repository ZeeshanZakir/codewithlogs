"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { whatsappHref, whatsappMessages, type WhatsAppTopic } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

const quickActions: { topic: WhatsAppTopic; label: string }[] = [
  { topic: "website", label: "I need a website" },
  { topic: "seo", label: "I'm looking for SEO services" },
  { topic: "branding", label: "I need branding & design" },
  { topic: "marketing", label: "I want digital marketing" },
  { topic: "custom", label: "I have a custom project" },
];

/**
 * Floating WhatsApp launcher with a small on-site panel. The panel only helps
 * visitors pick a prefilled message; the conversation itself happens in
 * WhatsApp. There is no live chat, presence or messaging backend here.
 */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(".ag-wa-close")?.focus();
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!whatsappHref("")) return null;

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="ag-wa" data-open={open || undefined}>
      <div ref={panelRef} id={panelId} role="dialog" aria-modal="false" aria-labelledby={titleId} className="ag-wa-panel" hidden={!open}>
        <div className="ag-wa-head">
          <span className="ag-wa-avatar" aria-hidden="true"><span>/</span>l</span>
          <div>
            <p id={titleId} className="ag-wa-title">CodeWithLogs Support</p>
            <p className="ag-wa-status">Let&apos;s talk about your project.</p>
          </div>
          <button type="button" className="ag-wa-close" onClick={close} aria-label="Close WhatsApp panel"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="ag-wa-body">
          <p className="ag-wa-bubble">Hey there! 👋 Welcome to CodeWithLogs. Looking for a website, branding, SEO, digital marketing, or a custom solution? We&apos;d love to hear about your project.</p>
          <p className="ag-wa-prompt" id={`${panelId}-prompt`}>Choose a topic to start a WhatsApp message:</p>
          <ul className="ag-wa-actions" aria-labelledby={`${panelId}-prompt`}>
            {quickActions.map((action) => (
              <li key={action.topic}>
                <a href={whatsappHref(whatsappMessages[action.topic]) ?? undefined} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                  <span>{action.label}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="ag-wa-foot">
          <a href={whatsappHref(whatsappMessages.general) ?? undefined} target="_blank" rel="noopener noreferrer" className="ag-wa-open" onClick={() => setOpen(false)}>
            <WhatsAppIcon size={18} /> Open WhatsApp
          </a>
          <p>Opens WhatsApp in a new tab with your message ready to edit. This panel is not a live chat. Prefer email? Use our <a href="/contact">contact form</a>.</p>
        </div>
      </div>
      <button
        ref={launcherRef}
        type="button"
        className="ag-wa-launcher"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close WhatsApp panel" : "Contact us on WhatsApp"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ag-wa-launcher-icon" aria-hidden="true">{open ? <X size={24} /> : <WhatsAppIcon size={28} />}</span>
      </button>
    </div>
  );
}
