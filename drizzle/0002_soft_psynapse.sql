CREATE TABLE IF NOT EXISTS "fitquest_account" (
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "fitquest_account_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fitquest_magicLink" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "fitquest_magicLink_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fitquest_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"length_unit" "length_unit" NOT NULL,
	"weight_unit" "weight_unit" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fitquest_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fitquest_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"email_verified" timestamp with time zone,
	"profile_picture" text,
	"gender" "gender" NOT NULL,
	"birth_day" date NOT NULL,
	"height" numeric(10, 2) NOT NULL,
	"weight" numeric(10, 2) NOT NULL,
	"plan" "plan" DEFAULT 'Free' NOT NULL,
	CONSTRAINT "fitquest_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "fitquestaccount";--> statement-breakpoint
DROP TABLE "fitquestmagicLink";--> statement-breakpoint
DROP TABLE "fitquestpreference";--> statement-breakpoint
DROP TABLE "fitquestsession";--> statement-breakpoint
DROP TABLE "fitquestuser";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fitquest_account" ADD CONSTRAINT "fitquest_account_user_id_fitquest_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fitquest_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fitquest_session" ADD CONSTRAINT "fitquest_session_user_id_fitquest_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fitquest_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
