ALTER TABLE "author" ADD COLUMN "createdBy" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "createdBy" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "author" ADD CONSTRAINT "author_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;