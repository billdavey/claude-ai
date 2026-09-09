<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		<Card.Root class="mx-auto w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">You're all set!</Card.Title>
				<Card.Description>Your email address has been verified.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href={resolve('/')} class="w-full">Continue</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
