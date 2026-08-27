<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		<Card.Root class="mx-auto w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Register</Card.Title>
				<Card.Description>Enter your information below to create your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<form method="post" action="?/signUpEmail" use:enhance>
					<FieldGroup>
						<Field>
							<FieldLabel for="email">Email</FieldLabel>
							<Input id="email" name="email" type="email" placeholder="m@example.com" required />
						</Field>
						<Field>
							<div class="flex items-center">
								<FieldLabel for="password">Password</FieldLabel>
							</div>
							<Input id="password" name="password" type="password" required />
						</Field>
						<Field>
							<div class="flex items-center">
								<FieldLabel for="name">Username</FieldLabel>
							</div>
							<Input id="name" name="name" type="text" required />
						</Field>
						<Field>
							<Button type="submit" class="w-full">Register</Button>
						</Field>
					</FieldGroup>
				</form>
				<p class="text-red-500">{form?.message ?? ''}</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
