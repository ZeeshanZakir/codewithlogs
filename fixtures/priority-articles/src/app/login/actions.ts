"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(form: FormData) {
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    redirect("/login?error=invalid-input");
  }
  const client = await createClient(true);
  const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) redirect("/login?error=sign-in-failed");
  redirect("/dashboard");
}

export async function logout() {
  const client = await createClient(true);
  const { error } = await client.auth.signOut();
  if (error) throw new Error("Sign-out failed.");
  redirect("/login");
}
