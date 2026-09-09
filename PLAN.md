Profile Form Enhancement Plan
Goal
Fix the /profile form so username and email are single-sourced from the user table (via better-auth) instead of duplicated in the profile table, and scaffold additional recommended profile fields (schema + inert UI only, no persistence yet).
Key Decisions

- Username: Add via better-auth's official username() plugin (not a manual additionalField) — gives normalization, uniqueness validation, isUsernameAvailable, sign-in-by-username for free.
- Email: Build the full change-email verification flow using auth.api.changeEmail — verification link sent to the new email only (no "confirm via current email" extra step). Email sending is a console-log stub (sendEmail()) for now, swappable later for a real provider.
- emailVerification.sendOnSignUp: true: Enabling this makes the pre-existing (currently broken/dangling) registration verification flow actually work, since register/+page.server.ts already references a callback URL for it.
- profile.username / profile.email columns: Dropped entirely. These are read from locals.user (populated by hooks.server.ts via auth.api.getSession), not stored redundantly in profile.
- Existing local.db data: Reset (dev sqlite db) — no migration/backfill script needed.
- /auth/verification-success: Currently referenced by the register flow but doesn't exist. Create it as part of this task; reuse it as the callback for both sign-up verification and profile email-change verification.
- New profile fields: Add schema columns + inert form inputs for a set of common profile fields (see below), but do not wire any save/validation logic for them yet — they're not included in the remote form action's zod schema or submit handler this round.
- Excluded from this task: Security-tab items (password change, 2FA, connected accounts, session management) and account-management actions (delete account, export data) — these are workflows/actions, not data fields, and are out of scope.
  File-by-File Changes

1. src/lib/server/email.ts (new)

- Export sendEmail({ to, subject, text }) — logs to console. Single seam to swap in a real provider (Resend/SMTP/etc.) later.

2. src/lib/server/auth.ts

- Import username from better-auth/plugins.
- Add:
  emailVerification: {
  sendOnSignUp: true,
  sendVerificationEmail: async ({ user, url }) => {
  sendEmail({ to: user.email, subject: 'Verify your email address', text: `Click the link to verify your email: ${url}` });
  }
  },
  user: {
  changeEmail: { enabled: true }
  }
- Add username() to the plugins array — must come before sveltekitCookies(getRequestEvent), which must remain last.

3. Regenerate auth schema

- Run npm run auth:schema → regenerates src/lib/server/db/auth.schema.ts, adding username (unique, nullable) and displayUsername (nullable) columns to the user table.

4. src/lib/server/db/schema.ts

- Remove username and email columns from profile.
- Add 12 new nullable columns to profile:
  Column Type
  bio text, nullable
  phoneNumber text, nullable
  secondaryEmail text, nullable
  dateOfBirth integer (timestamp_ms), nullable
  location text, nullable
  company text, nullable
  jobTitle text, nullable
  website text, nullable
  locale text, nullable
  timezone text, nullable
  theme text, nullable
  emailNotifications boolean, default true
  pushNotifications boolean, default false
- Resulting profile table: id, userId, marketing, the 12 columns above, createdAt, updatedAt.

5. npm run db:push

- Apply new schema to local.db (reset db first per decision above).

6. src/app.d.ts

- Switch Locals.user/Locals.session from generic better-auth User/Session types to typeof auth.$Infer.Session['user' | 'session'], so locals.user.username/.displayUsername are properly typed.

7. src/lib/server/db/profile.ts

- No structural changes — types auto-derive from schema.

8. src/routes/profile/+page.server.ts

- Read username, email, name, image from locals.user.
- Read marketing + the 12 new fields from getProfileByUserId (default null/empty where absent).

9. src/routes/profile/data.remote.ts

- No changes to zod schema or submit handler shape (username/email/marketing), except the actual persistence logic changes to:
- Fetch session via auth.api.getSession.
- If username changed: call auth.api.updateUser({ body: { username }, headers }). Catch APIErrors (USERNAME_IS_ALREADY_TAKEN, USERNAME_TOO_SHORT, etc.) → map to field-level issues.
- If email changed: call auth.api.changeEmail({ body: { newEmail: email, callbackURL: '/auth/verification-success' }, headers }). Does not update user.email immediately — only after the link is clicked. Response message must say "check your new email inbox to confirm the change."
- Upsert profile row with just marketing (new 12 fields excluded from this handler for now).

10. src/routes/profile/+page.svelte

- Existing username/email/marketing fields stay wired to the remote form as before.
- Add read-only display block for name / image (no inputs, no submit wiring).
- Add plain inputs for the 12 new fields (grouped: Bio/Contact/Personal/Preferences), bound only via local $state/bind:value — not connected to createProfile.fields.* or the remote form action. Nothing submits or persists them yet.

11. src/routes/auth/verification-success/+page.svelte (new)

- Minimal static confirmation page ("You're all set — your email has been verified."). Better-auth verifies the token server-side before redirecting here, so no page logic needed.
  Open Risk to Verify During Implementation
  Need to confirm exact preconditions/behavior of auth.api.changeEmail (e.g., whether it behaves differently based on current emailVerified state) against the installed better-auth package version, and adjust remote-function error handling accordingly.
