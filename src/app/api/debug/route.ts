export async function GET() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://codewithlogs:QWRtaW5AMTIz@codewithlogs.kdzgntg.mongodb.net/codewithlogs?retryWrites=true&w=majority&appName=codewithlogs";

  return Response.json({
    exists: !!uri,
    actualLength: uri.length,
    first50: uri.slice(0, 50),
  });
}