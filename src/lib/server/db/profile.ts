/**
 * Profile module - now backed by Better Auth additionalFields on the user table
 *
 * Profile data is now stored directly on the user table via Better Auth's
 * additionalFields configuration. This module provides a simplified interface
 * for working with user profile data.
 *
 * Migration note: The old separate `profile` table has been removed.
 * All profile fields are now part of the user record.
 */

/**
 * Profile type - represents the profile fields of a user
 * These are the 14 fields migrated from the old profile table
 */
export type ProfileFields = {
	marketing: boolean;
	bio: string;
	phoneNumber: string;
	secondaryEmail: string;
	dateOfBirth: number | null;
	location: string;
	company: string;
	jobTitle: string;
	website: string;
	locale: string;
	timezone: string;
	theme: string;
	emailNotifications: boolean;
	pushNotifications: boolean;
};

/**
 * Type representing all updatable profile fields
 */
export type ProfileUpdate = Partial<ProfileFields>;

/**
 * Get default profile fields for a new user
 *
 * Returns an object with default values for all profile fields.
 * Used during user signup to initialize profile data.
 *
 * @returns Object with default profile field values
 *
 * @example
 * const defaults = getDefaultProfileFields();
 * // { marketing: false, bio: '', phoneNumber: '', ... }
 */
export function getDefaultProfileFields(): ProfileFields {
	return {
		marketing: false,
		bio: '',
		phoneNumber: '',
		secondaryEmail: '',
		dateOfBirth: null,
		location: '',
		company: '',
		jobTitle: '',
		website: '',
		locale: '',
		timezone: '',
		theme: '',
		emailNotifications: true,
		pushNotifications: false
	};
}

/**
 * Check if a user has profile fields set
 *
 * Useful for determining if a profile needs to be populated with
 * additional data beyond the defaults.
 *
 * @param user - The user object
 * @returns true if any profile fields are set beyond defaults
 */
export function hasProfileData(user: any): boolean {
	if (!user) return false;
	return !!(
		user.bio ||
		user.phoneNumber ||
		user.secondaryEmail ||
		user.dateOfBirth ||
		user.location ||
		user.company ||
		user.jobTitle ||
		user.website ||
		user.locale ||
		user.timezone ||
		(user.theme && user.theme !== '')
	);
}

/**
 * Extract profile fields from a user object
 *
 * Returns only the profile-related fields from a full user object.
 * Useful for passing profile data to the UI.
 *
 * @param user - The user object
 * @returns Object containing only the profile fields
 *
 * @example
 * const user = locals.user; // from Better Auth
 * const profileData = extractProfileFields(user);
 */
export function extractProfileFields(user: any): Partial<ProfileFields> {
	if (!user) return {};

	return {
		marketing: user.marketing ?? false,
		bio: user.bio ?? '',
		phoneNumber: user.phoneNumber ?? '',
		secondaryEmail: user.secondaryEmail ?? '',
		dateOfBirth: user.dateOfBirth ?? null,
		location: user.location ?? '',
		company: user.company ?? '',
		jobTitle: user.jobTitle ?? '',
		website: user.website ?? '',
		locale: user.locale ?? '',
		timezone: user.timezone ?? '',
		theme: user.theme ?? '',
		emailNotifications: user.emailNotifications ?? true,
		pushNotifications: user.pushNotifications ?? false
	};
}
