import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/authorization";

export async function readOwnNotes() {
  const client = await createClient();
  const user = await requireUser(client);
  const { data, error } = await client.from("notes").select("id, body").eq("user_id", user.id);
  if (error) throw new Error("Notes could not be loaded.");
  return data as { id: string; body: string }[];
}
