import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Post } from '@/types/blog';
import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, CodeIcon, GitBranchIcon, ServerIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [];

export default function Home({ posts }: { posts: Post[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            {/* Hero Section */}
            <section className="relative px-4 py-16 md:py-24 lg:py-28">
                <div className="from-primary/5 to-primary/0 dark:from-primary/10 dark:to-primary/5 absolute inset-0 z-0 rounded-3xl bg-gradient-to-br" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="mb-8 text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Exploring <span className="text-primary">PHP</span> & <span className="text-primary">DevOps</span>
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions
                        </p>
                    </div>
                    <div className="mb-12 flex justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href={route('blog.index')} prefetch>
                                Read the Blog
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href={route('about')}>About Me</Link>
                        </Button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
                            <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                                <CodeIcon className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">PHP Frameworks</h3>
                            <p className="text-muted-foreground">Laravel & Symfony tips, patterns, and architectural insights</p>
                        </Card>
                        <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
                            <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                                <ServerIcon className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">DevOps</h3>
                            <p className="text-muted-foreground">CI/CD pipelines, containerization, and infrastructure as code</p>
                        </Card>
                        <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
                            <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                                <GitBranchIcon className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Best Practices</h3>
                            <p className="text-muted-foreground">Clean code, testing strategies, and development workflows</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Content */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Featured Articles</h2>
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                            <Link href={route('blog.index')} prefetch>
                                View all
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {posts.map((post) => (
                            <PostCard post={post} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section (Optional) */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    <Card className="overflow-hidden">
                        <div className="relative p-8 md:p-12">
                            <div className="max-w-md">
                                <h2 className="mb-4 text-2xl font-bold">Stay Updated</h2>
                                <p className="text-muted-foreground mb-6">
                                    Get notified about new articles and resources on PHP development and DevOps practices.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            className="focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                                            placeholder="Your email address"
                                        />
                                    </div>
                                    <Button>Subscribe</Button>
                                </div>
                                <p className="text-muted-foreground mt-3 text-xs">I respect your privacy. Unsubscribe at any time.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </AppLayout>
    );
}
