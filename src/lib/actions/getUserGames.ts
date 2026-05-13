"use server";

import { db } from "@/lib/db";
import { games, userGames } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ActionResult } from "./types";

export type GameEntry = {
  userGameId: number;
  id: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  status: "Wanna Play" | "Playing" | "Completed" | "Dropped";
  rating: number | null;
  review: string | null;
};

export type StatusCounts = {
  total: number;
  wannaPlay: number;
  playing: number;
  completed: number;
  dropped: number;
};

export async function getUserGames(
  statusFilter?: string,
  page: number = 1,
  limit: number = 8,
): Promise<
  ActionResult<{
    games: GameEntry[];
    totalPages: number;
    totalCount: number;
    statusCounts: StatusCounts;
  }>
> {
  try {
    const offset = (page - 1) * limit;

    const whereConditions =
      statusFilter && statusFilter !== "All"
        ? eq(userGames.status, statusFilter as any)
        : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userGames)
      .where(whereConditions);

    const totalCount = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const rows = await db
      .select({
        userGameId: userGames.id,
        id: games.id,
        title: games.title,
        coverUrl: games.coverUrl,
        releaseDate: games.releaseDate,
        status: userGames.status,
        rating: userGames.rating,
        review: userGames.review,
      })
      .from(userGames)
      .innerJoin(games, eq(userGames.gameId, games.id))
      .where(whereConditions)
      .limit(limit)
      .offset(offset);

    const countRows = await db
      .select({
        status: userGames.status,
        count: sql<number>`count(*)`,
      })
      .from(userGames)
      .groupBy(userGames.status);

    const statusCounts: StatusCounts = {
      total: 0,
      wannaPlay: 0,
      playing: 0,
      completed: 0,
      dropped: 0,
    };

    for (const row of countRows) {
      const key = row.status.replace(" ", "") as keyof StatusCounts;
      if (key in statusCounts) {
        statusCounts[key] = Number(row.count);
      }
      statusCounts.total += Number(row.count);
    }

    return { success: true, data: { games: rows, totalPages, totalCount, statusCounts } };
  } catch (e) {
    console.error("getUserGames error:", e);
    return { success: false, error: "Failed to fetch library" };
  }
}
