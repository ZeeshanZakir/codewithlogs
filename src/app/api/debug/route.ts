// app/api/debug/route.ts
export async function GET() {
  return Response.json({
    email: process.env.ADMIN_EMAIL,
    hashExists: !!process.env.ADMIN_PASSWORD_HASH,
    hashStart: process.env.ADMIN_PASSWORD_HASH?.substring(0, 4),
  });
}