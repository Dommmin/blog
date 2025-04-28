export interface Category {
    id: number;
    name: string;
    created_at: string;
}

export interface Tag {
    id: number;
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
    slug: string;
    content: string;
    excerpt: string;
    published_at: string | null;
    reading_time: number;
    category: Category;
    tags: Tag[];
}
