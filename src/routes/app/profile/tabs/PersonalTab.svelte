<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	type FormField = {
		as: (type: string, value: unknown) => Record<string, unknown>;
	};

	type PersonalForm = {
		fields: Record<
			'bio' | 'phoneNumber' | 'secondaryEmail' | 'dateOfBirth' | 'location',
			FormField
		>;
	};

	type Issue = { message: string };

	interface Props {
		form: PersonalForm;
		profile: {
			bio: string;
			phoneNumber: string;
			secondaryEmail: string;
			dateOfBirth: string;
			location: string;
		};
		issues: {
			bioIssues: Issue[];
			phoneNumberIssues: Issue[];
			secondaryEmailIssues: Issue[];
			dateOfBirthIssues: Issue[];
			locationIssues: Issue[];
		};
	}

	let { form, profile, issues }: Props = $props();

	const bioIssues = $derived(issues.bioIssues);
	const phoneNumberIssues = $derived(issues.phoneNumberIssues);
	const secondaryEmailIssues = $derived(issues.secondaryEmailIssues);
	const dateOfBirthIssues = $derived(issues.dateOfBirthIssues);
	const locationIssues = $derived(issues.locationIssues);

	function handlePhoneInput(event: Event) {
		const input = event.target as HTMLInputElement;

		// 1. Strip everything except raw digits
		let digits = input.value.replace(/\D/g, '');

		// 2. Fix Double-Country-Code Pastes:
		// If a user pastes "+1 (555) 555-5555", digits becomes "115555555555" (eleven digits).
		// We safely strip the extra leading '1' if the length exceeds 10 digits.
		if (digits.length > 10 && digits.startsWith('11')) {
			digits = digits.substring(1);
		}

		// 3. Ensure a single country code '1' is present
		if (!digits.startsWith('1')) {
			digits = '1' + digits;
		}

		// 4. Apply the structural layout format
		let formatted = '+1';
		if (digits.length > 1) formatted += ' ' + digits.substring(1, 4);
		if (digits.length > 4) formatted += ' ' + digits.substring(4, 7);
		if (digits.length > 7) formatted += ' ' + digits.substring(7, 11);

		// Keep the displayed value and profile state in sync so Zod receives the formatted string.
		input.value = formatted;
		profile.phoneNumber = formatted;
	}
</script>

<Field.Set class="space-y-4">
	<Field.Legend class="mb-6 text-lg font-semibold tracking-tight">Personal Information</Field.Legend
	>

	<Field.Field>
		<Field.Label for="bio" class={bioIssues.length ? 'text-destructive' : ''}>Bio</Field.Label>
		<Textarea
			id="bio"
			{...form.fields.bio.as('text', profile.bio)}
			placeholder="A little about yourself"
			rows={4}
			autocomplete="on"
		></Textarea>
		{#each bioIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="phoneNumber" class={phoneNumberIssues.length ? 'text-destructive' : ''}
			>Phone Number</Field.Label
		>
		<Input
			id="phoneNumber"
			{...form.fields.phoneNumber.as('tel', profile.phoneNumber)}
			oninput={handlePhoneInput}
			placeholder="+1 555 555 5555"
			maxlength={15}
		/>
		{#each phoneNumberIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="secondaryEmail" class={secondaryEmailIssues.length ? 'text-destructive' : ''}
			>Secondary Email</Field.Label
		>
		<Input
			id="secondaryEmail"
			{...form.fields.secondaryEmail.as('email', profile.secondaryEmail)}
			placeholder="backup@example.com"
		/>
		{#each secondaryEmailIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="dateOfBirth" class={dateOfBirthIssues.length ? 'text-destructive' : ''}
			>Date of Birth</Field.Label
		>
		<Input id="dateOfBirth" {...form.fields.dateOfBirth.as('date', profile.dateOfBirth)} />
		{#each dateOfBirthIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="location" class={locationIssues.length ? 'text-destructive' : ''}
			>Location</Field.Label
		>
		<Input
			id="location"
			{...form.fields.location.as('text', profile.location)}
			placeholder="City, Country"
		/>
		{#each locationIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>
</Field.Set>
