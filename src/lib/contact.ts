import { z } from "zod";

export const budgetOptions = [
  "Under $500",
  "$500-$1500",
  "$1500-$5000",
  "$5000+",
] as const;

export const subjectOptions = [
  "New Project",
  "Freelance Work",
  "Blog Collaboration",
  "General Question",
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.email("Enter a valid email address."),
  subject: z.enum(subjectOptions, {
    error: "Select a subject.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters."),
  budget: z.enum(budgetOptions, {
    error: "Select a budget range.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
