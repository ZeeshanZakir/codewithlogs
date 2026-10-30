import { auth } from "@/auth";
import { getRole } from "@/lib/roles";
import dbConnect from "@/lib/mongodb";
import { Subscriber } from "@/lib/subscriber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeCsvValue(value: string) {
  const normalized = value.replace(/"/g, "\"\"");
  return `"${normalized}"`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.email || getRole(session) !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();

  const subscribers = await Subscriber.find()
    .sort({ subscribedAt: -1 })
    .lean();

  const header = [
    "email",
    "blogUpdates",
    "promotions",
    "source",
    "status",
    "subscribedAt",
    "updatedAt",
  ];

  const rows = subscribers.map((subscriber) =>
    [
      subscriber.email,
      String(subscriber.blogUpdates),
      String(subscriber.promotions),
      subscriber.source,
      subscriber.status,
      subscriber.subscribedAt.toISOString(),
      subscriber.updatedAt.toISOString(),
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");
  const fileName = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
