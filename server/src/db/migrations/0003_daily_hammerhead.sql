ALTER TABLE "rooms" RENAME TO "boards";--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "rooms_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "boards" text[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boards" ADD CONSTRAINT "boards_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_boards_boards_id_fk" FOREIGN KEY ("boards") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
