"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/branding/Logo";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = result?.url ?? callbackUrl;
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8 text-center">
        <Logo
          href=""
          priority
          className="mx-auto w-[220px]"
          imageClassName="rounded-xl bg-white p-2 shadow-lg shadow-black/20"
        />
        <h1 className="mt-5 text-3xl font-semibold text-white">Admin Panel</h1>
        <p className="mt-2 text-sm text-white/60">
          Sign in to manage blog posts, messages, and site content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/75">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 text-sm text-white outline-none transition focus:border-primary/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white/75">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 text-sm text-white outline-none transition focus:border-primary/40"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
