import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs = [], ...props }: AppLayoutProps) {
    return (
        <>
            <AppLayoutTemplate>
                <Toaster />
                {children}
            </AppLayoutTemplate>
        </>
    );
}
