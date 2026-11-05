"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AlertCircle, ArrowUpRight, Check } from "lucide-react";

import { budgetOptions, contactFormSchema, serviceOptions, type ContactFormValues } from "@/lib/contact";

const emptyValues: ContactFormValues = { name: "", email: "", company: "", service: "" as ContactFormValues["service"], budget: "", message: "" };

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const initialService = serviceOptions.includes(defaultService ?? "") ? defaultService : "";

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { ...emptyValues, service: (initialService ?? "") as ContactFormValues["service"] },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (values, event) => {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const website = (form?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website, startedAt: startedAt ?? undefined }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string; fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>> };
      if (!response.ok) {
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          if (messages?.[0] && field in emptyValues) setError(field as keyof ContactFormValues, { message: messages[0] });
        }
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }
      reset(emptyValues);
      setStartedAt(null);
      setStatus({ type: "success", message: result.message ?? "Thanks, your message has been received." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error && error.message !== "Failed to fetch" ? error.message : "We couldn't reach the server. Check your connection and try again." });
    }
  };

  if (status?.type === "success") {
    return (
      <div className="ag-form ag-success" role="status" aria-live="polite">
        <span className="ag-success-icon" aria-hidden="true"><Check size={26} /></span>
        <h2>Message received. Thank you.</h2>
        <p>{status.message} If your project is time-sensitive, mention that in a follow-up email and we&apos;ll prioritise it.</p>
        <div className="ag-actions">
          <button type="button" className="ag-btn ag-btn-outline" onClick={() => setStatus(null)}>Send another message</button>
          <Link href="/services" className="ag-btn ag-btn-primary">Explore our services <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    );
  }

  const fieldProps = (name: keyof ContactFormValues) => ({
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    ...register(name),
  });
  const errorFor = (name: keyof ContactFormValues) => errors[name] ? <p id={`contact-${name}-error`} className="ag-field-error">{errors[name]?.message}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={() => { if (startedAt === null) setStartedAt(Date.now()); }} className="ag-form" noValidate aria-describedby="contact-form-note">
      {status?.type === "error" ? (
        <div className="ag-alert ag-alert-error" role="alert"><AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} /><span>{status.message}</span></div>
      ) : null}
      <div className="ag-form-grid">
        <div className="ag-field">
          <label htmlFor="contact-name">Name</label>
          <input type="text" autoComplete="name" required {...fieldProps("name")} />
          {errorFor("name")}
        </div>
        <div className="ag-field">
          <label htmlFor="contact-email">Business email</label>
          <input type="email" autoComplete="email" inputMode="email" required {...fieldProps("email")} />
          {errorFor("email")}
        </div>
        <div className="ag-field">
          <label htmlFor="contact-company">Company <small>(optional)</small></label>
          <input type="text" autoComplete="organization" {...fieldProps("company")} />
          {errorFor("company")}
        </div>
        <div className="ag-field">
          <label htmlFor="contact-service">Service required</label>
          <select required {...fieldProps("service")}>
            <option value="">Choose a service…</option>
            {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {errorFor("service")}
        </div>
        <div className="ag-field ag-field-full">
          <label htmlFor="contact-budget">Estimated budget <small>(optional)</small></label>
          <select {...fieldProps("budget")}>
            <option value="">Select a range…</option>
            {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {errorFor("budget")}
        </div>
        <div className="ag-field ag-field-full">
          <label htmlFor="contact-message">Project details</label>
          <textarea rows={7} required placeholder="What are you building or improving? What challenges are you facing, and what would success look like?" {...fieldProps("message")} />
          {errorFor("message")}
        </div>
        <div className="ag-hp" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <div className="ag-form-foot">
        <small id="contact-form-note">We use your details only to reply to your enquiry. See our <Link href="/privacy-policy">privacy policy</Link>.</small>
        <button type="submit" className="ag-btn ag-btn-primary ag-btn-lg" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <><span className="ag-spinner" aria-hidden="true" /> Sending…</> : <>Send message <ArrowUpRight size={17} aria-hidden="true" /></>}
        </button>
      </div>
    </form>
  );
}
