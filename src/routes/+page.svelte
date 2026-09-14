<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data }: { data: PageServerData } = $props();
</script>

<Card.Root class="mx-auto max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Hi, {data.user.name}!</Card.Title>
		<Card.Description>Your user ID is {data.user.id}.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" action="?/signOut" use:enhance>
			<Button type="submit" class="w-full">Sign out</Button>
		</form>
	</Card.Content>
</Card.Root>
