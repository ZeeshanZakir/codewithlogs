"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/authorization";

export async function addNote(form: FormData) {
  const client = await createClient(true);
  const user = await requireUser(client);
  const body = form.get("body");
  if (typeof body !== "string" || !body.trim() || body.length > 2000) {
    throw new Error("Enter a note between 1 and 2000 characters.");
  }
  const { error } = await client.from("notes").insert({ user_id: user.id, body: body.trim() });
  if (error) throw new Error("Note could not be saved.");
  revalidatePath("/dashboard");
}
