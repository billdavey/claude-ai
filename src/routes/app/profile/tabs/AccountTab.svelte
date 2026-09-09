<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';

	interface FormField {
		as: (type: 'text' | 'email' | 'checkbox', value: string | boolean) => Record<string, unknown>;
	}

	interface Issue {
		message: string;
	}

	interface AccountForm {
		fields: {
			name: FormField;
			username: FormField;
			email: FormField;
			marketing: FormField;
		};
	}

	interface Props {
		form: AccountForm;
		profile: {
			name: string;
			username: string;
			email: string;
			marketing: boolean;
		};
		identity: {
			image: string | null;
		};
		issues: {
			nameIssues: Issue[];
			usernameIssues: Issue[];
			emailIssues: Issue[];
		};
	}

	let { form, profile, identity, issues }: Props = $props();

	const nameIssues = $derived(issues.nameIssues);
	const usernameIssues = $derived(issues.usernameIssues);
	const emailIssues = $derived(issues.emailIssues);
</script>

<Field.Set class="space-y-4">
	<Field.Legend class="mb-6 text-lg font-semibold tracking-tight">Account Information</Field.Legend>

	<Field.Field>
		<Field.Label for="name" class={nameIssues.length ? 'text-destructive' : ''}>Name</Field.Label>
		<div class="flex items-center gap-3">
			{#if identity.image}
				<img src={identity.image} alt="" class="h-10 w-10 rounded-full object-cover" />
			{/if}
			<Input
				id="name"
				{...form.fields.name.as('text', profile.name)}
				placeholder="Jane Doe"
				class="flex-1"
			/>
		</div>
		<Field.Description>Your display name shown across the interface.</Field.Description>
		{#if nameIssues.length}
			{#each nameIssues as issue (issue.message)}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		{/if}
	</Field.Field>

	<Field.Field>
		<Field.Label for="username" class={usernameIssues.length ? 'text-destructive' : ''}
			>Username</Field.Label
		>
		<Input
			id="username"
			{...form.fields.username.as('text', profile.username)}
			placeholder="shadcn_coder"
		/>
		<Field.Description>This is your public display identity across the interface.</Field.Description
		>
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
			{...form.fields.email.as('email', profile.email)}
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
		<Checkbox
			class="self-center"
			id="finder-pref-9k2-hard-disks-ljj"
			{...form.fields.marketing.as('checkbox', profile.marketing)}
		/>
		<div class="space-y-1 leading-none">
			<Field.Label for="marketing">Marketing Emails</Field.Label>
			<Field.Description>
				Receive transactional notification briefs and service metrics.
			</Field.Description>
		</div>
	</Field.Group>
</Field.Set>
