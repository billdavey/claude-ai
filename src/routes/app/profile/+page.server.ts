import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { extractProfileFields } from '$lib/server/db/profile';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	// Profile data is now stored directly on the user record (Better Auth additionalFields)
	// Extract profile fields from the authenticated user object
	const profileFields = extractProfileFields(locals.user);

	const profile = {
		// Core user fields from Better Auth
		username: locals.user.username ?? '',
		email: locals.user.email,
		name: locals.user.name,
		image: locals.user.image ?? null,
		// Profile fields (now on user table via additionalFields)
		marketing: profileFields.marketing,
		bio: profileFields.bio,
		phoneNumber: profileFields.phoneNumber,
		secondaryEmail: profileFields.secondaryEmail,
		dateOfBirth: profileFields.dateOfBirth,
		location: profileFields.location,
		company: profileFields.company,
		jobTitle: profileFields.jobTitle,
		website: profileFields.website,
		locale: profileFields.locale,
		timezone: profileFields.timezone,
		theme: profileFields.theme,
		emailNotifications: profileFields.emailNotifications,
		pushNotifications: profileFields.pushNotifications
	};

	return {
		profile
	};
};
