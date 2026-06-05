export async function GET() {
  const uri = process.env.MONGODB_URI || "";

  return Response.json({
    exists: !!uri,
    start: uri.substring(0, 25),
    containsAtlas: uri.includes("mongodb.net"),
    hostname: uri.match(/@([^/]+)/)?.[1],
  });
}