import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRightIcon, CodeIcon, GitBranchIcon, ServerIcon } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [];

function Hero({ __ }: { __: (key: string) => string }) {
    return (
        <div className="mb-8 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="text-primary">{__('PHP')}</span> & <span className="text-primary">{__('DevOps')}</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base lg:text-lg">
                {__('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions')}
            </p>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
            <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                <Icon className="text-primary h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
        </Card>
    );
}

export default function Home({ posts }: { posts: Post[] }) {
    const { __, locale } = useTranslations();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({ email: '' });
    const [successMessage, setSuccessMessage] = useState('');

    function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        setSuccessMessage('');
        clearErrors();

        post(route('newsletter.subscribe', { locale }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSuccessMessage(__('You have successfully subscribed to our newsletter!'));
            },
        });
    }

    const features = [
        { icon: CodeIcon, title: __('PHP Frameworks'), description: __('Laravel & Symfony tips, patterns, and architectural insights') },
        { icon: ServerIcon, title: __('DevOps'), description: __('CI/CD pipelines, containerization') },
        { icon: GitBranchIcon, title: __('Best Practices'), description: __('Clean code, testing strategies, and development workflows') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Home')}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <section className="relative px-4 py-16 md:py-24 lg:py-28">
                <div className="mx-auto max-w-5xl">
                    <Hero __={__} />

                    <div className="mb-12 flex justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href={route('blog.index', { locale })}>
                                {__('Read the Blog')}
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href={route('about', { locale })}>{__('About me')}</Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {posts.length > 0 && (
                <section className="px-4 py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{__('Featured Articles')}</h2>
                            <Button variant="ghost" size="sm" asChild className="gap-1">
                                <Link href={route('blog.index', { locale })}>
                                    {__('View all')}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    <Card className="overflow-hidden p-8 md:p-12">
                        <form onSubmit={handleSubscribe} className="max-w-md">
                            <h2 className="mb-4 text-2xl font-bold">{__('Stay Updated')}</h2>
                            <p className="text-muted-foreground mb-6">
                                {__('Get notified about new articles and resources on PHP development and DevOps practices')}.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                                        placeholder={__('Enter your email')}
                                        autoComplete="email"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                                    {successMessage && <p className="mt-2 text-sm text-green-500">{successMessage}</p>}
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {__('Subscribe')}
                                </Button>
                            </div>
                            <p className="text-muted-foreground mt-3 text-xs">{__('I respect your privacy. Unsubscribe at any time')}.</p>
                        </form>
                    </Card>
                </div>
            </section>
        </AppLayout>
    );
}
