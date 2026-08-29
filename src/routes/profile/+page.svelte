<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { toast } from "svelte-sonner";
	import { createProfile } from './data.remote';

	let { data } = $props();

	// Local, mount-scoped UI state. Unlike `createProfile.result`, this is
	// guaranteed to start fresh every time this component mounts (i.e. every
	// navigation to /profile), so it can never leak a previous user's banner.
	let statusBanner = $state('');

	// `data.profile` is the only reliably fresh, per-user source of truth —
	// it comes straight from `+page.server.ts`'s load function, which re-runs
	// on every navigation and is keyed off `locals.user.id`.
	const profile = $derived({
		username: data.profile?.username ?? '',
		email: data.profile?.email ?? '',
		marketing: Boolean(data.profile?.marketing)
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

	const usernameIssues = $derived(createProfile.fields.username.issues() ?? []);
	const emailIssues = $derived(createProfile.fields.email.issues() ?? []);
	const marketingIssues = $derived(createProfile.fields.marketing.issues() ?? []);
	const hasAnyIssues = $derived(
		usernameIssues.length > 0 || emailIssues.length > 0 || marketingIssues.length > 0
	);
</script>

<form
	{...createProfile.enhance(async ({ submit }) => {
		const result = await submit();
		if (result) {
			toast(createProfile.result?.message ?? 'Profile updated successfully.');
		}
	})}
	class="max-w-md space-y-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
>
	<Field.Set class="space-y-6">
		<Field.Legend class="text-lg font-semibold tracking-tight">Account Sync Settings</Field.Legend>

		<Field.Field>
			<Field.Content>
				<Field.Label for="username" class={usernameIssues.length ? 'text-destructive' : ''}
					>Username</Field.Label
				>
				<Field.Description
					>This is your public display identity across the interface.</Field.Description
				>
			</Field.Content>
			<Input
				id="username"
				{...createProfile.fields.username.as('text', profile.username)}
				placeholder="shadcn_coder"
			/>
			{#if usernameIssues.length}
				{#each usernameIssues as issue (issue.message)}
					<Field.Error>{issue.message}</Field.Error>
				{/each}
			{/if}
		</Field.Field>

		<Field.Field>
			<Field.Label for="email" class={emailIssues.length ? 'text-destructive' : ''}
				>Email Address</Field.Label
			>
			<Input
				id="email"
				{...createProfile.fields.email.as('email', profile.email)}
				placeholder="hello@example.com"
			/>
			<Field.Description>We will never share your private email updates.</Field.Description>
			{#if emailIssues.length}
				{#each emailIssues as issue (issue.message)}
					<Field.Error>{issue.message}</Field.Error>
				{/each}
			{/if}
		</Field.Field>

		<Field.Group
			class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm"
		>
			<input
				id="marketing"
				class="mt-1 h-4 w-4 rounded border-input text-primary shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				{...createProfile.fields.marketing.as('checkbox', profile.marketing)}
			/>
			<div class="space-y-1 leading-none">
				<Field.Label for="marketing">Marketing Emails</Field.Label>
				<Field.Description>
					Receive transactional notification briefs and service metrics.
				</Field.Description>
			</div>
		</Field.Group>
	</Field.Set>

	{#if statusBanner}
		<div
			class="rounded-md p-3 text-sm {hasAnyIssues
				? 'bg-destructive/15 text-destructive'
				: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'} font-medium"
		>
			{statusBanner}
		</div>
	{/if}

	<Button type="submit" class="w-full">Submit via Remote Field Function</Button>
</form>
