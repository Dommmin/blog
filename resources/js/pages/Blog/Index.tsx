import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/blog';
import { Head, Link } from '@inertiajs/react';

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
                            <PostCard post={post} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {(posts.prev_page_url || posts.next_page_url) && (
                        <div className="mt-12">
                            <Pagination className="justify-between">
                                {posts.prev_page_url ? (
                                    <Link href={posts.prev_page_url} prefetch>
                                        <Button variant="outline" className="cursor-pointer">Previous</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Previous
                                    </Button>
                                )}

                                {posts.next_page_url ? (
                                    <Link href={posts.next_page_url} prefetch>
                                        <Button variant="outline" className="cursor-pointer">Next</Button>
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
