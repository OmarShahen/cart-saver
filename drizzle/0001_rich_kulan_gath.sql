ALTER TABLE "events" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "timestamp" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "source" "source" DEFAULT 'webhook' NOT NULL;