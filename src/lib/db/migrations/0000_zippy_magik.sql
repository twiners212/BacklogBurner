CREATE TYPE "public"."game_status" AS ENUM('Wanna Play', 'Playing', 'Completed', 'Dropped');--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_id" integer,
	"title" varchar(255) NOT NULL,
	"cover_url" varchar(500),
	"release_date" varchar(50),
	CONSTRAINT "games_api_id_unique" UNIQUE("api_id")
);
--> statement-breakpoint
CREATE TABLE "user_games" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"status" "game_status" DEFAULT 'Wanna Play' NOT NULL,
	"rating" integer,
	"review" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;