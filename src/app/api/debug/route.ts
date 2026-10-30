import { auth } from "@/auth";
import { getRole } from "@/lib/roles";

export async function GET() {
  const session = await auth();
  if (!session?.user || getRole(session) !== "admin") return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ configured: Boolean(process.env.MONGODB_URI) }, { headers: { "Cache-Control": "no-store" } });
}
