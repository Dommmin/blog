import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface PageProps {
    auth: Auth;
    errors?: Record<string, string>;
    [key: string]: any;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    current?: boolean;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    translations: Record<string, string>;
    locale: string;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface VisitStats {
    date: string;
    count: number;
}

export interface Visit {
    id: number;
    post: Post;
    user: User;
    ip_address: string;
    visited_at: string;
}

export interface File {
    id: number;
    name: string;
    original_name: string;
    mime_type: string;
    url: string;
}

export interface Subscriber {
    id: number;
    email: string;
    confirmed_at: string | null;
    locale: string;
}
