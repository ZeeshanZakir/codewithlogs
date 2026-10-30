import { auth } from "@/auth";
import { getRole } from "@/lib/roles";
import dbConnect from "@/lib/mongodb";
import { Profile } from "@/lib/profile";

export async function GET() {
  const session = await auth();
  if (!session?.user || getRole(session) !== "admin") return Response.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const users = await Profile.find({}, { email: 1 });
  return Response.json(users, { headers: { "Cache-Control": "no-store" } });
}
