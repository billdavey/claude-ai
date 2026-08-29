<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarProvider
	} from '$lib/components/ui/sidebar';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/profile', label: 'Profile' },
		{ href: '/better-auth', label: 'Auth' },
		{ href: '/playwright', label: 'Playwright' }
	];

	const isAuthPage = $derived(
		page.url.pathname.startsWith('/better-auth/login') ||
			page.url.pathname.startsWith('/better-auth/register')
	);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Toaster />

{#if isAuthPage}
	{@render children()}
{:else}
	<SidebarProvider>
		<div class="flex min-h-screen">
			<Sidebar side="left">
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu>
							{#each links as link (link.href)}
								<SidebarMenuItem>
									<a href={resolve(link.href as any)} style="display: contents;">
										<SidebarMenuButton isActive={page.url.pathname === link.href}>
											{link.label}
										</SidebarMenuButton>
									</a>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<main class="min-w-full p-6">
				{@render children()}
			</main>
		</div>
	</SidebarProvider>
{/if}
