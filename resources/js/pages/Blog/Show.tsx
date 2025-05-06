import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type CommentData, type Post } from '@/types/blog';
import { Head, Link } from '@inertiajs/react';
import 'highlight.js/styles/github-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export default function Show({ post, comments }: { post: Post; comments: CommentData }) {
    const { __ } = useTranslations();
    return (
        <AppLayout>
            <Head title={post.title}>
                <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}${window.location.hash}`} />
            </Head>

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="mb-4">
                                <Link href={route('blog.index')} prefetch>
                                    <Button variant="outline" size="sm">
                                        ← Back to all posts
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle className="text-3xl">{post.title}</CardTitle>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <span>{formatDate(post.published_at)}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/90 prose-strong:font-medium prose-code:before:hidden prose-code:after:hidden prose-ul:pl-6 prose-ol:pl-6 prose-li:my-2 max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[
                                        rehypeSlug,
                                        rehypeHighlight,
                                        // @ts-expect-error - Type definition issue with rehypeSanitize plugin
                                        rehypeSanitize({
                                            tagNames: ['iframe'],
                                            attributes: {
                                                iframe: ['src', 'allow', 'allowfullscreen', 'frameborder', 'style'],
                                                a: ['href', 'name', 'target'],
                                            },
                                        }),
                                    ]}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Comments ({post.comments_count})</CardTitle>
                            {comments.data.map((comment) => (
                                <CommentCard comment={comment} />
                            ))}
                            <div className="text-muted-foreground flex items-center text-sm">
                                <span>Leave a comment</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {(comments.prev_page_url || comments.next_page_url) && (
                                <div className="mt-12">
                                    <Pagination className="justify-between">
                                        {comments.prev_page_url ? (
                                            <Link href={comments.prev_page_url} prefetch>
                                                <Button variant="outline">{__('Previous')}</Button>
                                            </Link>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Previous')}
                                            </Button>
                                        )}

                                        {comments.next_page_url ? (
                                            <Link href={comments.next_page_url} prefetch>
                                                <Button variant="outline">{__('Next')}</Button>
                                            </Link>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Next')}
                                            </Button>
                                        )}
                                    </Pagination>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
