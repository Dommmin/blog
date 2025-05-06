import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import { type Post } from '@/types/blog';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PostCard({ post }: { post: Post }) {
    const { __, locale } = useTranslations();
    return (
        <Card key={post.id} className="border-primary/10 flex flex-col overflow-hidden transition-all hover:shadow-md">
            {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">🖼️</div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">{post.category.name}</span>
                    <span className="text-muted-foreground text-xs">{formatDate(post.published_at, locale)}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <BookOpenIcon className="h-3 w-3" />
                        {post.reading_time} {__('min read')}
                    </span>
                    <Link href={route('blog.show', post.slug)} className="flex items-center" prefetch>
                        <Button variant="ghost" size="sm" className="gap-1">
                            {__('Read more')}
                            <ArrowRightIcon className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
