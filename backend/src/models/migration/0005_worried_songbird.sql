ALTER TABLE "book" DROP CONSTRAINT "book_authorId_author_id_fk";
--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_authorId_author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."author"("id") ON DELETE cascade ON UPDATE no action;