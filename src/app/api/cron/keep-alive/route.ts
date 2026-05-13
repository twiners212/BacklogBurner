import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      success: true,
      message: "Database is warm and awake!",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Ping failed" },
      { status: 500 },
    );
  }
}
