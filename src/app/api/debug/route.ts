export async function GET() {
  const uri = process.env.MONGODB_URI || "";

  return Response.json({
    exists: !!uri,
    actualLength: uri.length,
    first50: uri.slice(0, 50),
  });
}