import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    published_at: string;
    user: {
        name: string;
    };
}

interface BlogIndexProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ posts }: BlogIndexProps) {
    return (
        <AppLayout>
            <Head title="Blog" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <Card key={post.id}>
                                {post.image && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={`/storage/${post.image}`} alt={post.title} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>
                                        <Link href={route('blog.show', post.slug)} className="hover:text-blue-600">
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}
                                        {post.user && ` • By ${post.user.name}`}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{post.content.substring(0, 150)}...</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href={route('blog.show', post.slug)} prefetch="hover">
                                        <Button variant="outline" className="cursor-pointer">
                                            Read more
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {(posts.prev_page_url || posts.next_page_url) && (
                        <div className="mt-12">
                            <Pagination className="justify-between">
                                {posts.prev_page_url ? (
                                    <Link href={posts.prev_page_url}>
                                        <Button variant="outline">Previous</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Previous
                                    </Button>
                                )}

                                {posts.next_page_url ? (
                                    <Link href={posts.next_page_url}>
                                        <Button variant="outline">Next</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Next
                                    </Button>
                                )}
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
