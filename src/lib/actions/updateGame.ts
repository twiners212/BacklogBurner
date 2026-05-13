"use server";

import { db } from "@/lib/db";
import { games, userGames } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResult } from "./types";

export async function updateGame(
  userGameId: number,
  data: {
    title: string;
    coverUrl: string | null;
    releaseDate: string | null;
    status: "Wanna Play" | "Playing" | "Completed" | "Dropped";
    rating: number | null;
    review: string | null;
  },
): Promise<ActionResult> {
  try {
    const [userGame] = await db
      .select({ gameId: userGames.gameId })
      .from(userGames)
      .where(eq(userGames.id, userGameId))
      .limit(1);

    if (!userGame) {
      return { success: false, error: "Game not found" };
    }

    await db
      .update(games)
      .set({
        title: data.title.trim(),
        coverUrl: data.coverUrl || null,
        releaseDate: data.releaseDate || null,
      })
      .where(eq(games.id, userGame.gameId));

    await db
      .update(userGames)
      .set({
        status: data.status,
        rating: data.rating,
        review: data.review,
        updatedAt: new Date(),
      })
      .where(eq(userGames.id, userGameId));

    return { success: true, data: undefined };
  } catch (e) {
    console.error("updateGame error:", e);
    return { success: false, error: "Failed to update game" };
  }
}
