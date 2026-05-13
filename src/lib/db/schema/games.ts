import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const gameStatusEnum = pgEnum("game_status", [
  "Wanna Play",
  "Playing",
  "Completed",
  "Dropped",
]);

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  apiId: integer("api_id").unique(),
  title: varchar("title", { length: 255 }).notNull(),
  coverUrl: varchar("cover_url", { length: 500 }),
  releaseDate: varchar("release_date", { length: 50 }),
});

export const userGames = pgTable("user_games", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  status: gameStatusEnum("status").default("Wanna Play").notNull(),
  rating: integer("rating"),
  review: text("review"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
