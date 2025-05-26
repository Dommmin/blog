import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/useTranslation';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { NotebookPen, Tag } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { __, locale } = useTranslations();

    const mainNavItems: NavItem[] = [
        // {
        //     title: __('Categories'),
        //     href: route('admin.categories.index'),
        //     current: route().current('admin.categories.*'),
        //     icon: LayoutGrid,
        // },
        {
            title: __('Posts'),
            href: route('admin.posts.index'),
            current: route().current('admin.posts.*'),
            icon: NotebookPen,
        },
        {
            title: __('Tags'),
            href: route('admin.tags.index'),
            current: route().current('admin.tags.*'),
            icon: Tag,
        },
    ];

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
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
