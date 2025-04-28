import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { type Post } from '@/types/blog';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';

export default function PostCard({ post }: { post: Post }) {
    return (
        <Card key={post.id} className="border-primary/10 flex flex-col overflow-hidden transition-all hover:shadow-md">
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">{post.category.name}</span>
                    <span className="text-muted-foreground text-xs">{formatDate(post.published_at)}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{post?.excerpt}</p>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <BookOpenIcon className="h-3 w-3" />
                        {post?.reading_time} min read
                    </span>
                    <Link href={route('blog.show', post.slug)} className="flex items-center">
                        <Button variant="ghost" size="sm" className="cursor-pointer gap-1">
                            Read more
                            <ArrowRightIcon className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
