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

      const payload = (await response.json()) as { error?: string; message?: string; };

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
    <form onSubmit={handleSubmit} className="newsletter-form">
      <div className="newsletter-form-row">
        <input
          type="email" name="email" autoComplete="email" aria-label="Email address for article updates"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"

        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="journal-button"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {feedback ? (
        <p
          className="newsletter-feedback" data-error={feedbackTone === "error"} role="status" aria-live="polite"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
