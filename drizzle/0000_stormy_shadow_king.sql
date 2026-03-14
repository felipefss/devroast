CREATE TYPE "public"."language_enum" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'csharp', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'bash', 'json', 'yaml', 'markdown');--> statement-breakpoint
CREATE TYPE "public"."roast_mode_enum" AS ENUM('normal', 'brutal');--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"content" text NOT NULL,
	"score" text NOT NULL,
	"roast_mode" "roast_mode_enum" DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "language_enum" NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
