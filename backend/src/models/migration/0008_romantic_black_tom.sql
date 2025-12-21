CREATE TYPE "public"."language" AS ENUM('english', 'bangla');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "theme" SET DEFAULT 'light'::"public"."theme";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "theme" SET DATA TYPE "public"."theme" USING "theme"::"public"."theme";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'english'::"public"."language";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "language" SET DATA TYPE "public"."language" USING "language"::"public"."language";