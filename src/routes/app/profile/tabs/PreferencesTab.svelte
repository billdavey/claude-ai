<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';

	type FormField = {
		as: (type: string, value: unknown) => Record<string, unknown>;
	};

	type PreferencesForm = {
		fields: Record<
			'locale' | 'timezone' | 'theme' | 'emailNotifications' | 'pushNotifications',
			FormField
		>;
	};

	type Issue = { message: string };

	interface Props {
		form: PreferencesForm;
		profile: {
			locale: string;
			timezone: string;
			theme: '' | 'system' | 'light' | 'dark';
			emailNotifications: boolean;
			pushNotifications: boolean;
		};
		issues: {
			localeIssues: Issue[];
			timezoneIssues: Issue[];
			themeIssues: Issue[];
		};
	}

	const locales = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Spanish' },
		{ value: 'de', label: 'German' }
	];

	const canonicalUSTimeZones = [
		'America/New_York', // Eastern Time
		'America/Chicago', // Central Time
		'America/Denver', // Mountain Time
		'America/Los_Angeles', // Pacific Time
		'America/Anchorage', // Alaska Time
		'America/Honolulu' // Hawaii Time
	];

	const themes = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];

	let { form, profile, issues }: Props = $props();

	let selectedLocale = $derived(profile.locale || '');
	const triggerContent = $derived(
		locales.find((l) => l.value === selectedLocale)?.label ?? 'Select a language'
	);

	let selectedTimezone = $derived(profile.timezone || '');
	const timezoneTriggerContent = $derived(
		selectedTimezone ? selectedTimezone : 'Select a timezone'
	);
	const uniqueUSZones = Intl.supportedValuesOf('timeZone').filter((tz) =>
		canonicalUSTimeZones.includes(tz)
	);

	let selectedTheme = $derived(profile.theme || '');
	const themeTriggerContent = $derived(
		selectedTheme
			? (themes.find((t) => t.value === selectedTheme)?.label ?? 'Select a theme')
			: 'Select a theme'
	);

	const localeIssues = $derived(issues.localeIssues);
	const timezoneIssues = $derived(issues.timezoneIssues);
	const themeIssues = $derived(issues.themeIssues);
</script>

<Field.Set class="space-y-4">
	<Field.Legend class="mb-6 text-lg font-semibold tracking-tight">Preferences</Field.Legend>

	<Field.Field>
		<Field.Label for="locale" class={localeIssues.length ? 'text-destructive' : ''}
			>Language</Field.Label
		>
		<Input id="locale" {...form.fields.locale.as('hidden', selectedLocale ?? 'en')} />
		<Select.Root type="single" name="localeSelector" bind:value={selectedLocale}>
			<Select.Trigger class="w-45">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Languages</Select.Label>
					{#each locales as locale (locale.value)}
						<Select.Item value={locale.value} label={locale.label}>
							{locale.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		{#each localeIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="timezone" class={timezoneIssues.length ? 'text-destructive' : ''}
			>Timezone</Field.Label
		>
		<Input
			id="timezone"
			{...form.fields.timezone.as('hidden', selectedTimezone ?? 'America/New_York')}
			placeholder="America/New_York"
		/>
		<Select.Root type="single" name="timezoneSelector" bind:value={selectedTimezone}>
			<Select.Trigger class="w-45">
				{timezoneTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Timezones</Select.Label>
					{#each uniqueUSZones as timezone (timezone)}
						<Select.Item value={timezone} label={timezone}>
							{timezone}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		{#each timezoneIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Field>
		<Field.Label for="theme" class={themeIssues.length ? 'text-destructive' : ''}>Theme</Field.Label
		>
		<Input
			id="theme"
			{...form.fields.theme.as('hidden', selectedTheme ?? '')}
			placeholder="system"
		/>
		<Select.Root type="single" name="themeSelector" bind:value={selectedTheme}>
			<Select.Trigger class="w-45">
				{themeTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Themes</Select.Label>
					{#each themes as theme (theme)}
						<Select.Item value={theme.value} label={theme.label}>
							{theme.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		{#each themeIssues as issue (issue.message)}
			<Field.Error>{issue.message}</Field.Error>
		{/each}
	</Field.Field>

	<Field.Group
		class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm"
	>
		<Checkbox
			class="self-center"
			id="emailNotifications"
			{...form.fields.emailNotifications.as('checkbox', profile.emailNotifications)}
		/>
		<div class="space-y-1 leading-none">
			<Field.Label for="emailNotifications">Email Notifications</Field.Label>
			<Field.Description>Receive email notifications about account activity.</Field.Description>
		</div>
	</Field.Group>

	<Field.Group
		class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm"
	>
		<Checkbox
			class="self-center"
			id="pushNotifications"
			{...form.fields.pushNotifications.as('checkbox', profile.pushNotifications)}
		/>
		<div class="space-y-1 leading-none">
			<Field.Label for="pushNotifications">Push Notifications</Field.Label>
			<Field.Description>Receive push notifications about account activity.</Field.Description>
		</div>
	</Field.Group>
</Field.Set>
