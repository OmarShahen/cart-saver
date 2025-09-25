CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text,
	"cart_id" text NOT NULL,
	"shop" varchar NOT NULL,
	"name" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"meta" jsonb
);
