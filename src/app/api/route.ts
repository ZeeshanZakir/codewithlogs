// app/api/debug-user/route.ts

import dbConnect from "@/lib/mongodb";
import { Profile } from "@/lib/profile";

export async function GET() {
  await dbConnect();

  const users = await Profile.find({}, { email: 1 });

  return Response.json(users);
}