import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { type PropsWithChildren } from 'react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader />
                {children}
            </AppContent>
        </AppShell>
    );
}
