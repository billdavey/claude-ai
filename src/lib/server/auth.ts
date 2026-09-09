import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { username } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { sendEmail } from '$lib/server/email';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the link to verify your email: ${url}`
			});
		}
	},
	user: {
		changeEmail: {
			enabled: true
		},
		additionalFields: {
			marketing: { type: 'boolean', input: true, defaultValue: false },
			bio: { type: 'string', input: true, defaultValue: '' },
			phoneNumber: { type: 'string', input: true, defaultValue: '' },
			secondaryEmail: { type: 'string', input: true, defaultValue: '' },
			dateOfBirth: { type: 'number', input: true, defaultValue: 0 },
			location: { type: 'string', input: true, defaultValue: '' },
			company: { type: 'string', input: true, defaultValue: '' },
			jobTitle: { type: 'string', input: true, defaultValue: '' },
			website: { type: 'string', input: true, defaultValue: '' },
			locale: { type: 'string', input: true, defaultValue: '' },
			timezone: { type: 'string', input: true, defaultValue: '' },
			theme: { type: 'string', input: true, defaultValue: '' },
			emailNotifications: { type: 'boolean', input: true, defaultValue: true },
			pushNotifications: { type: 'boolean', input: true, defaultValue: false }
		}
	},
	plugins: [
		username(),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
