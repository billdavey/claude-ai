<!-- FormSuccessToast.svelte -->
<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { CircleCheck, RotateCcw, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	// Svelte 5 Runes for properties
	let {
		id = undefined, // sonner automatically forwards the unique toast ID if passed
		formName = 'Form',
		message = 'Your changes have been saved successfully.',
		updatedAt = 'Just now',
		onUndo = () => {} // Optional callback for undo action; if provided, an "Undo" button will be displayed
	} = $props();
</script>

<div
	class="flex w-max max-w-[85vw] items-center gap-4 rounded-xl border border-emerald-500/20 bg-popover p-4 text-popover-foreground shadow-lg dark:border-emerald-500/30"
>
	<!-- Success Visual Anchor Icon -->
	<div class="mt-0.5 rounded-full bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
		<CircleCheck class="size-4" />
	</div>

	<!-- Content Block -->
	<div class="flex-1 space-y-1">
		<p class="text-sm leading-none font-medium">{message}</p>
		<p class="text-xs text-muted-foreground">
			Your updates to <span class="font-medium text-foreground">{formName}</span> were compiled {updatedAt}.
		</p>
	</div>

	<!-- Action (Optional Undo Pattern) -->
	{#if onUndo}
		<div class="shrink-0 border-l border-border pl-2">
			<Button
				variant="ghost"
				size="sm"
				class="h-8 gap-1.5 px-2.5 text-xs font-normal text-muted-foreground hover:text-foreground"
				onclick={() => {
					onUndo(); // Call the provided undo callback function where the undo logic can be implemented
					toast.dismiss(id); // Dismiss the toast after undo action; just testing close functionality here
				}}
			>
				<!-- <RotateCcw class="size-3.5" /> -->
				<!-- Undo -->
				<X class="size-3.5" />
			</Button>
		</div>
	{/if}
</div>
