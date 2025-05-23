import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRightIcon, CodeIcon, GitBranchIcon, LucideProps, ServerIcon } from 'lucide-react';
import React, { ComponentType, lazy, Suspense, useMemo, useState } from 'react';

const LazyAnimateStagger = lazy(() => import('@/components/AnimateOnView').then((module) => ({ default: module.AnimateStagger })));
const LazyAnimateOnView = lazy(() => import('@/components/AnimateOnView').then((module) => ({ default: module.AnimateOnView })));

const breadcrumbs: BreadcrumbItem[] = [];

const HeroContent = React.memo(({ __ }: { __: (key: string) => string }) => (
    <div className="mb-8 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">{__('PHP')}</span> & <span className="text-primary">{__('DevOps')}</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base lg:text-lg">
            {__('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions')}
        </p>
    </div>
));

const FeatureCard = React.memo(({ icon: Icon, title, description }: { icon: ComponentType<LucideProps>; title: string; description: string }) => (
    <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
        <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
            <Icon className="text-primary h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
    </Card>
));

interface NewsletterFormData {
    email: string;
    [key: string]: string;
}

interface NewsletterFormErrors {
    email?: string;
}

interface NewsletterFormProps {
    data: NewsletterFormData;
    setData: (key: keyof NewsletterFormData, value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: NewsletterFormErrors;
    successMessage: string;
    __: (key: string) => string;
}

const NewsletterForm = React.memo(({ data, setData, handleSubmit, processing, errors, successMessage, __ }: NewsletterFormProps) => (
    <form onSubmit={handleSubmit} className="relative p-8 md:p-12">
        <div className="max-w-md">
            <h2 className="mb-4 text-2xl font-bold">{__('Stay Updated')}</h2>
            <p className="text-muted-foreground mb-6">
                {__('Get notified about new articles and resources on PHP development and DevOps practices')}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                    <input
                        onChange={(e) => setData('email', e.target.value)}
                        type="email"
                        className="focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                        placeholder={__('Enter your email')}
                        value={data.email}
                        autoComplete="email"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
                </div>
                <Button type="submit" disabled={processing}>
                    {__('Subscribe')}
                </Button>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">{__('I respect your privacy. Unsubscribe at any time')}.</p>
        </div>
    </form>
));

interface Feature {
    icon: ComponentType<LucideProps>;
    title: string;
    description: string;
}

export default function Home({ posts }: { posts: Post[] }) {
    const { __, locale } = useTranslations();
    const { data, setData, post, processing, errors, reset } = useForm<NewsletterFormData>({
        email: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubscribe = React.useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            post(route('newsletter.subscribe', { locale: locale }), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setSuccessMessage(__('You have successfully subscribed to our newsletter!'));
                },
            });
        },
        [post, locale, reset, __],
    );

    const features = useMemo<Feature[]>(
        () => [
            {
                icon: CodeIcon,
                title: __('PHP Frameworks'),
                description: __('Laravel & Symfony tips, patterns, and architectural insights'),
            },
            {
                icon: ServerIcon,
                title: __('DevOps'),
                description: __('CI/CD pipelines, containerization'),
            },
            {
                icon: GitBranchIcon,
                title: __('Best Practices'),
                description: __('Clean code, testing strategies, and development workflows'),
            },
        ],
        [__],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            <section className="relative px-4 py-16 md:py-24 lg:py-28">
                <div className="from-primary/5 to-primary/0 dark:from-primary/10 dark:to-primary/5 absolute inset-0 z-0 rounded-3xl bg-gradient-to-br" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <HeroContent __={__} />

                    <Suspense
                        fallback={
                            <div className="mb-12 flex justify-center gap-4">
                                <Button size="lg" asChild>
                                    <Link href={route('blog.index', { locale })} prefetch>
                                        {__('Read the Blog')}
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={route('about', { locale })} prefetch>
                                        {__('About me')}
                                    </Link>
                                </Button>
                            </div>
                        }
                    >
                        <LazyAnimateOnView animation="fade-up" duration="duration-700" delay="delay-300">
                            <div className="mb-12 flex justify-center gap-4">
                                <Button size="lg" asChild>
                                    <Link href={route('blog.index', { locale })} prefetch>
                                        {__('Read the Blog')}
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={route('about', { locale })} prefetch>
                                        {__('About me')}
                                    </Link>
                                </Button>
                            </div>
                        </LazyAnimateOnView>
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="grid gap-6 md:grid-cols-3">
                                {features.map((feature, index) => (
                                    <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                                ))}
                            </div>
                        }
                    >
                        <LazyAnimateStagger animation="fade-up" duration="duration-500" stagger={100}>
                            <div className="grid gap-6 md:grid-cols-3">
                                {features.map((feature, index) => (
                                    <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                                ))}
                            </div>
                        </LazyAnimateStagger>
                    </Suspense>
                </div>
            </section>

            {posts.length > 0 && (
                <section className="px-4 py-16">
                    <div className="mx-auto max-w-5xl">
                        <Suspense
                            fallback={
                                <div className="mb-8 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">{__('Featured Articles')}</h2>
                                    <Button variant="ghost" size="sm" asChild className="gap-1">
                                        <Link href={route('blog.index', { locale })} prefetch>
                                            {__('View all')}
                                            <ArrowRightIcon className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            }
                        >
                            <LazyAnimateOnView animation="fade-right">
                                <div className="mb-8 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">{__('Featured Articles')}</h2>
                                    <Button variant="ghost" size="sm" asChild className="gap-1">
                                        <Link href={route('blog.index', { locale })} prefetch>
                                            {__('View all')}
                                            <ArrowRightIcon className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </LazyAnimateOnView>
                        </Suspense>

                        <Suspense
                            fallback={
                                <div className="grid gap-6 md:grid-cols-2">
                                    {posts.map((post, index) => (
                                        <div key={post.id} className="animate-pulse">
                                            <div className="h-48 rounded-lg bg-gray-200"></div>
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <LazyAnimateStagger animation="fade-up" stagger={200}>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {posts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </LazyAnimateStagger>
                        </Suspense>
                    </div>
                </section>
            )}

            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
                    <Suspense
                        fallback={
                            <Card className="overflow-hidden">
                                <NewsletterForm
                                    data={data}
                                    setData={setData}
                                    handleSubmit={handleSubscribe}
                                    processing={processing}
                                    errors={errors}
                                    successMessage={successMessage}
                                    __={__}
                                />
                            </Card>
                        }
                    >
                        <LazyAnimateOnView animation="zoom-in" duration="duration-700">
                            <Card className="overflow-hidden">
                                <NewsletterForm
                                    data={data}
                                    setData={setData}
                                    handleSubmit={handleSubscribe}
                                    processing={processing}
                                    errors={errors}
                                    successMessage={successMessage}
                                    __={__}
                                />
                            </Card>
                        </LazyAnimateOnView>
                    </Suspense>
                </div>
            </section>
        </AppLayout>
    );
}
