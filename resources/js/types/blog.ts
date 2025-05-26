export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
    category_id: number;
    author: User;
    category: Category;
    tags: Tag[];
    comments_count: number;
    language: string;
    translation_key: string;
    reading_time?: number;
    translations?: Post[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at: string;
}

export interface User {
    id: number;
    admin: boolean;
    avatar: string;
    email: string;
    name: string;
}

export interface DataItem {
    value: string;
    label: string;
}

export interface Comment {
    id: number;
    content: string;
    author: User;
    post_id: number;
    created_at: string;
}

export interface CommentData {
    data: Comment[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
