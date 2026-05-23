"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowRight } from "lucide-react";

import {
  budgetOptions,
  contactFormSchema,
  subjectOptions,
  type ContactFormValues,
} from "@/lib/contact";

type ToastState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function ContactForm() {
  const [toast, setToast] = useState<ToastState>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "New Project",
      message: "",
      budget: "Under $500",
    },
  });

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    setToast(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      reset({
        name: "",
        email: "",
        subject: "New Project",
        message: "",
        budget: "Under $500",
      });

      setToast({
        type: "success",
        message: result.message ?? "Your message has been sent successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message right now.",
      });
    }
  };

  return (
    <>
      {toast ? (
        <div
          className={`fixed right-4 top-4 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-primary text-white"
              : "bg-red-600 text-white"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-black/6 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-text">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="h-12 w-full rounded-xl border border-black/8 bg-white px-4 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
            />
            {errors.name ? (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="h-12 w-full rounded-xl border border-black/8 bg-white px-4 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
            />
            {errors.email ? (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-semibold text-text">
              Subject
            </label>
            <select
              id="subject"
              {...register("subject")}
              className="h-12 w-full rounded-xl border border-black/8 bg-white px-4 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.subject ? (
              <p className="text-sm text-red-600">{errors.subject.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-semibold text-text">
              Budget Range
            </label>
            <select
              id="budget"
              {...register("budget")}
              className="h-12 w-full rounded-xl border border-black/8 bg-white px-4 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
            >
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.budget ? (
              <p className="text-sm text-red-600">{errors.budget.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-semibold text-text">
            Message
          </label>
          <textarea
            id="message"
            rows={7}
            {...register("message")}
            className="w-full rounded-xl border border-black/8 bg-white px-4 py-3 text-sm text-text outline-none focus:ring-4 focus:ring-primary/10"
          />
          {errors.message ? (
            <p className="text-sm text-red-600">{errors.message.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}
