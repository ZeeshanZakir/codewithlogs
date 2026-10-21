import { AuthenticationRequired, requireUser } from "@/lib/authorization";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const client = await createClient(true);
    const user = await requireUser(client);
    return Response.json({ userId: user.id }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof AuthenticationRequired) return Response.json({ error: "Authentication required." }, { status: 401 });
    return Response.json({ error: "Authentication unavailable." }, { status: 503 });
  }
}
