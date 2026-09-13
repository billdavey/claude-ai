import { env } from '$env/dynamic/private';
export const db =
	env.DATABASE_PROVIDER === 'neon'
		? (await import('./index.neon')).db
		: (await import('./index.sqlite')).db;
