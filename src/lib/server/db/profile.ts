import { eq } from 'drizzle-orm';

import { db } from './index';
import { profile } from './schema';

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
export type ProfileUpdate = Partial<Omit<NewProfile, 'id' | 'userId' | 'createdAt'>> & {
	updatedAt?: Date;
};

export async function createProfile(input: NewProfile) {
	const [row] = await db.insert(profile).values(input).returning();
	return row;
}

export async function getProfiles() {
	return db.select().from(profile);
}

export async function getProfileById(id: string) {
	const [row] = await db.select().from(profile).where(eq(profile.id, id));
	return row ?? null;
}

export async function getProfileByUserId(userId: string) {
	const [row] = await db.select().from(profile).where(eq(profile.userId, userId));
	return row ?? null;
}

export async function updateProfile(id: string, values: ProfileUpdate) {
	const [row] = await db
		.update(profile)
		.set({
			...values,
			updatedAt: new Date()
		})
		.where(eq(profile.id, id))
		.returning();

	return row ?? null;
}

export async function updateProfileByUserId(userId: string, values: ProfileUpdate) {
	const [row] = await db
		.update(profile)
		.set({
			...values,
			updatedAt: new Date()
		})
		.where(eq(profile.userId, userId))
		.returning();

	return row ?? null;
}

export async function deleteProfile(id: string) {
	const [row] = await db.delete(profile).where(eq(profile.id, id)).returning();
	return row ?? null;
}

export async function deleteProfileByUserId(userId: string) {
	const [row] = await db.delete(profile).where(eq(profile.userId, userId)).returning();
	return row ?? null;
}
