"use server";

import { db } from "@/lib/db";
import { games, userGames } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResult } from "./types";

export async function deleteGame(
  userGameId: number,
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

    await db.delete(games).where(eq(games.id, userGame.gameId));

    return { success: true, data: undefined };
  } catch (e) {
    console.error("deleteGame error:", e);
    return { success: false, error: "Failed to delete game" };
  }
}
