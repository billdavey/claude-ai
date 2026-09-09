<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem
	} from '$lib/components/ui/sidebar';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/app/dashboard', label: 'Dashboard' },
		{ href: '/app/playwright', label: 'Playwright' },
		{ href: '/app/profile', label: 'Profile' }
	];
</script>

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
