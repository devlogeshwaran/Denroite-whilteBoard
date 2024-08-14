ALTER TABLE "users" DROP CONSTRAINT "users_boards_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN IF EXISTS "participants";