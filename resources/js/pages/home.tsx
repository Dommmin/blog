import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRightIcon, CodeIcon, GitBranchIcon, LucideProps, ServerIcon } from 'lucide-react';
import React, { ComponentType, memo, useCallback, useMemo, useState } from 'react';

// Preload critical animations only when needed
const AnimateOnView = React.lazy(() =>
    import('@/components/AnimateOnView').then(module => ({
        default: module.AnimateOnView
    }))
);

const AnimateStagger = React.lazy(() =>
    import('@/components/AnimateOnView').then(module => ({
        default: module.AnimateStagger
    }))
);

const breadcrumbs: BreadcrumbItem[] = [];

// Memoized hero section without animations for faster initial render
const HeroContent = memo(({ __ }: { __: (key: string) => string }) => (
    <div className="mb-8 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">{__('PHP')}</span> & <span className="text-primary">{__('DevOps')}</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base lg:text-lg">
            {__('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions')}
        </p>
    </div>
));

// Optimized feature card with minimal re-renders
const FeatureCard = memo(({
    icon: Icon,
    title,
    description
}: {
    icon: ComponentType<LucideProps>;
    title: string;
    description: string;
}) => (
    <Card className="border-primary/20 p-6 text-center transition-all hover:shadow-md">
        <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
            <Icon className="text-primary h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
));

// Optimized newsletter form with better error handling
interface NewsletterFormData {
    email: string;
}

interface NewsletterFormErrors {
    email?: string;
}

const NewsletterForm = memo(({
    data,
    setData,
    handleSubmit,
    processing,
    errors,
    successMessage,
    __
}: {
    data: NewsletterFormData;
    setData: (key: keyof NewsletterFormData, value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: NewsletterFormErrors;
    successMessage: string;
    __: (key: string) => string;
}) => (
    <div className="relative p-6 md:p-8">
        <div className="max-w-md">
            <h2 className="mb-4 text-2xl font-bold">{__('Stay Updated')}</h2>
            <p className="text-muted-foreground mb-6 text-sm">
                {__('Get notified about new articles and resources on PHP development and DevOps practices')}.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                    <input
                        onChange={(e) => setData('email', e.target.value)}
                        type="email"
                        className="focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none transition-colors"
                        placeholder={__('Enter your email')}
                        value={data.email}
                        autoComplete="email"
                        required
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-500" role="alert">
                            {errors.email}
                        </p>
                    )}
                    {successMessage && (
                        <p className="mt-2 text-sm text-green-500" role="status">
                            {successMessage}
                        </p>
                    )}
                </div>
                <Button type="submit" disabled={processing} className="shrink-0">
                    {processing ? __('Subscribing...') : __('Subscribe')}
                </Button>
            </form>
            <p className="text-muted-foreground mt-3 text-xs">
                {__('I respect your privacy. Unsubscribe at any time')}.
            </p>
        </div>
    </div>
));

interface Feature {
    icon: ComponentType<LucideProps>;
    title: string;
    description: string;
}

export default function Home({ posts }: { posts: Post[] }) {
    const { __, locale } = useTranslations();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<NewsletterFormData>({
        email: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [animationsLoaded, setAnimationsLoaded] = useState(false);

    // Memoize features to prevent recreating on every render
    const features = useMemo((): Feature[] => [
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
    ], [__]);

    // Newsletter subscription handler
    const handleSubscribe = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            setSuccessMessage('');
            clearErrors();

            post(route('newsletter.subscribe', { locale }), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setSuccessMessage(__('You have successfully subscribed to our newsletter!'));
                },
            });
        },
        [post, locale, reset, clearErrors, __],
    );

    // Load animations after initial render
    React.useEffect(() => {
        const timer = setTimeout(() => setAnimationsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Memoized feature cards
    const featuresSection = useMemo(() => (
        <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
                <FeatureCard
                    key={`feature-${index}`}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    ), [features]);

    // Memoized posts section
    const postsSection = useMemo(() => (
        <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    ), [posts]);

    // Memoized action buttons
    const actionButtons = useMemo(() => (
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
    ), [locale, __]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>{__('Home')}</title>
                <meta name="description" content={__('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions')} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>

            {/* Hero Section - Critical Above-the-fold Content */}
            <section className="relative px-4 py-16 md:py-20 lg:py-24">
                <div className="from-primary/5 to-primary/0 dark:from-primary/10 dark:to-primary/5 absolute inset-0 z-0 bg-gradient-to-br xl:rounded-b-3xl" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <HeroContent __ ={__} />

                    {/* Render buttons immediately, add animations later */}
                    {animationsLoaded ? (
                        <React.Suspense fallback={actionButtons}>
                            <AnimateOnView animation="fade-up" duration="duration-700" delay="delay-300">
                                {actionButtons}
                            </AnimateOnView>
                        </React.Suspense>
                    ) : (
                        actionButtons
                    )}

                    {/* Features Section */}
                    {animationsLoaded ? (
                        <React.Suspense fallback={featuresSection}>
                            <AnimateStagger animation="fade-up" duration="duration-500" stagger={100}>
                                {featuresSection}
                            </AnimateStagger>
                        </React.Suspense>
                    ) : (
                        featuresSection
                    )}
                </div>
            </section>

            {/* Posts Section */}
            {posts.length > 0 && (
                <section className="px-4 py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{__('Featured Articles')}</h2>
                            <Button variant="ghost" size="sm" asChild className="gap-1">
                                <Link href={route('blog.index', { locale })} prefetch>
                                    {__('View all')}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {animationsLoaded ? (
                            <React.Suspense fallback={postsSection}>
                                <AnimateStagger animation="fade-up" stagger={200}>
                                    {postsSection}
                                </AnimateStagger>
                            </React.Suspense>
                        ) : (
                            postsSection
                        )}
                    </div>
                </section>
            )}

            {/* Newsletter Section */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-5xl">
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
                </div>
            </section>
        </AppLayout>
    );
}