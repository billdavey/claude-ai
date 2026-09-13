import { defineConfig } from 'drizzle-kit';

declare const process: {
	env: {
		NEON_DATABASE_URL?: string;
	};
};

if (!process.env.NEON_DATABASE_URL) {
	throw new Error('NEON_DATABASE_URL is not set');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.postgres.ts',
	out: './drizzle/neon',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.NEON_DATABASE_URL
	},
	verbose: true,
	strict: true
});
