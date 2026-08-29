import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getProfileByUserId } from '$lib/server/db/profile';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/better-auth/login');
	}

	const existingProfile = await getProfileByUserId(locals.user.id);

	const profile = existingProfile
		? {
				username: existingProfile.username,
				email: existingProfile.email,
				marketing: existingProfile.marketing
			}
		: {
				username: '',
				email: '',
				marketing: false
			};

	return {
		profile
	};
};
