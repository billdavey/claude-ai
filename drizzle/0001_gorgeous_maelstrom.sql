PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`username` text,
	`display_username` text,
	`marketing` integer DEFAULT false NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`phone_number` text DEFAULT '' NOT NULL,
	`secondary_email` text DEFAULT '' NOT NULL,
	`date_of_birth` integer DEFAULT 0 NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`job_title` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`locale` text DEFAULT '' NOT NULL,
	`timezone` text DEFAULT '' NOT NULL,
	`theme` text DEFAULT '' NOT NULL,
	`email_notifications` integer DEFAULT true NOT NULL,
	`push_notifications` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "email_verified", "image", "created_at", "updated_at", "username", "display_username", "marketing", "bio", "phone_number", "secondary_email", "date_of_birth", "location", "company", "job_title", "website", "locale", "timezone", "theme", "email_notifications", "push_notifications") SELECT "id", "name", "email", "email_verified", "image", "created_at", "updated_at", "username", "display_username", "marketing", "bio", "phone_number", "secondary_email", "date_of_birth", "location", "company", "job_title", "website", "locale", "timezone", "theme", "email_notifications", "push_notifications" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);