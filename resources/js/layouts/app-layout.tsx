import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import DefaultMeta from '@/components/default-meta';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
}

export default ({ children, breadcrumbs, title, description, ...props }: AppLayoutProps) => (
    <>
        <DefaultMeta title={title} description={description} />
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </>
);
