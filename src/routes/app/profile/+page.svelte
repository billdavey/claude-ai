<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { toast } from 'svelte-sonner';
	import { createProfile } from './data.remote';
	import AccountTab from './tabs/AccountTab.svelte';
	import PersonalTab from './tabs/PersonalTab.svelte';
	import ProfessionalTab from './tabs/ProfessionalTab.svelte';
	import PreferencesTab from './tabs/PreferencesTab.svelte';
	import FormSuccessToast from './FormSuccessToast.svelte';
	import { toDateInputValue } from '$lib/utils/index';

	let { data } = $props();

	// Local, mount-scoped UI state. Unlike `createProfile.result`, this is
	// guaranteed to start fresh every time this component mounts (i.e. every
	// navigation to /profile), so it can never leak a previous user's banner.
	let statusBanner = $state('');

	// `data.profile` is the only reliably fresh, per-user source of truth —
	// it comes straight from `+page.server.ts`'s load function, which re-runs
	// on every navigation and is keyed off `locals.user.id`.
	const profile = $derived({
		name: data.profile?.name ?? '',
		username: data.profile?.username ?? '',
		email: data.profile?.email ?? '',
		marketing: Boolean(data.profile?.marketing),
		bio: data.profile?.bio ?? '',
		phoneNumber: data.profile?.phoneNumber ?? '',
		secondaryEmail: data.profile?.secondaryEmail ?? '',
		dateOfBirth: toDateInputValue(data.profile?.dateOfBirth),
		location: data.profile?.location ?? '',
		company: data.profile?.company ?? '',
		jobTitle: data.profile?.jobTitle ?? '',
		website: data.profile?.website ?? '',
		locale: data.profile?.locale ?? '',
		timezone: data.profile?.timezone ?? '',
		theme: (data.profile?.theme ?? '') as '' | 'system' | 'light' | 'dark',
		emailNotifications: Boolean(data.profile?.emailNotifications),
		pushNotifications: Boolean(data.profile?.pushNotifications)
	});

	// Avatar image, sourced directly from the `user` table (better-auth).
	const identity = $derived({
		image: data.profile?.image ?? null
	});

	// `createProfile` is a module-level singleton (per SvelteKit's remote
	// functions implementation) that lives for the whole SPA session — it is
	// NOT reset on navigation, logout, or a new login. Without this, a
	// previous user's typed-but-unsaved field values would still be shown
	// here (live input always wins over the default passed to `.as(...)`).
	// Force-resync the form's internal fields to the authoritative server
	// data every time it changes (on mount, and again after a successful
	// submit triggers a reload).
	$effect(() => {
		createProfile.fields.set(profile);
	});

	// Derive all field validation issues
	const nameIssues = $derived(createProfile.fields.name.issues() ?? []);
	const usernameIssues = $derived(createProfile.fields.username.issues() ?? []);
	const emailIssues = $derived(createProfile.fields.email.issues() ?? []);
	const bioIssues = $derived(createProfile.fields.bio.issues() ?? []);
	const phoneNumberIssues = $derived(createProfile.fields.phoneNumber.issues() ?? []);
	const secondaryEmailIssues = $derived(createProfile.fields.secondaryEmail.issues() ?? []);
	const dateOfBirthIssues = $derived(createProfile.fields.dateOfBirth.issues() ?? []);
	const locationIssues = $derived(createProfile.fields.location.issues() ?? []);
	const companyIssues = $derived(createProfile.fields.company.issues() ?? []);
	const jobTitleIssues = $derived(createProfile.fields.jobTitle.issues() ?? []);
	const websiteIssues = $derived(createProfile.fields.website.issues() ?? []);
	const localeIssues = $derived(createProfile.fields.locale.issues() ?? []);
	const timezoneIssues = $derived(createProfile.fields.timezone.issues() ?? []);
	const themeIssues = $derived(createProfile.fields.theme.issues() ?? []);
	const hasAnyIssues = $derived((createProfile.fields.allIssues()?.length ?? 0) > 0);

	// Compute error states per tab
	const accountTabHasErrors = $derived(
		nameIssues.length > 0 || usernameIssues.length > 0 || emailIssues.length > 0
	);

	const personalTabHasErrors = $derived(
		bioIssues.length > 0 ||
			phoneNumberIssues.length > 0 ||
			secondaryEmailIssues.length > 0 ||
			dateOfBirthIssues.length > 0 ||
			locationIssues.length > 0
	);

	const professionalTabHasErrors = $derived(
		companyIssues.length > 0 || jobTitleIssues.length > 0 || websiteIssues.length > 0
	);

	const preferencesTabHasErrors = $derived(
		localeIssues.length > 0 || timezoneIssues.length > 0 || themeIssues.length > 0
	);
</script>

<h1 class="text-2xl font-bold tracking-tight">Profile</h1>

<form
	{...createProfile.enhance(async ({ submit }) => {
		const result = await submit();
		if (result) {
			toast.custom(FormSuccessToast, {
				duration: 5000,
				dismissible: true, // Allows users to swipe the toast away to close it
				componentProps: {
					formName: 'Profile',
					message: createProfile.result?.message ?? 'Profile updated successfully.',
					updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
				}
				// onDismiss: (t) => console.log(`Toast with id ${t.id} has been dismissed`),
				// onAutoClose: (t) => console.log(`Toast with id ${t.id} has been closed automatically`)
			});
		}
	})}
	class="flex w-2xl flex-col gap-6"
>
	<Tabs value="account" orientation="vertical" class="flex gap-4">
		<!-- Sidebar Tab List (Vertical) -->
		<TabsList class="h-auto w-40 flex-col justify-start gap-1">
			<TabsTrigger
				value="account"
				class="w-full justify-between px-4 py-2 data-[state=active]:bg-secondary {accountTabHasErrors
					? 'text-destructive'
					: ''}"
			>
				<span>Account</span>
				{#if accountTabHasErrors}
					<span
						class="text-destructive-foreground ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold"
					>
						!
					</span>
				{/if}
			</TabsTrigger>

			<TabsTrigger
				value="personal"
				class="w-full justify-between px-4 py-2 data-[state=active]:bg-secondary {personalTabHasErrors
					? 'text-destructive'
					: ''}"
			>
				<span>Personal</span>
				{#if personalTabHasErrors}
					<span
						class="text-destructive-foreground ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold"
					>
						!
					</span>
				{/if}
			</TabsTrigger>

			<TabsTrigger
				value="professional"
				class="w-full justify-between px-4 py-2 data-[state=active]:bg-secondary {professionalTabHasErrors
					? 'text-destructive'
					: ''}"
			>
				<span>Professional</span>
				{#if professionalTabHasErrors}
					<span
						class="text-destructive-foreground ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold"
					>
						!
					</span>
				{/if}
			</TabsTrigger>

			<TabsTrigger
				value="preferences"
				class="w-full justify-between px-4 py-2 data-[state=active]:bg-secondary {preferencesTabHasErrors
					? 'text-destructive'
					: ''}"
			>
				<span>Preferences</span>
				{#if preferencesTabHasErrors}
					<span
						class="text-destructive-foreground ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold"
					>
						!
					</span>
				{/if}
			</TabsTrigger>
		</TabsList>

		<!-- Tab Contents -->
		<div class="flex-1">
			<TabsContent
				value="account"
				class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
			>
				<AccountTab
					form={createProfile}
					{profile}
					{identity}
					issues={{
						nameIssues,
						usernameIssues,
						emailIssues
					}}
				/>
			</TabsContent>

			<TabsContent
				value="personal"
				class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
			>
				<PersonalTab
					form={createProfile}
					{profile}
					issues={{
						bioIssues,
						phoneNumberIssues,
						secondaryEmailIssues,
						dateOfBirthIssues,
						locationIssues
					}}
				/>
			</TabsContent>

			<TabsContent
				value="professional"
				class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
			>
				<ProfessionalTab
					form={createProfile}
					{profile}
					issues={{
						companyIssues,
						jobTitleIssues,
						websiteIssues
					}}
				/>
			</TabsContent>

			<TabsContent
				value="preferences"
				class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
			>
				<PreferencesTab
					form={createProfile}
					{profile}
					issues={{
						localeIssues,
						timezoneIssues,
						themeIssues
					}}
				/>
			</TabsContent>
		</div>
	</Tabs>

	{#if statusBanner}
		<div
			class="rounded-md p-3 text-sm {hasAnyIssues
				? 'bg-destructive/15 text-destructive'
				: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'} font-medium"
		>
			{statusBanner}
		</div>
	{/if}

	<Button type="submit" class="w-xs self-end">Submit via Remote Field Function</Button>
</form>
