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
}
