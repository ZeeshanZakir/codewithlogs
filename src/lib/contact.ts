import { z } from "zod";
import { services } from "@/lib/services";

export const serviceOptions: [string, ...string[]] = [
  "Not sure yet",
  ...services.map((service) => service.name),
  "Article question or correction",
  "Something else",
];

export const budgetOptions = [
  "Prefer not to say",
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
  email: z.email("Please enter a valid business email address.").trim().max(200),
  company: z.string().trim().max(120, "Please keep the company name under 120 characters.").optional().or(z.literal("")),
  service: z.enum(serviceOptions, { error: "Please choose the service you need." }),
  budget: z.enum(budgetOptions).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please share a little more detail (at least 20 characters).")
    .max(5000, "Please keep project details under 5,000 characters."),
});

/** Server-side schema adds spam-protection fields that are not shown to people. */
export const contactSubmissionSchema = contactFormSchema.extend({
  // Honeypot: hidden from people, often filled in by bots. Must stay empty.
  website: z.string().max(500).optional(),
  // Time the form was rendered (ms since epoch), used to reject instant submissions.
  startedAt: z.number().int().positive().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
