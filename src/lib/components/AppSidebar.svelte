<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem
	} from '$lib/components/ui/sidebar';
	import { GlobeCheck, LayoutDashboard, Squirrel, User } from '@lucide/svelte';

	const links = [
		{ href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/app/playwright', label: 'Playwright', icon: GlobeCheck },
		{ href: '/app/profile', label: 'Profile', icon: User }
	] as const;
</script>

<Sidebar collapsible="icon" side="left">
	<SidebarHeader class="flex flex-row">
		<Squirrel class="h-6 w-6" />
		<a href={resolve('/')} class="text-lg font-semibold group-data-[collapsible=icon]:hidden"
			>Acme, Inc.</a
		>
	</SidebarHeader>
	<SidebarContent>
		<SidebarGroup>
			<SidebarMenu>
				{#each links as link (link.href)}
					<SidebarMenuItem>
						<SidebarMenuButton
							isActive={page.url.pathname === link.href}
							tooltipContent={link.label}
						>
							{#snippet child({ props })}
								<a href={resolve(link.href)} {...props}>
									<link.icon aria-hidden="true" />
									<span>{link.label}</span>
								</a>
							{/snippet}
						</SidebarMenuButton>
					</SidebarMenuItem>
				{/each}
			</SidebarMenu>
		</SidebarGroup>
	</SidebarContent>
</Sidebar>
