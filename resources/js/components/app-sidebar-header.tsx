import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { Laptop, Moon, Sun } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
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
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                {/*<SidebarMenuButton*/}
                {/*    onClick={() => updateAppearance(nextTheme)}*/}
                {/*    size="lg"*/}
                {/*    className="text-sidebar-accent-foreground group cursor-pointer"*/}
                {/*>*/}
                    <Button onClick={() => updateAppearance(nextTheme)} variant="ghost" size="icon" aria-label={`Change theme to ${nextTheme}`}>
                        {themeIcons[nextTheme]}
                    </Button>
                {/*</SidebarMenuButton>*/}
            </div>
        </header>
    );
}
