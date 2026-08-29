import { form, getRequestEvent } from '$app/server';
import { z } from 'zod';

import { auth } from '$lib/server/auth';
import {
	createProfile as createProfileRow,
	getProfileByUserId,
	updateProfileByUserId
} from '$lib/server/db/profile';

const profileSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters.')
		.max(20, 'Username must be under 20 characters.'),
	email: z.email('Please enter a valid email address.'),
	marketing: z.boolean().default(false)
});

export type ProfileSchemaValues = z.infer<typeof profileSchema>;

export const createProfile = form(profileSchema, async (data) => {
	const event = getRequestEvent();
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (!session?.user) {
		throw new Error('You must be signed in to save your profile.');
	}

	const existing = await getProfileByUserId(session.user.id);

	if (existing) {
		await updateProfileByUserId(session.user.id, {
			username: data.username,
			email: data.email,
			marketing: data.marketing
		});
	} else {
		await createProfileRow({
			userId: session.user.id,
			username: data.username,
			email: data.email,
			marketing: data.marketing
		});
	}

	const savedProfile = await getProfileByUserId(session.user.id);

	return {
		success: true,
		message: `Account details for ${data.username} synced successfully!`,
		profile: savedProfile
			? {
					username: savedProfile.username,
					email: savedProfile.email,
					marketing: savedProfile.marketing
				}
			: {
					username: data.username,
					email: data.email,
					marketing: data.marketing
				}
	};
});
