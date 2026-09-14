<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { createProfile } from '../data.remote';

	type ProfileForm = {
		fields: typeof createProfile.fields;
	};

	type FormIssue = {
		message: string;
	};

	interface Props {
		form: ProfileForm;
		profile: {
			company: string;
			jobTitle: string;
			website: string;
		};
		issues: {
			companyIssues: FormIssue[];
			jobTitleIssues: FormIssue[];
			websiteIssues: FormIssue[];
		};
	}

	let { form, profile, issues }: Props = $props();

	const companyIssues = $derived(issues.companyIssues);
	const jobTitleIssues = $derived(issues.jobTitleIssues);
	const websiteIssues = $derived(issues.websiteIssues);
</script>

<Field.Set class="space-y-4">
	<Field.Legend class="mb-6 text-lg font-semibold tracking-tight"
		>Professional Information</Field.Legend
	>

	<Field.Field>
		<Field.Label for="company" class={companyIssues.length ? 'text-destructive' : ''}
			>Company</Field.Label
		>
		<Input
			id="company"
			{...form.fields.company.as('text', profile.company)}
			placeholder="Acme Inc."
		/>
		{#each companyIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="jobTitle" class={jobTitleIssues.length ? 'text-destructive' : ''}
			>Job Title</Field.Label
		>
		<Input
			id="jobTitle"
			{...form.fields.jobTitle.as('text', profile.jobTitle)}
			placeholder="Software Engineer"
		/>
		{#each jobTitleIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="website" class={websiteIssues.length ? 'text-destructive' : ''}
			>Website</Field.Label
		>
		<Input
			id="website"
			{...form.fields.website.as('url', profile.website)}
			placeholder="https://example.com"
		/>
		{#each websiteIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>
</Field.Set>
