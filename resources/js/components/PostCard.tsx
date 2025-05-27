import { AnimateStagger } from '@/components/AnimateOnView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import { type Post } from '@/types/blog';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenIcon, FileIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PostCard({ post }: { post: Post }) {
    const { __, locale } = useTranslations();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);

    return (
        <Card key={post.id} className="border-primary/10 relative flex flex-col overflow-hidden transition-all hover:shadow-md">
            {post.file_id && (
                <span className="text-muted-foreground pointer-events-none absolute top-3 right-3 z-10 opacity-80">
                    <FileIcon className={`h-5 w-5 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
                </span>
            )}
            <AnimateStagger animation="fade-left" stagger={100}>
                <article className="flex flex-1 flex-col px-6">
                    <header className="mb-3 flex items-center gap-2">
                        <time className="text-muted-foreground text-xs" dateTime={post.published_at || post.created_at}>
                            {formatDate(post.published_at, locale)}
                        </time>
                    </header>
                    <h2 className="mb-2 text-xl font-semibold">
                        <Link href={route('blog.show', { post: post.slug, locale })} className="hover:text-primary" prefetch>
                            {post.title}
                        </Link>
                    </h2>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag.id} variant="default" className="tracking-wider">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                    <div>
                        {post.comments_count} {post.comments_count === 1 ? __('comment') : __('comments')}
                    </div>
                    <footer className="mt-auto flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <BookOpenIcon className="h-3 w-3" aria-hidden="true" />
                            {post.reading_time} {__('min read')}
                        </span>
                        <Link
                            href={route('blog.show', { post: post.slug, locale })}
                            className="flex items-center"
                            prefetch
                            aria-label={`${__('Read more about')} ${post.title}`}
                        >
                            <Button variant="ghost" size="sm" className="gap-1">
                                {__('Read article')}
                                <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                            </Button>
                        </Link>
                    </footer>
                </article>
            </AnimateStagger>
        </Card>
    );
}
