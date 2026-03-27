CREATE TYPE "public"."match_status" AS ENUM('Scheduled', 'Live', 'Finished');--> statement-breakpoint
CREATE TABLE "commentaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"actor" text,
	"message" text NOT NULL,
	"minute" integer,
	"sequence_no" integer NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"sport" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"status" "match_status" DEFAULT 'Scheduled' NOT NULL,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;