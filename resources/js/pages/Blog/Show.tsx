import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type CommentData, type Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import 'highlight.js/styles/github-dark.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export default function Show({ post, comments }: { post: Post; comments: CommentData }) {
    const { __, locale } = useTranslations();
    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
    } = useForm({
        content: '',
        post_id: post.id,
    });

    const handleCommentSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submitForm(route('blog.comments.store', { post: post.id, locale: locale }), {
            preserveScroll: true,
            onSuccess: () => {
                setData('content', '');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <nav aria-label="Breadcrumb" className="mb-4 flex justify-between">
                                <Link href={route('blog.index', { locale: locale })} prefetch>
                                    <Button variant="outline" size="sm">
                                        ← {__('Back to all posts')}
                                    </Button>
                                </Link>
                                <div>
                                    {post.file && (
                                        <a
                                            title={post.file.original_name}
                                            href={post.file.url}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            download={post.file.original_name}
                                        >
                                            <Button variant="outline" size="sm">
                                                {__('Download File')}
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </nav>
                            <CardTitle className="text-3xl">{post.title}</CardTitle>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <time dateTime={post.published_at || post.created_at}>{formatDate(post.published_at)}</time>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <article className="prose dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/90 prose-strong:font-medium prose-code:before:hidden prose-code:after:hidden prose-ul:pl-6 prose-ol:pl-6 prose-li:my-2 max-w-none">
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
                            </article>
                        </CardContent>
                    </Card>

                    <div className="mt-8 transform transition-all duration-700">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {__('Comments')} ({post.comments_count})
                                </CardTitle>
                                <section className="space-y-4" aria-label="Comments">
                                    {comments.data.map((comment) => (
                                        <CommentCard key={comment.id} comment={comment} post={post} />
                                    ))}
                                </section>
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <span>{__('Leave a comment')}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCommentSubmit} className="mt-4">
                                    <textarea
                                        className="w-full rounded border p-2"
                                        placeholder={__('Write your comment here...')}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        required
                                        aria-label={__('Comment text')}
                                    />
                                    <Button type="submit" variant="outline" className="mt-2" disabled={processing}>
                                        {__('Submit Comment')}
                                    </Button>
                                </form>
                                {(comments.prev_page_url || comments.next_page_url) && (
                                    <nav aria-label="Comments pagination" className="mt-12">
                                        <Pagination className="justify-between">
                                            {comments.prev_page_url ? (
                                                <Link preserveScroll href={comments.prev_page_url} prefetch>
                                                    <Button variant="outline" aria-label={__('Previous comments page')}>
                                                        {__('Previous')}
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button variant="outline" disabled aria-label={__('Previous comments page')}>
                                                    {__('Previous')}
                                                </Button>
                                            )}

                                            <div>
                                                <span className="text-muted-foreground">
                                                    {__('Page')} {comments.current_page} {__('of')} {comments.last_page}
                                                </span>
                                            </div>

                                            {comments.next_page_url ? (
                                                <Link preserveScroll href={comments.next_page_url} prefetch>
                                                    <Button variant="outline" aria-label={__('Next comments page')}>
                                                        {__('Next')}
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button variant="outline" disabled aria-label={__('Next comments page')}>
                                                    {__('Next')}
                                                </Button>
                                            )}
                                        </Pagination>
                                    </nav>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
