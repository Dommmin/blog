// resources/js/types/post.d.ts
interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}
