"use server";

import { db } from "@/lib/db";
import { games, userGames } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResult } from "./types";

export type GameDetail = {
  userGameId: number;
  gameId: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  status: "Wanna Play" | "Playing" | "Completed" | "Dropped";
  rating: number | null;
  review: string | null;
};

export async function getGameDetail(
  userGameId: number,
): Promise<ActionResult<GameDetail>> {
  try {
    const [row] = await db
      .select({
        userGameId: userGames.id,
        gameId: games.id,
        title: games.title,
        coverUrl: games.coverUrl,
        releaseDate: games.releaseDate,
        status: userGames.status,
        rating: userGames.rating,
        review: userGames.review,
      })
      .from(userGames)
      .innerJoin(games, eq(userGames.gameId, games.id))
      .where(eq(userGames.id, userGameId))
      .limit(1);

    if (!row) {
      return { success: false, error: "Game not found" };
    }

    return { success: true, data: row };
  } catch (e) {
    console.error("getGameDetail error:", e);
    return { success: false, error: "Failed to fetch game details" };
  }
}
