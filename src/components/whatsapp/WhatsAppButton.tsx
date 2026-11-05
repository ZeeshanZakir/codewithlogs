import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  message: string;
  label?: string;
  variant?: "outline" | "light" | "ghost-light" | "link";
  className?: string;
};

/** A contextual WhatsApp CTA. Renders nothing until a real number is configured. */
export function WhatsAppButton({ message, label = "Chat on WhatsApp", variant = "outline", className = "" }: Props) {
  const href = whatsappHref(message);
  if (!href) return null;
  const variantClass = variant === "link" ? "ag-wa-link" : `ag-btn ag-btn-${variant} ag-wa-btn`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${variantClass} ${className}`.trim()} aria-label={`${label} (opens WhatsApp in a new tab)`}>
      <WhatsAppIcon size={variant === "link" ? 16 : 18} />
      {label}
    </a>
  );
}
