"use client";

import { FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    setEmail("");
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
          className="inline-flex h-[52px] items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Subscribe
        </button>
      </div>
      {isSubmitted ? (
        <p className="mt-3 text-sm text-white/80">
          Thanks. Your signup UI is connected and ready for a real email service later.
        </p>
      ) : null}
    </form>
  );
}
