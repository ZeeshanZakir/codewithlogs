export const dynamic = "force-dynamic";

export function GET() {
  // Synthetic fixture label only. Never return real environment secrets.
  return Response.json({ label: process.env.FIXTURE_SERVER_LABEL ?? "unset" });
}
