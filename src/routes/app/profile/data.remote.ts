import { form, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { z } from 'zod';

import { auth } from '$lib/server/auth';

const profileSchema = z.object({
	name: z.string().min(1, 'Name is required.').max(120, 'Name must be under 120 characters.'),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters.')
		.max(20, 'Username must be under 20 characters.'),
	email: z.email('Please enter a valid email address.'),
	marketing: z.boolean().default(false),
	// Additional profile fields. Text/url/email/date fields also accept an
	// empty string (the "not set" state for an optional input), since a
	// rendered `<input>` always submits *something* rather than omitting
	// the key entirely.
	bio: z.string().max(500, 'Bio must be under 500 characters.').optional(),
	phoneNumber: z
		.string()
		.regex(/^\+1 \d{3} \d{3} \d{4}$/, {
			message: 'Phone number must match format: +1 555 555 5555'
		})
		.optional(),
	secondaryEmail: z.union([
		z.email('Please enter a valid secondary email address.'),
		z.literal('')
	]),
	dateOfBirth: z.union([z.iso.date('Please enter a valid date.'), z.literal('')]),
	location: z.string().max(120, 'Location must be under 120 characters.').optional(),
	company: z.string().max(120, 'Company must be under 120 characters.').optional(),
	jobTitle: z.string().max(120, 'Job title must be under 120 characters.').optional(),
	website: z.union([z.url('Please enter a valid URL.'), z.literal('')]),
	locale: z.string().max(35, 'Locale must be under 35 characters.').optional(),
	timezone: z.string().max(64, 'Timezone must be under 64 characters.').optional(),
	theme: z.enum(['', 'system', 'light', 'dark']),
	// A checkbox that's unchecked at submit time is omitted from FormData
	// entirely rather than sent as `false`, so `.default(false)` is what
	// correctly turns "key absent" into `false` here. This only works
	// because `false` is the right fallback for "unchecked" specifically —
	// it is *not* a statement about what a brand new profile should default
	// to (that's handled by `+page.server.ts`'s load function instead).
	emailNotifications: z.boolean().default(false),
	pushNotifications: z.boolean().default(false)
});

export type ProfileSchemaValues = z.infer<typeof profileSchema>;

export const createProfile = form(profileSchema, async (data, issue) => {
	const event = getRequestEvent();
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (!session?.user) {
		throw new Error('You must be signed in to save your profile.');
	}

	let emailChangeRequested = false;

	// Name lives on the `user` table (better-auth core field) —
	// only touch it if it actually changed, since `updateUser` will otherwise
	// happily re-validate/re-write an unchanged value.
	if (data.name !== (session.user.name ?? '')) {
		try {
			await auth.api.updateUser({
				body: { name: data.name },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				invalid(issue.name(error.message || 'Could not update name.'));
			}
			throw error;
		}
	}

	// Username lives on the `user` table (better-auth username plugin) —
	// only touch it if it actually changed, since `updateUser` will otherwise
	// happily re-validate/re-write an unchanged value.
	if (data.username !== (session.user.username ?? '')) {
		try {
			await auth.api.updateUser({
				body: { username: data.username },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				invalid(issue.username(error.message || 'That username is not available.'));
			}
			throw error;
		}
	}

	// Email changes go through better-auth's verification flow — the address
	// on `session.user.email` is NOT updated until the user clicks the link
	// sent to the *new* address, so we never write it directly here.
	if (data.email !== session.user.email) {
		try {
			await auth.api.changeEmail({
				body: {
					newEmail: data.email,
					callbackURL: '/auth/verification-success'
				},
				headers: event.request.headers
			});
			emailChangeRequested = true;
		} catch (error) {
			if (error instanceof APIError) {
				invalid(issue.email(error.message || 'Could not start the email change.'));
			}
			throw error;
		}
	}

	// Empty strings represent "not set" for these optional fields — store
	// as empty string in the database (Better Auth's default for string fields).
	// For dateOfBirth, convert to timestamp_ms if provided.
	const profileUpdates = {
		name: data.name,
		marketing: data.marketing,
		bio: data.bio || '',
		phoneNumber: data.phoneNumber || '',
		secondaryEmail: data.secondaryEmail || '',
		dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).getTime() : 0,
		location: data.location || '',
		company: data.company || '',
		jobTitle: data.jobTitle || '',
		website: data.website || '',
		locale: data.locale || '',
		timezone: data.timezone || '',
		theme: data.theme || '',
		emailNotifications: data.emailNotifications,
		pushNotifications: data.pushNotifications
	};

	// Update all profile fields via Better Auth's updateUser
	// This updates both the profile fields and the user record atomically
	try {
		await auth.api.updateUser({
			body: profileUpdates,
			headers: event.request.headers
		});
	} catch (error) {
		if (error instanceof APIError) {
			throw new Error(error.message || 'Failed to update profile');
		}
		throw error;
	}

	// Get the updated session to ensure we have the latest user data
	const updatedSession = await auth.api.getSession({ headers: event.request.headers });
	const savedProfile = updatedSession?.user;

	return {
		success: true,
		message: emailChangeRequested
			? `Profile updated. Check ${data.email} to confirm your new email address.`
			: `Account details for ${data.name} synced successfully!`,
		profile: {
			name: data.name,
			username: data.username,
			// Keep displaying the *current* (still-verified) email until the
			// change-email link is clicked — the new one isn't live yet.
			email: session.user.email,
			marketing: savedProfile?.marketing ?? data.marketing
		}
	};
});
