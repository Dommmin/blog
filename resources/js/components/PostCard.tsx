import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import { type Post } from '@/types/blog';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';
import { AnimateStagger } from '@/components/AnimateOnView';

export default function PostCard({ post }: { post: Post }) {
    const { __, locale } = useTranslations();
    return (
        <Card key={post.id} className="border-primary/10 flex flex-col overflow-hidden transition-all hover:shadow-md">
            <AnimateStagger animation="fade-left" stagger={100}>
                <article className="flex flex-1 flex-col p-6">
                    <header className="mb-3 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">{post.category.name}</span>
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
                            <Badge key={tag.id} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <div>
                        {post.comments_count} {post.comments_count === 1 ? __('comment') : __('comments')}
                    </div>
                    <footer className="mt-auto flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <BookOpenIcon className="h-3 w-3" aria-hidden="true" />
                            {post.reading_time !== undefined ? `${post.reading_time} ${__('min read')}` : null}
                        </span>
                        <Link
                            href={route('blog.show', { post: post.slug, locale })}
                            className="flex items-center"
                            prefetch
                            aria-label={`${__('Read more about')} ${post.title}`}
                        >
                            <Button variant="ghost" size="sm" className="gap-1">
                                {__('Read more')}
                                <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                            </Button>
                        </Link>
                    </footer>
                </article>
        </AnimateStagger>
    </Card>
    );
}
