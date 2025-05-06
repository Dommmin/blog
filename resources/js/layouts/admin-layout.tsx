import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AppLayoutProps) {
    return (
        <>
            <AppLayoutTemplate>
                <Toaster />
                {children}
            </AppLayoutTemplate>
        </>
    );
}
