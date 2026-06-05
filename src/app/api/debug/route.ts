export async function GET() {
  const uri = process.env.MONGODB_URI || "";

  return Response.json({
    exists: !!uri,
    length: uri.length,
    containsMongoNet: uri.includes(".mongodb.net"),
    containsCodeWithLogs: uri.includes("codewithlogs.kdzgntg"),
  });
}