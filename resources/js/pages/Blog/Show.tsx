import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import 'highlight.js/styles/github-dark.css';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

interface Post {
    title: string;
    slug: string;
    content: string;
    published_at: string;
    user: {
        name: string;
    };
}

interface ShowProps {
    post: Post;
}

export default function Show({ post }: ShowProps) {
    useEffect(() => {
        const handleInitialHash = () => {
            if (window.location.hash) {
                const targetId = window.location.hash.replace('#', '');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    }, 100);
                }
            }
        };

        handleInitialHash();

        return () => {
            window.history.replaceState(null, '', window.location.pathname);
        };
    }, []);

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
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        ← Back to all posts
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle className="text-3xl">{post.title}</CardTitle>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <span>{post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}</span>
                                {post.user && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span>By {post.user.name}</span>
                                    </>
                                )}
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
                </div>
            </div>
        </AppLayout>
    );
}
