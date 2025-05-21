export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
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
    translation_key: string | null;
    translations?: Post[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface DataItem {
    id: number;
    name: string;
}