export interface Category {
    id: number;
    name: string;
    created_at: string;
}

export interface Tag {
    id: string;
    name: string;
    created_at: string;
}

export interface DataItem {
    label: string;
    value: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    published_at: string;
    reading_time: number;
    slug: string;
    category_id: string;
    category: Category;
    tags: Tag[];
    image?: string;
    comments_count: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    author: User;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CommentData {
    data: Comment[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
