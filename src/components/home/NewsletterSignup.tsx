"use client";

import { FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setFeedbackTone("error");
      setFeedback("Enter your email address to subscribe.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback("");
      setFeedbackTone(null);

      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          blogUpdates: true,
          promotions: false,
          source: "homepage",
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save your subscription.");
      }

      setFeedbackTone("success");
      setFeedback(payload.message ?? "Thanks for subscribing.");
      setEmail("");
    } catch (error) {
      setFeedbackTone("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to save your subscription right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="h-[52px] w-full rounded-full border border-white/20 bg-white px-5 text-sm text-text outline-none transition-shadow placeholder:text-text/50 focus:ring-4 focus:ring-white/15"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-[52px] items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {feedback ? (
        <p
          className={`mt-3 text-sm ${
            feedbackTone === "error" ? "text-red-200" : "text-white/80"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
