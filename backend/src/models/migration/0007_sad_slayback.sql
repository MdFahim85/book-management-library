ALTER TABLE "users" ADD COLUMN "theme" varchar(255) DEFAULT 'light' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "language" varchar(255) DEFAULT 'english' NOT NULL;