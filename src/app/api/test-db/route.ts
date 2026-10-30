import { auth } from "@/auth";
import { getRole } from "@/lib/roles";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  const session = await auth();
  if (!session?.user || getRole(session) !== "admin") return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    return Response.json({ success: true, state: mongoose.connection.readyState }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: "Database connection failed." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
