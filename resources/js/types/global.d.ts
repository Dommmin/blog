import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

export interface Flash {
    success?: string;
    error?: string;
}

export interface Pagination {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
