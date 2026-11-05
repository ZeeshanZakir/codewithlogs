/**
 * WhatsApp click-to-chat configuration.
 *
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER in the environment (Vercel project settings
 * and .env.local) as an international number, e.g. 923001234567. A leading
 * "+", "00", spaces, dashes, dots and brackets are stripped automatically,
 * because wa.me needs digits only. When it is missing or invalid, every
 * WhatsApp button is hidden instead of linking to a fake number.
 */
const rawNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "")
  .trim()
  .replace(/^["']|["']$/g, "")
  .replace(/[\s\-().]/g, "")
  .replace(/^\+/, "")
  .replace(/^00/, "");

export const whatsappNumber = /^[1-9]\d{7,14}$/.test(rawNumber) ? rawNumber : null;

export const whatsappMessages = {
  general: "Hi CodeWithLogs! I'd like to discuss a project with you.",
  consultation: "Hi CodeWithLogs! I'd like to book a free consultation about my project.",
  website: "Hi CodeWithLogs! I'm interested in your website design and development services. I'd like to discuss my project.",
  seo: "Hi CodeWithLogs! I'm looking for SEO services and would like to talk about improving my search visibility.",
  branding: "Hi CodeWithLogs! I need branding and design work and would like to discuss my project.",
  marketing: "Hi CodeWithLogs! I'm interested in digital marketing services and would like to discuss my goals.",
  custom: "Hi CodeWithLogs! I have a custom project in mind and would like to discuss it with you.",
} as const;

export type WhatsAppTopic = keyof typeof whatsappMessages;

export function whatsappHref(message: string) {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message).replace(/'/g, "%27")}`;
}

export function serviceWhatsAppMessage(serviceName: string) {
  return `Hi CodeWithLogs! I'm interested in your ${serviceName} services and would like to discuss my project.`;
}
