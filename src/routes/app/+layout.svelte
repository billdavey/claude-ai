<script lang="ts">
	import { SidebarInset, SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import ToggleMode from '$lib/components/ToggleMode.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	let { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<header class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
			<SidebarTrigger class="-ms-1" />
			<ToggleMode />
		</header>
		<main class="flex flex-1 flex-col gap-4 p-4">
			{@render children()}
		</main>
	</SidebarInset>
</SidebarProvider>
