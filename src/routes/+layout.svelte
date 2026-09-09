<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	const isAuthPage = $derived(page.url.pathname.startsWith('/auth/'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Toaster />
<ModeWatcher />

{#if isAuthPage}
	{@render children()}
{:else}
	{@render children()}
{/if}
