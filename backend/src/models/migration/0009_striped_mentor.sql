ALTER TABLE "users" ALTER COLUMN "language" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'english'::text;--> statement-breakpoint
DROP TYPE "public"."language";--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('english', 'বাংলা');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'english'::"public"."language";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "language" SET DATA TYPE "public"."language" USING "language"::"public"."language";