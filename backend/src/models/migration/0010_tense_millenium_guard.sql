CREATE TABLE "stat" (
	"bookId" integer NOT NULL,
	"userId" integer NOT NULL,
	"pagesRead" integer DEFAULT 1 NOT NULL,
	"readTimeSeconds" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "statPK" PRIMARY KEY("bookId","userId")
);
--> statement-breakpoint
ALTER TABLE "stat" ADD CONSTRAINT "stat_bookId_book_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stat" ADD CONSTRAINT "stat_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;