"use server";

import { db } from "@/lib/db";
import { games, userGames } from "@/lib/db/schema";
import type { ActionResult } from "./types";

export async function addGameToLibrary(formData: FormData): Promise<ActionResult<{ userGameId: number }>> {
  try {
    const title = formData.get("title") as string;
    const coverUrl = formData.get("coverUrl") as string | null;
    const releaseDate = formData.get("releaseDate") as string | null;
    const status = (formData.get("status") as string) || "Wanna Play";

    if (!title?.trim()) {
      return { success: false, error: "Game title is required" };
    }

    const [newGame] = await db
      .insert(games)
      .values({
        title: title.trim(),
        coverUrl: coverUrl || null,
        releaseDate: releaseDate || null,
      })
      .returning({ id: games.id });

    const [newUserGame] = await db
      .insert(userGames)
      .values({
        gameId: newGame.id,
        status: status as "Wanna Play" | "Playing" | "Completed" | "Dropped",
      })
      .returning({ id: userGames.id });

    return { success: true, data: { userGameId: newUserGame.id } };
  } catch (e) {
    console.error("addGameToLibrary error:", e);
    return { success: false, error: "Failed to add game to library" };
  }
}
