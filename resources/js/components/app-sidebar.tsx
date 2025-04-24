import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Laptop, LayoutGrid, Moon, Sun } from 'lucide-react';
import React from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { appearance, updateAppearance } = useAppearance();

    const themeMap: Record<Appearance, Appearance> = {
        light: 'dark',
        dark: 'system',
        system: 'light',
    };

    const themeIcons: Record<Appearance, React.ReactNode> = {
        light: <Sun className="!size-5 opacity-80 group-hover:opacity-100" />,
        dark: <Moon className="!size-5 opacity-80 group-hover:opacity-100" />,
        system: <Laptop className="!size-5 opacity-80 group-hover:opacity-100" />,
    };

    const nextTheme: Appearance = themeMap[appearance];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    onClick={() => updateAppearance(nextTheme)}
                                    size="lg"
                                    className="text-sidebar-accent-foreground group cursor-pointer"
                                >
                                    <Button variant="ghost" size="icon" aria-label={`Change theme to ${nextTheme}`}>
                                        {themeIcons[nextTheme]}
                                    </Button>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
