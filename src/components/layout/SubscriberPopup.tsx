"use client";

import { useEffect, useState } from "react";
import { BellRing, X } from "lucide-react";

const POPUP_DELAY_MS = 3000;
const SUBSCRIBED_KEY = "cwl-subscriber-joined";

type RequestState = "idle" | "submitting" | "success" | "error";

function shouldOpenPopup() {
  if (typeof window === "undefined") {
    return false;
  }

  const hasSubscribed = window.localStorage.getItem(SUBSCRIBED_KEY) === "true";

  if (hasSubscribed) {
    return false;
  }

  return true;
}

export function SubscriberPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!shouldOpenPopup()) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  function closePopup() {
    setIsOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setRequestState("error");
      setFeedback("Enter your email address to subscribe.");
      return;
    }

    try {
      setRequestState("submitting");
      setFeedback("");

      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          blogUpdates: true,
          promotions: true,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save your subscription.");
      }

      window.localStorage.setItem(SUBSCRIBED_KEY, "true");
      setRequestState("success");
      setFeedback(payload.message ?? "You are subscribed.");
      setEmail("");

      window.setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      setRequestState("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to save your subscription right now.",
      );
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4">
      <div className="relative w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          aria-label="Close subscription popup"
          onClick={closePopup}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-text/60 transition-colors hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellRing className="h-5 w-5" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text">
          Subscribe for updates
        </h2>
        <p className="mt-3 text-sm leading-7 text-text/70">
          Get notified when new blog posts go live and when I share promotions or helpful
          offers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            className="h-12 w-full rounded-full border border-black/10 px-4 text-sm text-text outline-none transition-shadow placeholder:text-text/45 focus:ring-4 focus:ring-primary/10"
            required
          />

          <button
            type="submit"
            disabled={requestState === "submitting"}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {requestState === "submitting" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {feedback ? (
          <p
            className={`mt-4 text-sm ${
              requestState === "success" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}
