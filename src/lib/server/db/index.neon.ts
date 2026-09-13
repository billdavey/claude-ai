import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.postgres';
import { env } from '$env/dynamic/private';

if (!env.NEON_DATABASE_URL) throw new Error('NEON_DATABASE_URL is not set');

const sql = neon(env.NEON_DATABASE_URL);

export const db = drizzle(sql, { schema });
